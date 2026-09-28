import { PUBLIC_ALLIES_TEXTS } from './allies.texts';
import { PUBLIC_ALLY_DETAIL_TEXTS } from './ally-detail.texts';
import { PUBLIC_CART_TEXTS } from './cart.texts';
import { PUBLIC_CATALOG_TEXTS } from './catalog.texts';
import { PUBLIC_CHECKOUT_RESULT_TEXTS } from './checkout-result.texts';
import { PUBLIC_CHECKOUT_TEXTS } from './checkout.texts';
import { PUBLIC_HOME_TEXTS } from './home.texts';
import { PUBLIC_LAYOUT_TEXTS } from './layout.texts';
import { PUBLIC_LEGAL_TEXTS } from './legal.texts';
import { PUBLIC_PRODUCT_DETAIL_TEXTS } from './product-detail.texts';
import { PUBLIC_WELCOME_TEXTS } from './welcome.texts';

export const PUBLIC_TEXTS = {
  layout: PUBLIC_LAYOUT_TEXTS,
  home: PUBLIC_HOME_TEXTS,
  catalog: PUBLIC_CATALOG_TEXTS,
  productDetail: PUBLIC_PRODUCT_DETAIL_TEXTS,
  cart: PUBLIC_CART_TEXTS,
  checkout: PUBLIC_CHECKOUT_TEXTS,
  checkoutResult: PUBLIC_CHECKOUT_RESULT_TEXTS,
  allyDetail: PUBLIC_ALLY_DETAIL_TEXTS,
  allies: PUBLIC_ALLIES_TEXTS,
  welcome: PUBLIC_WELCOME_TEXTS,
  legal: PUBLIC_LEGAL_TEXTS,
} as const;
