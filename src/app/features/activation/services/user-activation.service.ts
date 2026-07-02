import { Injectable, inject } from '@angular/core';
import { LicenseService } from '../../administration/services/license.service';
import { ActivationService } from '../../administration/services/activation.service';
import { ProductService } from '../../administration/services/product.service';
import { EntitlementService } from '../../administration/services/entitlement.service';
import { UserLibraryService } from '../../library/services/user-library.service';
import { MockAuthService } from '../../../core/services/mock-auth.service';
import { Product } from '../../administration/models/product.model';
import { Activation } from '../../administration/models/activation.model';

export type ActivationResult =
  | { status: 'success'; product: Product; resourcesUnlocked: number }
  | { status: 'not_found' | 'revoked' | 'already_active' | 'not_activatable'; message: string };

/**
 * UserActivationService — activación de productos físicos por código (vista cliente).
 *
 * Solo aplica a productos con `accessType: 'qr_activation'`. Valida el código
 * contra las licencias, marca la licencia activa, registra el evento de
 * activación (visible en el admin) y desbloquea los recursos en la biblioteca.
 * Fase Mock; migración: reemplazar por el endpoint de activación del backend.
 */
@Injectable({ providedIn: 'root' })
export class UserActivationService {
  private readonly licenses     = inject(LicenseService);
  private readonly activations  = inject(ActivationService);
  private readonly products     = inject(ProductService);
  private readonly entitlements = inject(EntitlementService);
  private readonly library      = inject(UserLibraryService);
  private readonly auth         = inject(MockAuthService);

  activate(code: string): ActivationResult {
    const license = this.licenses.findByCode(code);
    if (!license) {
      return { status: 'not_found', message: 'No encontramos ese código. Verifica los 6 caracteres bajo el QR.' };
    }
    if (license.status === 'revoked') {
      return { status: 'revoked', message: 'Este código fue revocado. Contacta a soporte.' };
    }
    if (license.status === 'active') {
      return { status: 'already_active', message: 'Este código ya fue activado.' };
    }

    const product = this.products.getById(license.productId);
    if (!product || product.accessType !== 'qr_activation') {
      return { status: 'not_activatable', message: 'Este producto no requiere activación.' };
    }

    const user = this.auth.currentUser();
    const displayName = user?.displayName ?? 'Usuario';
    const initials = displayName.slice(0, 2).toUpperCase();

    // 1) Marca la licencia como activada y la vincula al usuario.
    this.licenses.activate(license.id, {
      userId: user?.uid ?? 'mock-uid',
      userName: displayName,
      userInitials: initials,
      userAvatarGradient: 'from-violet-400 to-purple-600',
    });

    // 2) Registra el evento de activación (lo verá el admin).
    const resourcesUnlocked = this.entitlements.getContentCount(product);
    const activation: Activation = {
      id: `act-${Date.now()}`,
      licenseCode: license.code,
      orderId: license.orderId,
      productId: product.id,
      productName: product.name,
      userId: user?.uid,
      userName: displayName,
      userEmail: user?.email,
      userInitials: initials,
      userAvatarGradient: 'from-violet-400 to-purple-600',
      status: 'success',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      ipAddress: '—',
      device: 'Web',
      resourcesUnlocked,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.activations.record(activation);

    // 3) Desbloquea el producto en la biblioteca del usuario.
    this.library.registerActivated(product.id);

    return { status: 'success', product, resourcesUnlocked };
  }
}
