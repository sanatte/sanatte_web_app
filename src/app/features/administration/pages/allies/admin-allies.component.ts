import { Component, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AllyService } from '../../services/ally.service';
import { Ally, WELLNESS_PILLARS } from '../../models/ally.model';

@Component({
  selector: 'app-admin-allies',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-allies.component.html',
})
export class AdminAlliesComponent {
  private readonly svc = inject(AllyService);
  private readonly fb = inject(FormBuilder);

  readonly allies  = this.svc.allies;
  readonly loading = this.svc.loading;
  readonly pillars = WELLNESS_PILLARS;

  readonly isModalOpen  = signal(false);
  readonly editing      = signal<Ally | null>(null);
  readonly isSaving     = signal(false);
  readonly errorMsg     = signal<string | null>(null);
  readonly selectedLogo = signal<File | null>(null);
  readonly logoPreview  = signal<string | null>(null);

  readonly isEditMode = computed(() => this.editing() !== null);

  readonly form = this.fb.nonNullable.group({
    name:               ['', Validators.required],
    pillar:             [WELLNESS_PILLARS[0], Validators.required],
    description:        [''],
    whatsApp:           ['', Validators.required],
    website:            [''],
    benefitTitle:       ['', Validators.required],
    benefitDescription: [''],
    isActive:           [true],
  });

  openCreate(): void {
    this.editing.set(null);
    this.form.reset({
      name: '', pillar: WELLNESS_PILLARS[0], description: '', whatsApp: '',
      website: '', benefitTitle: '', benefitDescription: '', isActive: true,
    });
    this.resetLogo();
    this.errorMsg.set(null);
    this.isModalOpen.set(true);
  }

  openEdit(a: Ally): void {
    this.editing.set(a);
    this.form.reset({
      name: a.name, pillar: a.pillar, description: a.description ?? '', whatsApp: a.whatsApp,
      website: a.website ?? '', benefitTitle: a.benefitTitle, benefitDescription: a.benefitDescription ?? '',
      isActive: a.isActive,
    });
    this.resetLogo();
    this.errorMsg.set(null);
    this.isModalOpen.set(true);
  }

  closeModal(): void { if (!this.isSaving()) this.isModalOpen.set(false); }

  private resetLogo(): void { this.selectedLogo.set(null); this.logoPreview.set(null); }

  onLogoSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.errorMsg.set('El logo debe ser JPEG, PNG o WebP.');
      input.value = '';
      return;
    }
    this.errorMsg.set(null);
    this.selectedLogo.set(file);
    this.logoPreview.set(URL.createObjectURL(file));
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.isSaving()) return;
    this.isSaving.set(true);
    this.errorMsg.set(null);
    try {
      const data = this.form.getRawValue();
      const editing = this.editing();
      const saved = editing ? await this.svc.update(editing.id, data) : await this.svc.create(data);

      const logo = this.selectedLogo();
      if (logo) {
        try { await this.svc.uploadLogo(saved.id, logo); }
        catch { /* logo opcional: se puede reintentar */ }
      }
      this.isModalOpen.set(false);
    } catch (e: unknown) {
      this.errorMsg.set(
        (e as { error?: { detail?: string } })?.error?.detail
        ?? (e as Error)?.message
        ?? 'No se pudo guardar el aliado.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async onDelete(a: Ally): Promise<void> {
    if (confirm(`¿Eliminar al aliado "${a.name}"? Esta acción no se puede deshacer.`)) {
      await this.svc.delete(a.id);
    }
  }

  async toggleActive(a: Ally): Promise<void> {
    await this.svc.update(a.id, { ...a, isActive: !a.isActive });
  }
}
