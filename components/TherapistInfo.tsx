import React from 'react';
import type { Therapist } from '../types';

interface TherapistInfoProps {
  therapist: Therapist;
}

const TherapistInfo: React.FC<TherapistInfoProps> = ({ therapist }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Assigned Therapist</h3>
      <div className="flex items-center space-x-4">
        <img src={therapist.avatarUrl} alt={therapist.name} className="w-16 h-16 rounded-full object-cover" />
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{therapist.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{therapist.title}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span>Data synced with your latest entry</span>
      </div>
    </div>
  );
};

export default TherapistInfo;