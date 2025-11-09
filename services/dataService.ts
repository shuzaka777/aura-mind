// Fix: Provide full content for services/dataService.ts
import type { NearbyTherapist, MeditationVideo, CommunityPost, JourneyItem } from '../types';

export const motivationalQuotes: string[] = [
    "The best way out is always through.",
    "You are more than what you're going through.",
    "It's okay not to be okay.",
    "Healing is not linear.",
    "Small steps every day.",
    "Your feelings are valid.",
    "Be kind to your mind.",
    "Progress, not perfection."
];

export const mockTherapists: Omit<NearbyTherapist, 'distance'>[] = [
    {
        id: 't1',
        name: 'Dr. Evelyn Reed',
        title: 'PhD, Licensed Psychologist',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        address: '123 Wellness Ave, Suite 100'
    },
    {
        id: 't2',
        name: 'Marcus Thorne, LCSW',
        title: 'Licensed Clinical Social Worker',
        avatarUrl: 'https://i.pravatar.cc/150?img=2',
        address: '456 Serenity Blvd, Unit B'
    },
    {
        id: 't3',
        name: 'Dr. Aisha Khan',
        title: 'MD, Psychiatrist',
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
        address: '789 Harmony Rd, Clinic C'
    }
];

export const meditationVideos: MeditationVideo[] = [
    { id: 'v1', title: '5-Minute Mindful Breathing', duration: '5:12', thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-4e058603bd0e?w=400&q=80', videoUrl: 'https://www.youtube.com/embed/inpok4MKVLM' },
    { id: 'v2', title: '10-Minute Body Scan', duration: '10:34', thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80', videoUrl: 'https://www.youtube.com/embed/1529_HIzaDY' },
    { id: 'v3', title: 'Guided Meditation for Anxiety', duration: '15:02', thumbnailUrl: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400&q=80', videoUrl: 'https://www.youtube.com/embed/O-6f5wQXSu8' },
];

export const communityPosts: CommunityPost[] = [
    { id: 'p1', author: 'AnonymousUser12', avatar: 'https://i.pravatar.cc/150?img=5', content: 'Feeling a bit overwhelmed today, but trying to remember that this feeling will pass. Taking it one moment at a time.', timestamp: new Date(Date.now() - 3600000).toISOString(), supports: 12, supportedByMe: false },
    { id: 'p2', author: 'JourneySeeker', avatar: 'https://i.pravatar.cc/150?img=6', content: 'Just wanted to share a small win: I went for a walk outside for the first time in a week! It was hard to get started but I feel so much better now.', timestamp: new Date(Date.now() - 86400000).toISOString(), supports: 45, supportedByMe: true },
    { id: 'p3', author: 'HopefulHeart', avatar: 'https://i.pravatar.cc/150?img=7', content: 'Does anyone have tips for dealing with negative self-talk? Some days are a real struggle.', timestamp: new Date(Date.now() - 172800000).toISOString(), supports: 8, supportedByMe: false },
];

export const journeyItems: JourneyItem[] = [
    { id: 'j1', date: new Date(Date.now() - 604800000).toISOString(), title: 'Started My AuraMind Journey', description: 'Decided to take a proactive step towards understanding my mental health better. Feeling hopeful about what I can learn.', imageUrl: 'https://images.unsplash.com/photo-1494178270175-e96de2971df9?w=400&q=80' },
    { id: 'j2', date: new Date(Date.now() - 259200000).toISOString(), title: 'First Week of Journaling', description: 'Completed a full week of daily journaling. It\'s been challenging to be consistent, but also very insightful to see my thoughts on paper.' }
];

export const positiveAffirmations: string[] = [
    "I am capable of overcoming any challenge I face.",
    "I am worthy of love, happiness, and success.",
    "I choose to focus on the positive and let go of the negative.",
    "My feelings are valid, and I allow myself to feel them without judgment.",
    "I am growing stronger and more resilient every day.",
    "I have the power to create the life I desire.",
    "I am in control of my thoughts and I choose to think positively.",
    "I am proud of myself for how far I've come.",
    "I release all tension and embrace tranquility.",
    "Today is a new day, full of possibilities."
];