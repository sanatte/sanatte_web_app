export type { PagedResult } from '../../administration/models/mood-catalog.model';

export interface MoodEntry {
  id: string;
  moodCatalogId: string;
  moodName: string;
  moodEmoji: string;
  note?: string | null;
  recordedDate: string;
  createdAt: string;
  moodColor?: string | null;
}

export interface MoodCount {
  moodCatalogId: string;
  name: string;
  emoji: string;
  color?: string | null;
  count: number;
}

export interface MoodDay {
  date: string;
  moodCatalogId: string;
  moodName: string;
  moodEmoji: string;
  moodColor?: string | null;
}

export interface MoodSummary {
  from: string;
  to: string;
  totalEntries: number;
  daysInRange: number;
  byMood: MoodCount[];
  days: MoodDay[];
}

export interface MoodCatalogItem {
  id: string;
  name: string;
  emojiCode: string;
  description?: string | null;
  color?: string | null;
  sortOrder: number;
  hasMedia: boolean;
}

export interface MoodHistoryFilter {
  page?: number;
  pageSize?: number;
  from?: string;
  to?: string;
  moodCatalogId?: string | null;
}
