import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ActivationService } from '../../administration/services/activation.service';
import { ProductService } from '../../administration/services/product.service';
import { UserLibraryService } from '../../library/services/user-library.service';
import { Product } from '../../administration/models/product.model';
import { environment } from '../../../../environments/environment';
import { TEXTS } from '../../../core/i18n/texts';

export type ActivationResult =
  | { status: 'success'; product: Product; resourcesUnlocked: number; welcomeResourceSlug: string | null }
  | { status: 'not_found' | 'revoked' | 'already_active' | 'not_activatable'; message: string };

const RESULT_STATUS: Record<number, ActivationResult['status']> = {
  0: 'success',
  1: 'not_found',
  2: 'revoked',
  3: 'already_active',
  4: 'not_activatable',
};

interface ApiActivationResult {
  status: number;
  message: string;
  productId: string | null;
  productName: string | null;
  resourcesUnlocked: number;
  welcomeResourceSlug: string | null;
}

@Injectable({ providedIn: 'root' })
export class UserActivationService {
  private readonly http         = inject(HttpClient);
  private readonly activations  = inject(ActivationService);
  private readonly products     = inject(ProductService);
  private readonly library      = inject(UserLibraryService);

  async activate(code: string, device = 'Web'): Promise<ActivationResult> {
    const res = await firstValueFrom(
      this.http.post<ApiActivationResult>(`${environment.apiUrl}/activations`, {
        code: code.trim(),
        device,
      })
    );

    const status = RESULT_STATUS[res.status] ?? 'not_found';
    if (status !== 'success' || !res.productId) {
      return { status: status as Exclude<ActivationResult['status'], 'success'>, message: res.message };
    }

    const product = this.products.getById(res.productId)
      ?? ({ id: res.productId, name: res.productName ?? TEXTS.app.activation.fallbackProductName } as Product);

    this.library.registerActivated(product.id);
    this.activations.refresh();

    return { status: 'success', product, resourcesUnlocked: res.resourcesUnlocked,
             welcomeResourceSlug: res.welcomeResourceSlug ?? null };
  }
}
