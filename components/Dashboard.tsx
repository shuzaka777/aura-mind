import React, { useState, useEffect } from 'react';
import type { AppData, MentalHealthDataPoint, EmotionTrigger } from '../types';
import OverviewCharts from './MentalHealthChart';
import DailyQuestionnaire from './DailyCheckin';
import DailySliders from './DailySliders';
import { motivationalQuotes } from '../services/dataService';
import { getDynamicSuggestions } from '../services/geminiService';

// Sub-component for Motivational Quote
const MotivationalQuote: React.FC = () => {
    const [quote, setQuote] = useState('');
    useEffect(() => {
        setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    }, []);

    return (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-slate-200/50 dark:border-slate-700/50">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">A Thought for Today</h3>
            <p className="text-gray-600 dark:text-gray-300 italic">"{quote}"</p>
        </div>
    );
};

// Sub-component for AI Suggestions
const Suggestions: React.FC<{ mentalHealthData: MentalHealthDataPoint[] }> = ({ mentalHealthData }) => {
    const [suggestions, setSuggestions] = useState<{ books: any[], activities: any[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (mentalHealthData.length > 0) {
                setIsLoading(true);
                const result = await getDynamicSuggestions(mentalHealthData);
                setSuggestions(result);
                setIsLoading(false);
            }
        };
        fetchSuggestions();
    }, [mentalHealthData]);

    if (mentalHealthData.length === 0 && !isLoading) return null;

    return (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-slate-200/50 dark:border-slate-700/50">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Personalized for You</h3>
            {isLoading ? <p className="text-slate-500 dark:text-slate-400">Generating suggestions...</p> : (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Book Suggestions</h4>
                        <ul className="space-y-2">
                            {suggestions?.books.map((book, index) => (
                                <li key={index} className="text-sm">
                                    <strong className="text-gray-800 dark:text-gray-200">{book.title}</strong> by {book.author}
                                    <p className="text-slate-500 dark:text-slate-400 text-xs italic">"{book.reason}"</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Activity Suggestions</h4>
                         <ul className="space-y-2">
                            {suggestions?.activities.map((activity, index) => (
                                <li key={index} className="text-sm">
                                    <strong className="text-gray-800 dark:text-gray-200">{activity.name}</strong>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs italic">"{activity.reason}"</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

// Sub-component for Emotion Triggers
const TriggersSummary: React.FC<{ triggers: EmotionTrigger[] }> = ({ triggers }) => {
    const lastTrigger = triggers.length > 0 ? triggers[triggers.length - 1] : null;

    return (
         <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-slate-200/50 dark:border-slate-700/50">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Emotion Watch</h3>
            {lastTrigger ? (
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Last identified emotion:</p>
                    <p className="font-semibold text-red-500">{lastTrigger.identifiedEmotion}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">From message on {new Date(lastTrigger.date).toLocaleDateString()}</p>
                </div>
            ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No strong emotional triggers have been identified recently. Keep reflecting!</p>
            )}
        </div>
    );
};

interface DashboardProps {
  appData: AppData;
  addHealthDataPoint: (newData: { mood: number | null, stress: number | null, energy: number | null, source: 'Check-in' | 'Chat' | 'Questionnaire' }) => void;
  handleDataUpdate: (data: Partial<AppData>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ appData, addHealthDataPoint, handleDataUpdate }) => {
    
    const handleQuestionnaireComplete = (mood: number | null, stress: number | null, energy: number | null, summary: string) => {
        addHealthDataPoint({ mood, stress, energy, source: 'Questionnaire' });
    };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-600 to-green-800">Welcome back, {appData.userProfile.name}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here is your wellness journey overview.</p>
      </div>
      
      <DailySliders addHealthDataPoint={addHealthDataPoint} mentalHealthData={appData.mentalHealthData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <DailyQuestionnaire 
                onQuestionnaireComplete={handleQuestionnaireComplete}
                previousAnswers={appData.questionnaireAnswers}
            />
            <Suggestions mentalHealthData={appData.mentalHealthData} />
        </div>
        <div className="lg:col-span-1 space-y-6">
            <MotivationalQuote />
            <TriggersSummary triggers={appData.emotionTriggers} />
        </div>
      </div>

      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-4 md:p-6 border border-slate-200/50 dark:border-slate-700/50">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Trends</h3>
        <OverviewCharts data={appData.mentalHealthData} aiName={appData.aiName} />
      </div>
    </div>
  );
};

export default Dashboard;