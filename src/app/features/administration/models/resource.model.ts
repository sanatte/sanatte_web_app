export type ResourceType   = 'audio' | 'video' | 'pdf' | 'article';
export type ResourceStatus = 'published' | 'draft';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  status: ResourceStatus;
  tags: string[];
  duration?: string;       // audio/video → "12:45"
  fileSize?: string;       // pdf         → "4.2 MB"
  readTime?: string;       // article     → "8 min"
  thumbnailGradient: string;
  linkedProductIds: string[];
  createdAt: string;
}
