import { GoogleGenAI, Type } from "@google/genai";
import type { ChatMessage, MentalHealthDataPoint, QuestionnaireQuestion, QuestionnaireAnswer, JournalEntry, AiCustomizationSettings } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  const root = document.getElementById('root');
  if (root) {
      root.innerHTML = `<div style="font-family: sans-serif; padding: 2rem; text-align: center; color: #ef4444;">
          <h1 style="font-size: 1.5rem; font-weight: bold;">API Key Not Found</h1>
          <p style="margin-top: 1rem;">The Google Gemini API key is missing. Please ensure it is configured correctly in the environment.</p>
      </div>`;
  }
  throw new Error("API Key not found. Please configure process.env.API_KEY.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const healthMetricsSchema = {
  type: Type.OBJECT,
  properties: {
    mood: { type: Type.INTEGER, description: "User's mood level from 1 (very negative) to 10 (very positive). Return null if not determinable." },
    stress: { type: Type.INTEGER, description: "User's stress level from 1 (very low) to 10 (very high). Return null if not determinable." },
    energy: { type: Type.INTEGER, description: "User's energy level from 1 (very low) to 10 (very high). Return null if not determinable." },
  },
  required: ["mood", "stress", "energy"],
};

export const getChatbotResponse = async (history: ChatMessage[], newUserMessage: string, aiName: string, aiSettings: AiCustomizationSettings): Promise<string> => {
  try {
    const personalityDescription = {
        nurturing: "You are serene, warm, and empathetic. Your purpose is to provide a safe, non-judgmental space for users to explore their feelings. Always respond with compassion and understanding. Ask gentle, open-ended questions to encourage reflection. When you detect high distress, sadness, or anxiety, validate their feelings explicitly (e.g., \"That sounds incredibly difficult,\" or \"It's completely understandable that you'd feel that way.\").",
        direct: "You are a straightforward and clear-thinking companion. Your goal is to help users identify core issues and consider practical steps. You are still supportive but avoid overly emotional language in favor of clarity and directness. Ask probing questions that help the user think critically about their situation.",
        playful: "You are a cheerful and optimistic AI. You use lighthearted analogies and humor (appropriately) to help users reframe negative thoughts. You are encouraging and energetic, aiming to lift the user's spirits while still being a good listener. Your tone is positive and friendly."
    };

    const styleDescription = {
        concise: "Keep your responses concise and to the point, typically 1-3 sentences.",
        detailed: "Provide more detailed and thorough responses, offering deeper explanations and multiple perspectives where appropriate."
    };

    const systemInstruction = `Your name is ${aiName}. You are an AI mental health companion. 
    ${personalityDescription[aiSettings.personality]}
    ${styleDescription[aiSettings.responseStyle]}
    - Always remember your name is ${aiName}. Weave your name into the conversation naturally when it feels appropriate.
    - Do NOT provide medical advice. If the user expresses severe distress or mentions self-harm, gently and firmly guide them to seek help from a crisis hotline or a mental health professional.
    - Maintain a calm and supportive tone throughout the conversation.`;

    const contents = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: newUserMessage }] });
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: { systemInstruction, temperature: 0.8, topP: 0.9 }
    });

    return response.text;
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    return "I'm having a little trouble connecting right now. Please try again later.";
  }
};

export const analyzeMessageForHealthMetrics = async (userMessage: string): Promise<Omit<MentalHealthDataPoint, 'date' | 'source'>> => {
  try {
    const prompt = `Analyze the following text from a user in a mental health app. Based on their message, estimate their current mood, stress, and energy levels on a scale of 1 to 10. If a metric cannot be reasonably determined, return null. User message: "${userMessage}"`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema: healthMetricsSchema }
    });
    const result = JSON.parse(response.text.trim());
    return { mood: result.mood, stress: result.stress, energy: result.energy };
  } catch (error) {
    console.error("Error analyzing message for health metrics:", error);
    return { mood: null, stress: null, energy: null };
  }
};

export const analyzeMessageForEmotionTriggers = async (userMessage: string): Promise<{ identifiedEmotion: string | null }> => {
    try {
        const prompt = `Analyze the user's message for strong emotional signals like severe anxiety, depression, anger, or hopelessness. If a strong signal is detected, identify the primary emotion (e.g., 'Anxiety', 'Sadness'). If not, return null. User message: '${userMessage}'`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { identifiedEmotion: { type: Type.STRING, description: "The primary negative emotion detected, or null." } }
                }
            }
        });
        const result = JSON.parse(response.text.trim());
        return result;
    } catch (error) {
        console.error("Error analyzing for emotion triggers:", error);
        return { identifiedEmotion: null };
    }
}

export const generateDailyQuestions = async (previousQuestions: string[]): Promise<QuestionnaireQuestion[]> => {
    try {
        const prompt = `You are a mental health expert. Generate 3 short, open-ended, and insightful daily check-in questions for a mental health app. The questions should encourage self-reflection. Avoid questions that have been asked recently. Here are some recent questions to avoid: ${JSON.stringify(previousQuestions)}. Return a JSON array of objects, each with 'id' (a unique string) and 'text' properties.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { id: { type: Type.STRING }, text: { type: Type.STRING } }
                    }
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error generating daily questions:", error);
        return [
            { id: 'fallback1', text: "What's one thing that brought you a moment of peace today?" },
            { id: 'fallback2', text: "How are you feeling in your body right now?" },
            { id: 'fallback3', text: "What is something you're looking forward to?" },
        ];
    }
}

export const analyzeQuestionnaireAnswers = async (answers: QuestionnaireAnswer[]): Promise<{ summary: string; mood: number | null; stress: number | null; energy: number | null; }> => {
    try {
        const prompt = `A user has answered their daily reflection questions. Based on their answers, provide a brief, encouraging one-sentence summary of their current state. Also, estimate their mood, stress, and energy levels on a scale of 1 to 10. User answers: ${JSON.stringify(answers)}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING, description: "A brief, encouraging summary." },
                        ...healthMetricsSchema.properties,
                    },
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error analyzing questionnaire answers:", error);
        return { summary: "Thank you for sharing your thoughts.", mood: null, stress: null, energy: null };
    }
}

export const getDynamicSuggestions = async (history: MentalHealthDataPoint[]): Promise<{ books: any[], activities: any[] }> => {
    try {
        const prompt = `Based on the user's recent mental health data, suggest 2 relevant self-help books and 3 simple, actionable wellness activities. For each, provide a short, compelling reason why it's a good fit for them right now. Recent data: ${JSON.stringify(history.slice(-5))}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        books: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    author: { type: Type.STRING },
                                    reason: { type: Type.STRING }
                                }
                            }
                        },
                        activities: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    reason: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error getting dynamic suggestions:", error);
        return {
            books: [{ title: 'The Gifts of Imperfection', author: 'Brené Brown', reason: 'A powerful read on embracing who you are.' }],
            activities: [{ name: 'Go for a 10-minute walk', reason: 'Gentle movement can help clear your mind.' }]
        };
    }
};

export const generateTherapistReport = async (data: { mentalHealth: MentalHealthDataPoint[], journal: JournalEntry[] }): Promise<string> => {
    try {
        const prompt = `You are a clinical psychologist's AI assistant. Generate a concise, professional summary of a patient's recent activity in their mental health app. The report should be structured for a therapist to quickly understand trends and key concerns. Use the provided data.

        Data:
        - Recent Health Metrics (last 7 days): ${JSON.stringify(data.mentalHealth.slice(-7))}
        - Recent Journal Entries (last 2): ${JSON.stringify(data.journal.slice(-2))}

        Report Structure:
        1.  **Overall Summary:** A brief, 2-3 sentence overview of the patient's general state, noting any significant positive or negative trends.
        2.  **Key Metrics Analysis:** Analyze trends in mood, stress, and energy. Mention any notable highs, lows, or volatility.
        3.  **Thematic Concerns from Journal:** Briefly summarize the main themes or concerns expressed in the recent journal entries.
        4.  **Points for Discussion:** Suggest 2-3 open-ended questions the therapist might ask based on the data to facilitate conversation.
        
        Keep the tone objective and clinical. Do not add any introductory or concluding remarks outside of the report structure.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Using a more powerful model for better analysis
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating therapist report:", error);
        return "Failed to generate report. There was an issue connecting to the analysis service.";
    }
};