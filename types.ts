
export interface Skill {
  id: number;
  name: string;
  level: number; // Mapped from 'points'
}

export interface Project {
  id: number;
  name: string; // Mapped from 'title'
  status: string; // 'ASSIGNED', 'COMPLETED', etc.
  finalMark?: number; // Mapped from 'finalPercentage'
  updatedAt: string; // Mapped from 'completionDateTime'
  team?: string[]; // Array of logins
}

export interface Badge {
  id: number;
  name: string;
  image: string; // Mapped from 'iconUrl'
  description: string;
  awardedAt: string; // Mapped from 'receiptDateTime'
}

export interface Logtime {
  date: string;
  hours: number;
  minutes: number;
}

export interface Feedback {
  punctuality: number;
  interest: number;
  thoroughness: number;
  friendliness: number;
}

export interface XPHistoryItem {
  date: string;
  expValue: number;
}

export interface Course {
  id: number;
  title: string;
  status: string;
}

export interface Coalition {
  name: string;
  imageUrl: string;
  color: string;
  score: number;
  rank: number;
}

export interface Workstation {
  location: string; // e.g. "Cluster 1, Row 2, Seat 5"
  host: string;
  isActive: boolean;
}

export interface ParticipantProfile {
  login: string;
  className: string;
  parallelName: string;
  campus: string;
  avatarUrl?: string;
  level: number;
  expValue: number;
  expToNextLevel: number;
  email: string;
  
  skills: Skill[];
  projects: Project[];
  badges: Badge[];
  logtime: Logtime[];
  averageLogtime?: number;

  // New Pro Features
  feedback?: Feedback;
  xpHistory?: XPHistoryItem[];
  courses?: Course[];
  coalition?: Coalition;
  workstation?: Workstation;
  
  loadedAt: number; // For caching expiration
}

export type Language = 'EN' | 'RU' | 'UZ';

export interface AppState {
  currentProfile: ParticipantProfile | null;
  isLoading: boolean;
  error: string | null;
  language: Language;
  offlineMode: boolean;
  isAuthenticated: boolean;
}