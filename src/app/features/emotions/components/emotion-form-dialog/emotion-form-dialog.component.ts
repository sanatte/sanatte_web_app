import { Component, input, output, signal, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Emotion, CreateEmotionRequest, UpdateEmotionRequest, EMOTION_VALENCES } from '../../models/emotion.model';

@Component({
  selector: 'app-emotion-form-dialog',
  imports: [ReactiveFormsModule],
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        <!-- Dialog -->
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ emotion() ? 'Edit Emotion' : 'Add Emotion' }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ emotion() ? 'Update the emotion details below.' : 'Fill in the details to create a new emotion.' }}
          </p>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="mt-6 flex flex-col gap-5">
            <!-- Image Upload (Centered Profile Style) -->
            <div class="flex flex-col items-center justify-center gap-2">
              <div class="relative group cursor-pointer" onclick="document.getElementById('imgUpload').click()">
                @if (form.value.icon) {
                  <img [src]="form.value.icon" alt="Preview" class="w-24 h-24 rounded-full border border-gray-200 object-cover shadow-sm">
                } @else {
                  <div class="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center border border-dashed border-gray-300 text-gray-400 group-hover:bg-gray-100 transition-colors">
                    <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                }
                <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </div>
              </div>
              <p class="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-1">Upload Emotion</p>
              <input id="imgUpload" type="file" accept="image/*" class="hidden" (change)="onFileSelected($event)">
            </div>

            <!-- Name and Status Row -->
            <div class="flex items-start gap-5">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Emotion Name</label>
                <input
                  formControlName="name"
                  placeholder="e.g. Happiness"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                @if (form.controls.name.touched && form.controls.name.errors) {
                  <p class="mt-1 text-xs text-red-500">Name is required (2-50 chars).</p>
                }
              </div>

              <!-- Status Toggle -->
              <div class="flex flex-col">
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <label class="relative inline-flex items-center cursor-pointer mt-1">
                  <input type="checkbox" formControlName="status" class="sr-only peer">
                  <div class="w-[44px] h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span class="ml-3 text-sm font-medium whitespace-nowrap w-14" [class.text-primary]="form.value.status" [class.text-gray-500]="!form.value.status">
                    {{ form.value.status ? 'Active' : 'Inactive' }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                formControlName="description"
                rows="3"
                placeholder="Write a short description..."
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none
                       focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
              </textarea>
              @if (form.controls.description.touched && form.controls.description.errors) {
                <p class="mt-1 text-xs text-red-500">Description is required (5-300 chars).</p>
              }
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
              <button
                type="button"
                (click)="onCancel()"
                class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100
                       rounded-xl hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="form.invalid"
                class="px-5 py-2.5 text-sm font-medium text-white gradient-primary
                       rounded-xl hover:opacity-90 transition-opacity
                       disabled:opacity-50 disabled:cursor-not-allowed">
                {{ emotion() ? 'Save Changes' : 'Create Emotion' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class EmotionFormDialogComponent {
  private readonly fb = inject(FormBuilder);

  readonly open = input(false);
  readonly emotion = input<Emotion | null>(null);

  readonly save = output<CreateEmotionRequest | UpdateEmotionRequest>();
  readonly cancel = output<void>();

  readonly valences = EMOTION_VALENCES;

  readonly form = this.fb.nonNullable.group({
    icon: [''],
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(300)]],
    status: [true], // true = active, false = inactive
  });

  constructor() {
    effect(() => {
      const e = this.emotion();
      if (e) {
        this.form.patchValue({
          icon: e.icon,
          name: e.name,
          description: e.description,
          status: e.status === 'active',
        });
      } else {
        this.form.reset({ status: true });
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.form.patchValue({ icon: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    const val = this.form.getRawValue();
    const payload = {
      name: val.name,
      description: val.description,
      icon: val.icon,
      status: val.status ? 'active' : 'inactive'
    };
    this.save.emit(payload as CreateEmotionRequest | UpdateEmotionRequest);
  }

  onCancel(): void {
    this.form.reset({ status: true });
    this.cancel.emit();
  }
}
