import React, { useState } from 'react';
import type { JournalEntry } from '../types';
import { EditIcon } from './icons';

interface JournalProps {
  entries: JournalEntry[];
  onAddEntry: (entry: JournalEntry) => void;
}

const Journal: React.FC<JournalProps> = ({ entries, onAddEntry }) => {
    const [isWriting, setIsWriting] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');

    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newContent.trim()) return;

        const newEntry: JournalEntry = {
            id: `j${Date.now()}`,
            date: new Date().toISOString(),
            title: newTitle,
            content: newContent,
        };

        onAddEntry(newEntry);
        setNewTitle('');
        setNewContent('');
        setIsWriting(false);
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">My Journal</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">A private space for your thoughts.</p>
                </div>
                {!isWriting && (
                    <button
                        onClick={() => setIsWriting(true)}
                        className="flex items-center bg-lime-600 text-white font-semibold text-sm py-2 px-4 rounded-lg hover:bg-lime-700 transition-colors"
                    >
                        <EditIcon className="w-5 h-5 mr-2" />
                        New Entry
                    </button>
                )}
            </div>

            {isWriting ? (
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-slate-200/50 dark:border-slate-700/50 mb-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">New Journal Entry</h3>
                        <div>
                            <label htmlFor="journal-title" className="sr-only">Title</label>
                            <input
                                type="text"
                                id="journal-title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Entry Title"
                                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="journal-content" className="sr-only">Content</label>
                            <textarea
                                id="journal-content"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                placeholder="Write what's on your mind..."
                                rows={8}
                                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setIsWriting(false)} className="py-2 px-4 text-sm font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">Cancel</button>
                            <button type="submit" className="py-2 px-4 text-sm font-semibold text-white bg-lime-600 rounded-lg hover:bg-lime-700">Save Entry</button>
                        </div>
                    </form>
                </div>
            ) : null}

            <div className="space-y-4">
                {sortedEntries.map(entry => (
                    <div key={entry.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
                        <h4 className="font-bold text-gray-800 dark:text-gray-200">{entry.title}</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">{new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap">{entry.content}</p>
                    </div>
                ))}
                {sortedEntries.length === 0 && !isWriting && (
                    <div className="text-center py-10">
                        <p className="text-slate-500">Your journal is empty. Start by writing a new entry.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Journal;