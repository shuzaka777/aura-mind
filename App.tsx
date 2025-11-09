// Fix: Provide full content for App.tsx
import React, { useState, useEffect } from 'react';
import type { AppData, ChatMessage, MentalHealthDataPoint, JournalEntry, UserProfile, EmotionTrigger, AiCustomizationSettings, CommunityPost, JourneyItem } from './types';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import Journal from './components/Journal';
import TherapistTab from './components/TherapistTab';
import Profile from './components/Profile';
import Exercises from './components/Exercises';
import Community from './components/Community';
import MyJourney from './components/MyJourney';
import { getChatbotResponse, analyzeMessageForHealthMetrics, analyzeMessageForEmotionTriggers } from './services/geminiService';
import { meditationVideos, communityPosts, journeyItems } from './services/dataService';

const initialData: AppData = {
  userProfile: { name: 'Alex', age: 28, gender: 'Non-binary', height: 175, weight: 70, avatarUrl: '', email: null, mobileNumber: null },
  therapist: { name: 'Dr. Anya Sharma', title: 'PsyD, Clinical Psychologist', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
  aiName: 'Aura',
  aiSettings: {
    personality: 'nurturing',
    responseStyle: 'concise',
  },
  chatHistory: [
    { id: 'c1', sender: 'ai', text: 'Hello Alex, how are you feeling today? I\'m here to listen without judgment.' }
  ],
  mentalHealthData: [
    { date: '2023-10-26', source: 'Check-in', mood: 6, stress: 7, energy: 5 },
    { date: '2023-10-27', source: 'Check-in', mood: 7, stress: 5, energy: 6 },
  ],
  journalEntries: [
    { id: 'j1', date: new Date(Date.now() - 86400000).toISOString(), title: 'A tough day', content: 'Work was really stressful today. I felt overwhelmed by my to-do list.' }
  ],
  questionnaireAnswers: [],
  emotionTriggers: [],
  meditationVideos: meditationVideos,
  communityPosts: communityPosts,
  journeyItems: journeyItems,
};

type View = 'dashboard' | 'chat' | 'journal' | 'exercises' | 'therapist' | 'profile' | 'my-journey' | 'community';

const App: React.FC = () => {
  const [appData, setAppData] = useState<AppData>(initialData);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Simple persistence with localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('aura-app-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Ensure all keys from initialData are present to avoid crashes on new features
        setAppData({ ...initialData, ...parsedData });
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aura-app-data', JSON.stringify(appData));
  }, [appData]);

  const handleDataUpdate = (data: Partial<AppData>) => {
    setAppData(prev => ({ ...prev, ...data }));
  };
  
  const handleAiSettingsUpdate = (settings: AiCustomizationSettings) => {
    setAppData(prev => ({...prev, aiSettings: settings}));
  };

  const addHealthDataPoint = (newData: { mood: number | null, stress: number | null, energy: number | null, source: 'Check-in' | 'Chat' | 'Questionnaire' }) => {
    const todayStr = new Date().toLocaleDateString('en-CA');
    
    if (newData.source === 'Check-in') {
      const existingIndex = appData.mentalHealthData.findIndex(d => d.date === todayStr && d.source === 'Check-in');
      if (existingIndex > -1) {
        const updatedData = [...appData.mentalHealthData];
        updatedData[existingIndex] = { ...updatedData[existingIndex], ...newData, date: todayStr };
        setAppData(prev => ({ ...prev, mentalHealthData: updatedData }));
        return;
      }
    }
    
    const dataPoint: MentalHealthDataPoint = {
      ...newData,
      date: todayStr,
    };
    setAppData(prev => ({ ...prev, mentalHealthData: [...prev.mentalHealthData, dataPoint] }));
  };

  const handleSendMessage = async (message: string) => {
    setIsChatLoading(true);
    const newUserMessage: ChatMessage = { id: `c${Date.now()}`, sender: 'user', text: message };
    
    setAppData(prev => ({ ...prev, chatHistory: [...prev.chatHistory, newUserMessage] }));

    const updatedHistory = [...appData.chatHistory, newUserMessage];
    const { aiName, aiSettings } = appData;

    const [botResponse, healthMetrics, emotionTrigger] = await Promise.all([
        getChatbotResponse(updatedHistory, message, aiName, aiSettings),
        analyzeMessageForHealthMetrics(message),
        analyzeMessageForEmotionTriggers(message)
    ]);
    
    const newAiMessage: ChatMessage = { id: `c${Date.now() + 1}`, sender: 'ai', text: botResponse };
    setAppData(prev => ({ ...prev, chatHistory: [...prev.chatHistory, newAiMessage] }));

    if (healthMetrics.mood || healthMetrics.stress || healthMetrics.energy) {
        addHealthDataPoint({ ...healthMetrics, source: 'Chat' });
    }
    
    if (emotionTrigger.identifiedEmotion) {
        const newTrigger: EmotionTrigger = {
            date: new Date().toISOString(),
            identifiedEmotion: emotionTrigger.identifiedEmotion
        };
        setAppData(prev => ({ ...prev, emotionTriggers: [...prev.emotionTriggers, newTrigger]}));
    }

    setIsChatLoading(false);
  };
  
  const handleAddJournalEntry = (entry: JournalEntry) => {
    setAppData(prev => ({...prev, journalEntries: [...prev.journalEntries, entry]}));
  };
  
  const handleProfileUpdate = (profile: UserProfile) => {
      setAppData(prev => ({...prev, userProfile: profile}));
  };

  const handleAddCommunityPost = (content: string) => {
    const newPost: CommunityPost = {
        id: `p${Date.now()}`,
        author: appData.userProfile.name, // In a real app, this might be anonymized
        avatar: appData.userProfile.avatarUrl || `https://i.pravatar.cc/150?u=${appData.userProfile.name}`,
        content,
        timestamp: new Date().toISOString(),
        supports: 0,
        supportedByMe: false,
    };
    setAppData(prev => ({...prev, communityPosts: [newPost, ...prev.communityPosts]}));
  };

  const handleTogglePostSupport = (postId: string) => {
    setAppData(prev => ({...prev, communityPosts: prev.communityPosts.map(p => {
        if (p.id === postId) {
            return { ...p, supports: p.supportedByMe ? p.supports -1 : p.supports + 1, supportedByMe: !p.supportedByMe };
        }
        return p;
    })}));
  };

  const handleAddJourneyItem = (item: Omit<JourneyItem, 'id'>) => {
    const newItem: JourneyItem = {
        ...item,
        id: `ji${Date.now()}`
    };
    setAppData(prev => ({...prev, journeyItems: [newItem, ...prev.journeyItems]}));
  };
  
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard appData={appData} addHealthDataPoint={addHealthDataPoint} handleDataUpdate={handleDataUpdate} />;
      case 'chat':
        return <Chatbot messages={appData.chatHistory} onSendMessage={handleSendMessage} isLoading={isChatLoading} aiName={appData.aiName} onAiNameChange={(name) => handleDataUpdate({ aiName: name })} aiSettings={appData.aiSettings} onAiSettingsChange={handleAiSettingsUpdate} />;
      case 'journal':
        return <Journal entries={appData.journalEntries} onAddEntry={handleAddJournalEntry} />;
      case 'exercises':
        return <Exercises videos={appData.meditationVideos} />;
      case 'my-journey':
        return <MyJourney items={appData.journeyItems} onAddItem={handleAddJourneyItem} />;
      case 'community':
        return <Community posts={appData.communityPosts} onAddPost={handleAddCommunityPost} onToggleSupport={handleTogglePostSupport} />;
      case 'therapist':
        return <TherapistTab appData={appData} />;
      case 'profile':
        return <Profile appData={appData} onProfileUpdate={handleProfileUpdate} />;
      default:
        return <Dashboard appData={appData} addHealthDataPoint={addHealthDataPoint} handleDataUpdate={handleDataUpdate} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <div className="md:w-64 md:flex-shrink-0">
        <Navigation currentView={currentView} setCurrentView={setCurrentView} aiName={appData.aiName} />
      </div>
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;