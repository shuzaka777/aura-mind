// Fix: Provide full content for components/Navigation.tsx
import React from 'react';
import { HomeIcon, ChatIcon, JournalIcon, TherapistIcon, ProfileIcon, ExerciseIcon, SparklesIcon, UsersIcon } from './icons';

type View = 'dashboard' | 'chat' | 'journal' | 'exercises' | 'therapist' | 'profile' | 'my-journey' | 'community';

interface NavigationProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  aiName: string;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-300'
        : 'text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    <div className="w-5 h-5 mr-3">{icon}</div>
    <span>{label}</span>
  </button>
);

const Navigation: React.FC<NavigationProps> = ({ currentView, setCurrentView, aiName }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { id: 'chat', label: `Chat with ${aiName}`, icon: <ChatIcon /> },
    { id: 'journal', label: 'Journal', icon: <JournalIcon /> },
    { id: 'my-journey', label: 'My Journey', icon: <SparklesIcon /> },
    { id: 'community', label: 'Community', icon: <UsersIcon /> },
    { id: 'exercises', label: 'Exercises', icon: <ExerciseIcon /> },
    { id: 'therapist', label: 'Therapist', icon: <TherapistIcon /> },
    { id: 'profile', label: 'Profile', icon: <ProfileIcon /> },
  ];

  return (
    <nav className="p-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md md:border-r border-slate-200/50 dark:border-slate-700/50 h-full">
      <div className="flex items-center mb-6 px-2">
         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-500 to-green-600 mr-3"></div>
         <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Aura</h1>
      </div>
      <div className="space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            isActive={currentView === item.id}
            onClick={() => setCurrentView(item.id as View)}
          />
        ))}
      </div>
    </nav>
  );
};

export default Navigation;