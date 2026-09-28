export interface GuideSectionResource {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  duration?: string | null;
  thumbnailUrl?: string | null;
  thumbnailGradient: string;
  sortOrder: number;
}

export interface GuideSection {
  id: string;
  key: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
  isSystem: boolean;
  introResourceId?: string | null;
  introResourceTitle?: string | null;
  introResourceContentType?: string | null;
  resources: GuideSectionResource[];
  createdAt: string;
  updatedAt?: string | null;
}
