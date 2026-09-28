import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { ProductFormDialogComponent, ProductFormSaveEvent } from '../../components/product-form-dialog/product-form-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AdminPageHeaderComponent } from '../../../../shared/components/admin-page-header/admin-page-header.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { Product } from '../../models/product.model';
import { TEXTS } from '../../../../core/i18n/texts';

const PAGE_SIZE = 8;

@Component({
  selector: 'app-admin-products',
  imports: [
    ProductTableComponent, ProductFormDialogComponent,
    ConfirmDialogComponent, AdminPageHeaderComponent, SearchInputComponent,
  ],
  templateUrl: './admin-products.component.html',
})
export class AdminProductsComponent implements OnInit {
  protected readonly t = TEXTS.admin.products;

  private readonly productService = inject(ProductService);
  private readonly route          = inject(ActivatedRoute);

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
    return p ? this.t.page.deleteMessage(p.name, p.sku) : '';
  });

  onSearch(term: string): void { this.searchTerm.set(term); this.currentPage.set(1); }

  ngOnInit(): void {
    const editId = this.route.snapshot.queryParamMap.get('edit');
    if (editId) {
      const p = this.productService.getById(editId);
      if (p) this.openEdit(p);
    }
  }

  openCreate(): void { this.editingProduct.set(null); this.saveError.set(''); this.isModalOpen.set(true); }
  openEdit(product: Product): void { this.editingProduct.set(product); this.saveError.set(''); this.isModalOpen.set(true); }
  closeModal(): void { this.isModalOpen.set(false); this.editingProduct.set(null); this.saveError.set(''); }

  async onSave({ data, coverFile }: ProductFormSaveEvent): Promise<void> {
    const editing = this.editingProduct();
    this.saving.set(true);
    this.saveError.set('');
    try {
      const saved = editing
        ? await this.productService.update(editing.id, data)
        : await this.productService.create(data as any);

      if (data.entitlements !== undefined) {
        const resourceIds = data.entitlements.map((e) => e.referenceId);
        await this.productService.syncEntitlements(saved.id, resourceIds);
      }

      if (coverFile) {
        await this.productService.uploadImage(saved.id, coverFile, '', true).catch(() => undefined);
      }
      this.closeModal();
    } catch (e: unknown) {
      this.saveError.set(
        (e as { error?: { detail?: string } })?.error?.detail
          ?? this.t.page.saveError
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
          ?? this.t.page.deleteError
      );
    }
  }

  cancelDelete(): void { this.isConfirmOpen.set(false); this.productToDelete.set(null); this.deleteError.set(''); }
  onPageChange(page: number): void { this.currentPage.set(page); }
}
