import { Component, input, computed } from '@angular/core';

interface StatusConfig { label: string; dot: string; badge: string; }

const STATUS_MAP: Record<string, StatusConfig> = {
  active:    { label: 'Activo',      dot: 'bg-emerald-500', badge: 'bg-green-100 text-green-700' },
  inactive:  { label: 'Inactivo',    dot: 'bg-outline',     badge: 'bg-surface-variant text-outline' },
  blocked:   { label: 'Bloqueado',   dot: 'bg-error',       badge: 'bg-error-container text-error' },
  published: { label: 'Publicado',   dot: 'bg-emerald-500', badge: 'bg-green-100 text-green-700' },
  draft:     { label: 'Borrador',    dot: 'bg-secondary',   badge: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
  pending:   { label: 'Pendiente',   dot: 'bg-warning',     badge: 'bg-amber-100 text-amber-700' },
  paid:      { label: 'Pagado',      dot: 'bg-emerald-500', badge: 'bg-green-100 text-green-700' },
  shipped:   { label: 'Enviado',     dot: 'bg-sky-500',     badge: 'bg-blue-100 text-blue-700' },
  cancelled: { label: 'Cancelado',   dot: 'bg-error',       badge: 'bg-error-container text-error' },
};

const FALLBACK: StatusConfig = {
  label: '', dot: 'bg-outline', badge: 'bg-surface-variant text-outline',
};

@Component({
  selector: 'app-status-badge',
  template: `
    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                 text-label-sm font-heading font-bold whitespace-nowrap"
          [class]="config().badge">
      <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" [class]="config().dot"></span>
      {{ label() || config().label }}
    </span>
  `,
})
export class StatusBadgeComponent {
  readonly status = input.required<string>();
  readonly label  = input('');

  readonly config = computed(() => STATUS_MAP[this.status().toLowerCase()] ?? FALLBACK);
}
