import React, { useState } from 'react';
import type { AppData, NearbyTherapist } from '../types';
import TherapistInfo from './TherapistInfo';
import { mockTherapists } from '../services/dataService';
import { generateTherapistReport } from '../services/geminiService';

interface TherapistTabProps {
  appData: AppData;
}

const TherapistTab: React.FC<TherapistTabProps> = ({ appData }) => {
  const [nearbyTherapists, setNearbyTherapists] = useState<NearbyTherapist[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [report, setReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setSearchError(null);
    setNearbyTherapists([]);

    if (!navigator.geolocation) {
      setSearchError("Geolocation is not supported by your browser.");
      setIsSearching(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const therapistsWithDistance = mockTherapists.map(t => ({
          ...t,
          distance: parseFloat((Math.random() * 15 + 1).toFixed(1)),
        })).sort((a, b) => a.distance - b.distance);
        setNearbyTherapists(therapistsWithDistance);
        setIsSearching(false);
      },
      (err) => {
        setSearchError(err.message);
        setIsSearching(false);
      }
    );
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setReport(null);
    setReportSent(false);
    const generatedReport = await generateTherapistReport({
        mentalHealth: appData.mentalHealthData,
        journal: appData.journalEntries,
    });
    setReport(generatedReport);
    setIsGenerating(false);
  };

  const handleSendReport = () => {
    // This is a mock action. In a real app, this would send the `report` string to a server.
    setReportSent(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Therapist Connect</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your connection and share your progress.</p>
      </div>
      
      <TherapistInfo therapist={appData.therapist} />

      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-slate-200/50 dark:border-slate-700/50">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Progress Report</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-4">Generate and send a summary of your recent activity to your therapist.</p>
        
        {!report && !isGenerating && (
            <button onClick={handleGenerateReport} className="w-full bg-gradient-to-r from-lime-600 to-green-700 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500">
                Generate 7-Day Report
            </button>
        )}

        {isGenerating && <p className="text-center text-slate-500 dark:text-slate-400">Generating your report with AI...</p>}
        
        {report && (
            <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Report Preview:</h4>
                    <pre className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300 font-sans">{report}</pre>
                </div>
                {!reportSent ? (
                    <button onClick={handleSendReport} className="w-full bg-lime-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-lime-700">
                        Send to {appData.therapist.name}
                    </button>
                ) : (
                    <p className="text-center font-semibold text-green-600 dark:text-green-400">Report sent successfully!</p>
                )}
            </div>
        )}

      </div>

      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-slate-200/50 dark:border-slate-700/50">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Find Local Support</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-4">Use your location to find therapists near you.</p>
        <button onClick={handleSearch} disabled={isSearching} className="w-full bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50">
          {isSearching ? 'Searching...' : 'Find Nearby Therapists'}
        </button>

        {searchError && <p className="text-red-500 text-sm mt-4">{searchError}</p>}

        {nearbyTherapists.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Results:</h4>
            <ul className="space-y-4">
              {nearbyTherapists.map(t => (
                <li key={t.id} className="flex items-center space-x-4">
                  <img src={t.avatarUrl} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{t.address}</p>
                  </div>
                  <span className="text-sm font-medium text-lime-700 dark:text-lime-500">{t.distance} km away</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistTab;