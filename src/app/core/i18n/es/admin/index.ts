import { ACTIVATIONS_TEXTS } from './activations.texts';
import { ALLIES_TEXTS } from './allies.texts';
import { DASHBOARD_TEXTS } from './dashboard.texts';
import { LAYOUT_TEXTS } from './layout.texts';
import { LICENSES_TEXTS } from './licenses.texts';
import { LOCATIONS_TEXTS } from './locations.texts';
import { GUIDE_SECTIONS_TEXTS } from './guide-sections.texts';
import { MOOD_CATALOG_TEXTS } from './mood-catalog.texts';
import { MOOD_TRACKING_TEXTS } from './mood-tracking.texts';
import { ORDERS_TEXTS } from './orders.texts';
import { PRODUCTS_TEXTS } from './products.texts';
import { REPORTS_TEXTS } from './reports.texts';
import { RESOURCES_TEXTS } from './resources.texts';
import { SETTINGS_TEXTS } from './settings.texts';
import { USERS_TEXTS } from './users.texts';

export const ADMIN_TEXTS = {
  layout: LAYOUT_TEXTS,
  dashboard: DASHBOARD_TEXTS,
  products: PRODUCTS_TEXTS,
  resources: RESOURCES_TEXTS,
  allies: ALLIES_TEXTS,
  users: USERS_TEXTS,
  orders: ORDERS_TEXTS,
  licenses: LICENSES_TEXTS,
  locations: LOCATIONS_TEXTS,
  activations: ACTIVATIONS_TEXTS,
  guideSections: GUIDE_SECTIONS_TEXTS,
  moodCatalog: MOOD_CATALOG_TEXTS,
  moodTracking: MOOD_TRACKING_TEXTS,
  reports: REPORTS_TEXTS,
  settings: SETTINGS_TEXTS,
} as const;
