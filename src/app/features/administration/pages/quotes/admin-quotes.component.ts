import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { QuoteService } from '../../services/quote.service';
import { Quote } from '../../models/quote.model';
import { TEXTS } from '../../../../core/i18n/texts';
import { AdminPageHeaderComponent } from '../../../../shared/components/admin-page-header/admin-page-header.component';
import { QuoteFormDialogComponent, QuoteFormEvent } from '../../components/quote-form-dialog/quote-form-dialog.component';

@Component({
  selector: 'app-admin-quotes',
  imports: [AdminPageHeaderComponent, QuoteFormDialogComponent],
  templateUrl: './admin-quotes.component.html',
})
export class AdminQuotesComponent {
  private readonly svc = inject(QuoteService);

  protected readonly t = TEXTS.admin.quotes;

  readonly quotes  = this.svc.quotes;
  readonly loading = this.svc.loading;
  readonly error   = this.svc.error;

  readonly isModalOpen = signal(false);
  readonly editing     = signal<Quote | null>(null);
  readonly saving      = signal(false);
  readonly saveError   = signal<string | null>(null);
  readonly actionError = signal<string | null>(null);

  openCreate(): void { this.editing.set(null); this.saveError.set(null); this.isModalOpen.set(true); }
  openEdit(item: Quote): void { this.editing.set(item); this.saveError.set(null); this.isModalOpen.set(true); }
  closeModal(): void { if (!this.saving()) this.isModalOpen.set(false); }

  async onSave(event: QuoteFormEvent): Promise<void> {
    this.saving.set(true);
    this.saveError.set(null);
    try {
      const editingItem = this.editing();
      if (editingItem) {
        await this.svc.update(editingItem.id, event);
      } else {
        await this.svc.create({
          textEs: event.textEs, textEn: event.textEn, author: event.author, scheduledFor: event.scheduledFor,
        });
      }
      this.isModalOpen.set(false);
    } catch (e: unknown) {
      this.saveError.set(this.messageOf(e, this.t.page.saveError));
    } finally {
      this.saving.set(false);
    }
  }

  async toggleActive(item: Quote): Promise<void> {
    this.actionError.set(null);
    try {
      await (item.isActive ? this.svc.deactivate(item.id) : this.svc.reactivate(item));
    } catch (e: unknown) {
      this.actionError.set(this.messageOf(e, this.t.page.actionError));
    }
  }

  /** Muestra el detalle del ProblemDetails del backend (p. ej. 409 por fecha repetida). */
  private messageOf(e: unknown, fallback: string): string {
    return e instanceof HttpErrorResponse && typeof e.error?.detail === 'string' ? e.error.detail : fallback;
  }
}
