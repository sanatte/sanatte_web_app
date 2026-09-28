export interface GuideSection {
  id: string;
  key: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
  introResourceId?: string | null;
  introResourceTitle?: string | null;
  introResourceContentType?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}
