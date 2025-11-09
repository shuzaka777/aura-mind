import React, { useState, useRef } from 'react';
import type { JourneyItem } from '../types';
import { EditIcon, SparklesIcon, PhotoIcon } from './icons';

interface MyJourneyProps {
  items: JourneyItem[];
  onAddItem: (item: Omit<JourneyItem, 'id'>) => void;
}

const MyJourney: React.FC<MyJourneyProps> = ({ items, onAddItem }) => {
    const [isWriting, setIsWriting] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newImage, setNewImage] = useState<string | undefined>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sortedItems = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newDescription.trim()) return;

        onAddItem({
            date: new Date().toISOString(),
            title: newTitle,
            description: newDescription,
            imageUrl: newImage,
        });

        setNewTitle('');
        setNewDescription('');
        setNewImage(undefined);
        setIsWriting(false);
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">My Journey</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">A timeline of your progress and milestones.</p>
                </div>
                {!isWriting && (
                    <button
                        onClick={() => setIsWriting(true)}
                        className="flex items-center bg-lime-600 text-white font-semibold text-sm py-2 px-4 rounded-lg hover:bg-lime-700 transition-colors"
                    >
                        <EditIcon className="w-5 h-5 mr-2" />
                        Add Milestone
                    </button>
                )}
            </div>

            {isWriting && (
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-slate-200/50 dark:border-slate-700/50 mb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">New Milestone</h3>
                        <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Milestone Title" className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500" required />
                        <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Describe this moment..." rows={4} className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500" required />
                        <div className="flex items-center gap-4">
                             <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="sr-only" />
                             <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 py-2 px-3 text-sm font-semibold rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500">
                                <PhotoIcon className="w-5 h-5" />
                                {newImage ? 'Change Photo' : 'Add Photo'}
                             </button>
                             {newImage && <img src={newImage} alt="Preview" className="w-16 h-16 rounded-md object-cover" />}
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setIsWriting(false)} className="py-2 px-4 text-sm font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">Cancel</button>
                            <button type="submit" className="py-2 px-4 text-sm font-semibold text-white bg-lime-600 rounded-lg hover:bg-lime-700">Save Milestone</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="relative pl-8">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                {sortedItems.map((item) => (
                    <div key={item.id} className="mb-8 relative">
                        <div className="absolute -left-1.5 top-1.5 w-5 h-5 bg-lime-500 rounded-full border-4 border-gray-100 dark:border-gray-900"></div>
                        <div className="ml-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
                             {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover rounded-md mb-4" />}
                            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <h4 className="font-bold text-gray-800 dark:text-gray-200">{item.title}</h4>
                            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">{item.description}</p>
                        </div>
                    </div>
                ))}
                 {sortedItems.length === 0 && !isWriting && (
                    <div className="text-center py-10 ml-8">
                        <SparklesIcon className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                        <p className="text-slate-500">Your journey timeline is empty.</p>
                        <p className="text-slate-400 text-sm">Add a milestone to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyJourney;