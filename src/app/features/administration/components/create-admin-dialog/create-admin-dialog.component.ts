import { Component, input, output, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TEXTS } from '../../../../core/i18n/texts';

export interface CreateAdminInput { displayName: string; email: string; password: string; }

@Component({
  selector: 'app-create-admin-dialog',
  imports: [ReactiveFormsModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-[60] bg-on-background/40 backdrop-blur-sm
                  flex items-center justify-center p-4"
           (click)="close()">

        <div class="bg-white w-full max-w-md rounded-lg shadow-2xl flex flex-col overflow-hidden"
             (click)="$event.stopPropagation()">

          <div class="px-8 py-6 border-b border-outline-variant/20">
            <div class="flex items-center gap-3 mb-1">
              <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <span class="material-symbols-outlined text-primary">admin_panel_settings</span>
              </div>
              <h2 class="font-heading text-headline-md font-bold text-on-surface">
                {{ t.title }}
              </h2>
            </div>
            <p class="text-label-md font-heading text-on-surface-variant mt-1">
              {{ t.subtitle }}
            </p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-8 space-y-5">

            @if (errorMessage()) {
              <div class="p-3 rounded-xl bg-error-container/50 border border-error/20 text-error
                          text-label-md font-heading flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">error</span>
                {{ errorMessage() }}
              </div>
            }

            <div class="space-y-2">
              <label class="text-label-md font-heading font-semibold text-on-surface">
                {{ t.name }} <span class="text-error">*</span>
              </label>
              <input formControlName="displayName" type="text" [placeholder]="t.namePlaceholder"
                     class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3
                            focus:ring-2 focus:ring-primary/50 outline-none text-label-md font-heading"/>
              @if (form.controls.displayName.touched && form.controls.displayName.errors) {
                <p class="text-label-sm text-error">{{ t.nameRequired }}</p>
              }
            </div>

            <div class="space-y-2">
              <label class="text-label-md font-heading font-semibold text-on-surface">
                {{ t.email }} <span class="text-error">*</span>
              </label>
              <input formControlName="email" type="email" [placeholder]="t.emailPlaceholder"
                     class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3
                            focus:ring-2 focus:ring-primary/50 outline-none text-label-md font-heading"/>
              @if (form.controls.email.touched && form.controls.email.errors) {
                <p class="text-label-sm text-error">{{ t.emailInvalid }}</p>
              }
            </div>

            <div class="space-y-2">
              <label class="text-label-md font-heading font-semibold text-on-surface">
                {{ t.password }} <span class="text-error">*</span>
              </label>
              <input formControlName="password" type="text" [placeholder]="t.passwordPlaceholder"
                     class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3
                            focus:ring-2 focus:ring-primary/50 outline-none text-label-md font-heading"/>
              @if (form.controls.password.touched && form.controls.password.errors) {
                <p class="text-label-sm text-error">{{ t.passwordMin }}</p>
              }
              <p class="text-label-sm font-heading text-on-surface-variant">
                {{ t.passwordHint }}
              </p>
            </div>

          </form>

          <div class="px-8 py-5 border-t border-outline-variant/20 flex justify-end gap-3 bg-white">
            <button type="button" (click)="close()" [disabled]="submitting()"
                    class="px-6 py-3 rounded-full text-label-md font-heading font-bold
                           text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50">
              {{ c.actions.cancel }}
            </button>
            <button type="button" (click)="onSubmit()" [disabled]="submitting()"
                    class="px-8 py-3 gradient-primary text-white rounded-full text-label-md
                           font-heading font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                    style="box-shadow: 0 4px 14px 0 rgb(var(--color-primary) / 0.39)">
              {{ submitting() ? t.submitting : t.submit }}
            </button>
          </div>

        </div>
      </div>
    }
  `,
})
export class CreateAdminDialogComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly t = TEXTS.admin.users.createDialog;
  protected readonly c = TEXTS.common;

  readonly isOpen = input.required<boolean>();
  readonly save   = output<CreateAdminInput>();
  readonly cancel = output<void>();

  readonly submitting  = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    displayName: ['', Validators.required],
    email:       ['', [Validators.required, Validators.email]],
    password:    ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.save.emit(this.form.getRawValue());
  }

  reset(): void {
    this.form.reset({ displayName: '', email: '', password: '' });
    this.errorMessage.set('');
    this.submitting.set(false);
  }

  setSubmitting(v: boolean): void { this.submitting.set(v); }
  setError(msg: string): void { this.errorMessage.set(msg); this.submitting.set(false); }

  close(): void {
    if (this.submitting()) return;
    this.errorMessage.set('');
    this.cancel.emit();
  }
}
