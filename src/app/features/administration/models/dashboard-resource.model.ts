export type ResourceType = 'audio' | 'video' | 'pdf' | 'article';

export interface DashboardResource {
  id: string;
  title: string;
  type: ResourceType;
  stats: string;
  progressPercent: number;
  thumbnailGradient: string;
}
