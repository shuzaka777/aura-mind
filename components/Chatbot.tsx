import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, AiCustomizationSettings } from '../types';
import { SendIcon, UserIcon, BotIcon, EditIcon, CheckIcon, SettingsIcon } from './icons';
import AiCustomizationModal from './AiCustomizationModal';

interface ChatbotProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  aiName: string;
  onAiNameChange: (newName: string) => void;
  aiSettings: AiCustomizationSettings;
  onAiSettingsChange: (settings: AiCustomizationSettings) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ messages, onSendMessage, isLoading, aiName, onAiNameChange, aiSettings, onAiSettingsChange }) => {
  const [input, setInput] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempAiName, setTempAiName] = useState(aiName);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (isEditingName) {
      nameInputRef.current?.focus();
    }
  }, [isEditingName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleNameChangeSubmit = () => {
    if (tempAiName.trim()) {
      onAiNameChange(tempAiName.trim());
      setIsEditingName(false);
    }
  };

  const handleNameChangeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameChangeSubmit();
    }
  };

  return (
    <>
    <div className="flex flex-col h-[calc(100vh-145px)] md:h-[calc(100vh-80px)] bg-white/30 dark:bg-gray-800/30 rounded-lg shadow-lg overflow-hidden m-4 border border-slate-200/50 dark:border-slate-700/50">
      <header className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center">
            {isEditingName ? (
              <div className="flex-1 flex items-center gap-2">
                 <label htmlFor="ai-name-input" className="sr-only">Edit AI Companion Name</label>
                <input
                    ref={nameInputRef}
                    id="ai-name-input"
                    type="text"
                    value={tempAiName}
                    onChange={(e) => setTempAiName(e.target.value)}
                    onKeyDown={handleNameChangeKeyDown}
                    onBlur={() => setIsEditingName(false)}
                    className="flex-1 w-full px-2 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-800 dark:text-gray-200"
                />
                <button onClick={handleNameChangeSubmit} className="p-1 text-green-500 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md" aria-label="Confirm new name">
                    <CheckIcon className="w-5 h-5"/>
                </button>
              </div>
            ) : (
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Chat with {aiName}</h2>
            )}

            <div className="flex items-center gap-2">
                {!isEditingName && (
                    <button 
                        onClick={() => {
                            setIsEditingName(true);
                            setTempAiName(aiName);
                        }} 
                        className="text-slate-500 hover:text-lime-600 transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                        aria-label="Edit AI name"
                    >
                        <EditIcon className="w-5 h-5"/>
                    </button>
                )}
                <button 
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="text-slate-500 hover:text-lime-600 transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                    aria-label="Customize AI"
                >
                    <SettingsIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Your AI mental health companion</p>
      </header>
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto" role="log" aria-live="polite">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-500 to-green-700 flex items-center justify-center text-white flex-shrink-0">
                  <BotIcon className="w-5 h-5" />
                </div>
              )}
              <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-xl shadow-sm ${msg.sender === 'user' ? 'bg-gradient-to-br from-lime-600 to-green-800 text-white rounded-br-none' : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
               {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-500 to-green-700 flex items-center justify-center text-white flex-shrink-0">
                <BotIcon className="w-5 h-5" />
              </div>
              <div className="bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-xl rounded-bl-none px-4 py-3">
                 <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <label htmlFor="chat-input" className="sr-only">Type your message</label>
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-800 dark:text-gray-200"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-br from-lime-600 to-green-800 text-white rounded-full p-3 hover:opacity-90 disabled:from-lime-400 disabled:to-green-600 disabled:cursor-not-allowed transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 dark:focus:ring-offset-slate-800"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
    {isSettingsModalOpen && (
        <AiCustomizationModal 
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            currentSettings={aiSettings}
            onSave={onAiSettingsChange}
        />
    )}
    </>
  );
};

export default Chatbot;