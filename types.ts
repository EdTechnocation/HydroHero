
export interface HydrationTip {
  text: string;
  category: 'motivation' | 'fact' | 'heroic';
}

export interface UserStats {
  currentMl: number;
  dailyGoal: number;
  streak: number;
  lastUpdated: string; // ISO Date
}
