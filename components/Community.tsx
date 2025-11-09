import React, { useState } from 'react';
import type { CommunityPost } from '../types';
import { UserCircleIcon, HeartSolidIcon } from './icons';

interface CommunityProps {
  posts: CommunityPost[];
  onAddPost: (content: string) => void;
  onToggleSupport: (postId: string) => void;
}

const Community: React.FC<CommunityProps> = ({ posts, onAddPost, onToggleSupport }) => {
    const [newPostContent, setNewPostContent] = useState('');
    
    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPostContent.trim()) {
            onAddPost(newPostContent);
            setNewPostContent('');
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Community Hub</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">A safe, anonymous space to share and connect.</p>
                </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-4 border border-slate-200/50 dark:border-slate-700/50 mb-6">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <label htmlFor="community-post" className="sr-only">Share your thoughts</label>
                    <textarea
                        id="community-post"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Share something with the community..."
                        rows={3}
                        className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                        required
                    />
                    <div className="flex justify-end">
                        <button type="submit" className="py-2 px-4 text-sm font-semibold text-white bg-lime-600 rounded-lg hover:bg-lime-700 disabled:opacity-50" disabled={!newPostContent.trim()}>Post</button>
                    </div>
                </form>
            </div>
            
            <div className="space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
                        <div className="flex items-start space-x-3">
                            {post.avatar ? <img src={post.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" /> : <UserCircleIcon className="w-10 h-10 text-slate-400" />}
                            <div className="flex-1">
                                <div className="flex items-baseline space-x-2">
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{post.author}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">{timeSince(post.timestamp)}</p>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 whitespace-pre-wrap">{post.content}</p>
                                <div className="mt-3 flex items-center">
                                    <button onClick={() => onToggleSupport(post.id)} className={`flex items-center space-x-1.5 text-sm transition-colors ${post.supportedByMe ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}>
                                        <HeartSolidIcon className="w-5 h-5" />
                                        <span>{post.supports} Support</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;