import { RESOURCES_TEXTS } from '../../../core/i18n/es/admin/resources.texts';

export type ResourceType   = 'audio' | 'video' | 'pdf' | 'article';
export type ResourceStatus = 'published' | 'draft';

export const RESOURCE_TYPE_META: Record<ResourceType, { icon: string; label: string }> = {
  audio:   { icon: 'headphones',     label: RESOURCES_TEXTS.types.audio   },
  video:   { icon: 'videocam',       label: RESOURCES_TEXTS.types.video   },
  pdf:     { icon: 'picture_as_pdf', label: RESOURCES_TEXTS.types.pdf     },
  article: { icon: 'description',    label: RESOURCES_TEXTS.types.article },
};

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: ResourceType;
  status: ResourceStatus;
  tags: string[];
  duration?: string;
  fileSize?: string;
  readTime?: string;
  content?: string | null;
  thumbnailUrl?: string | null;
  thumbnailGradient: string;
  createdAt: string;
  mediaContentType?: string | null;
  mediaSizeBytes?: number | null;
}
