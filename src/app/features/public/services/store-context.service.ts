import { Injectable, inject, computed } from '@angular/core';
import { MockAuthService } from '../../../core/services/mock-auth.service';

/**
 * StoreContextService — resuelve las rutas de la tienda según el contexto.
 *
 * Shell unificado: un usuario autenticado navega la tienda dentro del área
 * privada (`/app/...`, con sidebar); un visitante la ve en el sitio público
 * (`/...`, con navbar de marketing). Los componentes de tienda son los mismos;
 * solo cambia el prefijo de las rutas.
 */
@Injectable({ providedIn: 'root' })
export class StoreContextService {
  private readonly auth = inject(MockAuthService);

  /** '/app' si hay sesión; '' si es visitante. */
  readonly base = computed(() => (this.auth.isAuthenticated() ? '/app' : ''));

  productsLink(): string { return `${this.base()}/products`; }
  productLink(id: string): (string)[] { return [`${this.base()}/products`, id]; }
  cartLink(): string { return `${this.base()}/cart`; }
  checkoutLink(): string { return `${this.base()}/checkout`; }
}
