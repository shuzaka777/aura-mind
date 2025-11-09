// Fix: Provide full content for types.ts
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export interface MentalHealthDataPoint {
  date: string; // 'YYYY-MM-DD'
  source: 'Check-in' | 'Chat' | 'Questionnaire';
  mood: number | null;
  stress: number | null;
  energy: number | null;
}

export interface QuestionnaireQuestion {
  id: string;
  text: string;
}

export interface QuestionnaireAnswer {
  questionId: string;
  answer: string;
  date: string; // 'YYYY-MM-DD'
}

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  title: string;
  content: string;
}

export interface Therapist {
  name: string;
  title: string;
  avatarUrl: string;
}

export interface NearbyTherapist extends Therapist {
  id: string;
  address: string;
  distance: number;
}

export interface UserProfile {
  name: string;
  age: number | null;
  gender: string | null;
  height: number | null; // cm
  weight: number | null; // kg
  avatarUrl: string;
  email: string | null;
  mobileNumber: string | null;
}

export interface EmotionTrigger {
    date: string; // ISO string
    identifiedEmotion: string;
}

export interface AiCustomizationSettings {
    personality: 'nurturing' | 'direct' | 'playful';
    responseStyle: 'concise' | 'detailed';
}

export interface MeditationVideo {
  id: string;
  title: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string; // ISO String
  supports: number;
  supportedByMe: boolean;
}

export interface JourneyItem {
  id: string;
  date: string; // ISO String
  title: string;
  description: string;
  imageUrl?: string;
}

export interface AppData {
  userProfile: UserProfile;
  therapist: Therapist;
  aiName: string;
  aiSettings: AiCustomizationSettings;
  chatHistory: ChatMessage[];
  mentalHealthData: MentalHealthDataPoint[];
  journalEntries: JournalEntry[];
  questionnaireAnswers: QuestionnaireAnswer[];
  emotionTriggers: EmotionTrigger[];
  meditationVideos: MeditationVideo[];
  communityPosts: CommunityPost[];
  journeyItems: JourneyItem[];
}