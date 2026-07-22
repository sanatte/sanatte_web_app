import { Component, inject, signal, computed } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { ProductFormDialogComponent } from '../../components/product-form-dialog/product-form-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AdminPageHeaderComponent } from '../../../../shared/components/admin-page-header/admin-page-header.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { Product } from '../../models/product.model';

const PAGE_SIZE = 8;

@Component({
  selector: 'app-admin-products',
  imports: [
    ProductTableComponent, ProductFormDialogComponent,
    ConfirmDialogComponent, AdminPageHeaderComponent, SearchInputComponent,
  ],
  templateUrl: './admin-products.component.html',
})
export class AdminProductsComponent {
  private readonly productService = inject(ProductService);

  readonly searchTerm      = signal('');
  readonly currentPage     = signal(1);
  readonly isModalOpen     = signal(false);
  readonly editingProduct  = signal<Product | null>(null);
  readonly isConfirmOpen   = signal(false);
  readonly productToDelete = signal<Product | null>(null);
  readonly saving          = signal(false);
  readonly saveError       = signal('');
  readonly deleteError     = signal('');

  readonly filtered = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.productService.products();
    return this.productService.products().filter(
      (p) => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term)
    );
  });

  readonly paginated = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });

  readonly deleteMessage = computed(() => {
    const p = this.productToDelete();
    return p ? `¿Eliminar "${p.name}" (${p.sku})? Esta acción no se puede deshacer.` : '';
  });

  onSearch(term: string): void { this.searchTerm.set(term); this.currentPage.set(1); }

  openCreate(): void { this.editingProduct.set(null); this.saveError.set(''); this.isModalOpen.set(true); }
  openEdit(product: Product): void { this.editingProduct.set(product); this.saveError.set(''); this.isModalOpen.set(true); }
  closeModal(): void { this.isModalOpen.set(false); this.editingProduct.set(null); this.saveError.set(''); }

  async onSave(data: Partial<Product>): Promise<void> {
    const editing = this.editingProduct();
    this.saving.set(true);
    this.saveError.set('');
    try {
      if (editing) await this.productService.update(editing.id, data);
      else await this.productService.create(data as any);
      this.closeModal();
    } catch (e: unknown) {
      this.saveError.set(
        (e as { error?: { detail?: string } })?.error?.detail
          ?? 'No se pudo guardar el producto. Revisa los datos e intenta de nuevo.'
      );
    } finally {
      this.saving.set(false);
    }
  }

  requestDelete(product: Product): void {
    this.productToDelete.set(product);
    this.deleteError.set('');
    this.isConfirmOpen.set(true);
  }

  async confirmDelete(): Promise<void> {
    const p = this.productToDelete();
    if (!p) return;
    this.deleteError.set('');
    try {
      await this.productService.delete(p.id);
      this.isConfirmOpen.set(false);
      this.productToDelete.set(null);
    } catch (e: unknown) {
      this.deleteError.set(
        (e as { error?: { detail?: string } })?.error?.detail
          ?? 'No se pudo eliminar el producto.'
      );
    }
  }

  cancelDelete(): void { this.isConfirmOpen.set(false); this.productToDelete.set(null); this.deleteError.set(''); }
  onPageChange(page: number): void { this.currentPage.set(page); }
}
