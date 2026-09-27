export interface MoodCatalog {
  id: string;
  name: string;
  emojiCode: string;
  description?: string | null;
  color?: string | null;
  sortOrder: number;
  isActive: boolean;
  resourceId?: string | null;
  resourceTitle?: string | null;
  resourceContentType?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface MoodEntryAdmin {
  id: string;
  userId: string;
  userDisplayName: string;
  userEmail: string;
  moodCatalogId: string;
  moodName: string;
  moodEmoji: string;
  note?: string | null;
  recordedDate: string;
  createdAt: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
