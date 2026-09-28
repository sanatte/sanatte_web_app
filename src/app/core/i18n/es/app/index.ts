import { APP_ACTIVATION_TEXTS } from './activation.texts';
import { APP_LAYOUT_TEXTS } from './layout.texts';
import { APP_LIBRARY_TEXTS } from './library.texts';
import { APP_MOODS_TEXTS } from './moods.texts';
import { APP_ORDERS_TEXTS } from './orders.texts';
import { APP_PROFILE_TEXTS } from './profile.texts';
import { APP_RESOURCE_VIEWER_TEXTS } from './resource-viewer.texts';
import { APP_SUBSCRIPTIONS_TEXTS } from './subscriptions.texts';

export const APP_TEXTS = {
  layout: APP_LAYOUT_TEXTS,
  activation: APP_ACTIVATION_TEXTS,
  profile: APP_PROFILE_TEXTS,
  library: APP_LIBRARY_TEXTS,
  moods: APP_MOODS_TEXTS,
  orders: APP_ORDERS_TEXTS,
  subscriptions: APP_SUBSCRIPTIONS_TEXTS,
  resourceViewer: APP_RESOURCE_VIEWER_TEXTS,
} as const;
