import { SHARED_HEADER_TEXTS } from './header.texts';
import { SHARED_RESOURCE_VIEWERS_TEXTS } from './resource-viewers.texts';
import { SHARED_RICH_TEXT_EDITOR_TEXTS } from './rich-text-editor.texts';
import { SHARED_SIDEBAR_TEXTS } from './sidebar.texts';

export const SHARED_TEXTS = {
  header: SHARED_HEADER_TEXTS,
  sidebar: SHARED_SIDEBAR_TEXTS,
  resourceViewers: SHARED_RESOURCE_VIEWERS_TEXTS,
  richTextEditor: SHARED_RICH_TEXT_EDITOR_TEXTS,
} as const;
