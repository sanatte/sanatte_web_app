import { Component, input, output, effect, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Resource, ResourceType } from '../../models/resource.model';

@Component({
  selector: 'app-resource-form-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './resource-form-dialog.component.html',
})
export class ResourceFormDialogComponent {
  private readonly fb = inject(FormBuilder);

  readonly isOpen   = input.required<boolean>();
  readonly resource = input<Resource | null>(null);

  readonly save   = output<Partial<Resource>>();
  readonly cancel = output<void>();

  readonly form = this.fb.nonNullable.group({
    title:       ['', Validators.required],
    type:        ['audio' as ResourceType, Validators.required],
    description: [''],
    status:      ['draft'],
    duration:    [''],
    fileSize:    [''],
    readTime:    [''],
    tags:        [''],
  });

  readonly isEditMode   = computed(() => this.resource() !== null);
  readonly selectedType = signal<ResourceType>('audio');

  constructor() {
    effect(() => {
      const r = this.resource();
      if (r) {
        this.form.patchValue({
          title:       r.title,
          type:        r.type,
          description: r.description,
          status:      r.status,
          duration:    r.duration ?? '',
          fileSize:    r.fileSize ?? '',
          readTime:    r.readTime ?? '',
          tags:        r.tags.join(', '),
        });
        this.selectedType.set(r.type);
      } else {
        this.form.reset({ title: '', type: 'audio', description: '',
                          status: 'draft', duration: '', fileSize: '',
                          readTime: '', tags: '' });
        this.selectedType.set('audio');
      }
    });
  }

  onTypeChange(event: Event): void {
    this.selectedType.set((event.target as HTMLSelectElement).value as ResourceType);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const raw = this.form.getRawValue();
    const type = raw.type as ResourceType;
    this.save.emit({
      title:       raw.title,
      type,
      description: raw.description,
      status:      raw.status as any,
      tags:        raw.tags ? raw.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      duration:    type === 'audio' || type === 'video' ? raw.duration || undefined : undefined,
      fileSize:    type === 'pdf'     ? raw.fileSize || undefined : undefined,
      readTime:    type === 'article' ? raw.readTime || undefined : undefined,
      thumbnailGradient: this.resource()?.thumbnailGradient ?? 'from-violet-400 to-purple-600',
    });
  }
}
