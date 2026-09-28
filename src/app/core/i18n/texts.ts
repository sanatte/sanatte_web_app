import { COMMON_TEXTS } from './es/common.texts';
import { ADMIN_TEXTS } from './es/admin';
import { APP_TEXTS } from './es/app';
import { AUTH_TEXTS } from './es/auth';
import { PUBLIC_TEXTS } from './es/public';
import { SHARED_TEXTS } from './es/shared';

export const TEXTS = {
  common: COMMON_TEXTS,
  shared: SHARED_TEXTS,
  admin: ADMIN_TEXTS,
  public: PUBLIC_TEXTS,
  auth: AUTH_TEXTS,
  app: APP_TEXTS,
} as const;

export type Texts = typeof TEXTS;
