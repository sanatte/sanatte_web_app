import { Component, input, output, inject, computed, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Quote } from '../../models/quote.model';
import { TEXTS } from '../../../../core/i18n/texts';

export interface QuoteFormEvent {
  textEs: string;
  textEn: string | null;
  author: string;
  scheduledFor: string | null;
  isActive: boolean;
}

@Component({
  selector: 'app-quote-form-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './quote-form-dialog.component.html',
})
export class QuoteFormDialogComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly t = TEXTS.admin.quotes.formDialog;
  protected readonly c = TEXTS.common;

  readonly isOpen       = input.required<boolean>();
  readonly editingItem  = input<Quote | null>(null);
  readonly isSaving     = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly close = output<void>();
  readonly save  = output<QuoteFormEvent>();

  readonly isEditMode = computed(() => this.editingItem() !== null);
  readonly title      = computed(() => this.isEditMode() ? this.t.editTitle : this.t.createTitle);

  readonly form = this.fb.nonNullable.group({
    textEs:       ['', [Validators.required, Validators.maxLength(500)]],
    textEn:       ['', [Validators.maxLength(500)]],
    author:       ['', [Validators.required, Validators.maxLength(120)]],
    scheduledFor: [''],
    isActive:     [true],
  });

  constructor() {
    effect(() => {
      const item = this.editingItem();
      if (!this.isOpen()) return;
      if (item) {
        this.form.patchValue({
          textEs:       item.textEs,
          textEn:       item.textEn ?? '',
          author:       item.author,
          scheduledFor: item.scheduledFor ?? '',
          isActive:     item.isActive,
        });
      } else {
        this.form.reset({ textEs: '', textEn: '', author: '', scheduledFor: '', isActive: true });
      }
    });
  }

  onClose(): void { this.close.emit(); }

  onSubmit(): void {
    if (this.form.invalid || this.isSaving()) return;
    const v = this.form.getRawValue();
    this.save.emit({
      textEs:       v.textEs.trim(),
      textEn:       v.textEn.trim() || null,
      author:       v.author.trim(),
      scheduledFor: v.scheduledFor || null,
      isActive:     v.isActive,
    });
  }
}
