import React, { useState } from 'react';
import type { AiCustomizationSettings } from '../types';
import { CloseIcon } from './icons';

interface AiCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: AiCustomizationSettings;
  onSave: (settings: AiCustomizationSettings) => void;
}

const AiCustomizationModal: React.FC<AiCustomizationModalProps> = ({ isOpen, onClose, currentSettings, onSave }) => {
  const [settings, setSettings] = useState<AiCustomizationSettings>(currentSettings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };
  
  const RadioGroup = ({ title, name, options, selectedValue, onChange }: { title: string, name: string, options: {value: string, label: string, description: string}[], selectedValue: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return (
        <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h4>
            <div className="space-y-2">
                {options.map(option => (
                    <label key={option.value} className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${selectedValue === option.value ? 'bg-lime-50 dark:bg-gray-700 border-lime-500' : 'bg-white dark:bg-gray-800 border-slate-300 dark:border-slate-600'}`}>
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={selectedValue === option.value}
                            onChange={onChange}
                            className="w-4 h-4 mt-1 text-lime-600 bg-gray-100 border-gray-300 focus:ring-lime-500 dark:focus:ring-lime-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <div className="ml-3 text-sm">
                            <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
                            <p className="text-slate-500 dark:text-slate-400">{option.description}</p>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-settings-title"
    >
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 id="ai-settings-title" className="text-lg font-semibold text-gray-800 dark:text-gray-200">Customize AI Companion</h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600">
            <CloseIcon className="w-5 h-5" />
            <span className="sr-only">Close settings</span>
          </button>
        </header>
        <div className="p-6 space-y-6">
            <RadioGroup
                title="Personality"
                name="personality"
                selectedValue={settings.personality}
                onChange={(e) => setSettings(s => ({...s, personality: e.target.value as any}))}
                options={[
                    { value: 'nurturing', label: 'Nurturing', description: 'Warm, empathetic, and gentle. Best for emotional exploration.' },
                    { value: 'direct', label: 'Direct', description: 'Clear and straightforward. Best for practical problem-solving.' },
                    { value: 'playful', label: 'Playful', description: 'Optimistic and encouraging. Best for motivation and reframing.' },
                ]}
            />
             <RadioGroup
                title="Response Style"
                name="responseStyle"
                selectedValue={settings.responseStyle}
                onChange={(e) => setSettings(s => ({...s, responseStyle: e.target.value as any}))}
                options={[
                    { value: 'concise', label: 'Concise', description: 'Short, to-the-point answers.' },
                    { value: 'detailed', label: 'Detailed', description: 'Thorough responses with more explanation.' },
                ]}
            />
        </div>
        <footer className="p-4 bg-gray-200/50 dark:bg-gray-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
            <button onClick={onClose} className="py-2 px-4 text-sm font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
            <button onClick={handleSave} className="py-2 px-4 text-sm font-semibold text-white bg-lime-600 rounded-lg hover:bg-lime-700">Save Changes</button>
        </footer>
      </div>
    </div>
  );
};

export default AiCustomizationModal;