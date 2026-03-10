import { Component, input, output } from '@angular/core';
import { Emotion } from '../../models/emotion.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-emotion-table',
  imports: [StatusBadgeComponent],
  template: `
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">
              Image
            </th>
            <th class="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Emotion Name
            </th>
            <th class="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Description
            </th>
            <th class="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-32">
              Status
            </th>
            <th class="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-32">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          @for (emotion of emotions(); track emotion.id) {
            <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <!-- Icon -->
              <td class="px-6 py-4">
                <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                  @if (emotion.icon) {
                    <img [src]="emotion.icon" alt="{{ emotion.name }}" class="w-full h-full object-cover">
                  } @else {
                    <span class="text-gray-400">?</span>
                  }
                </div>
              </td>

              <!-- Name -->
              <td class="px-6 py-4">
                <p class="text-sm font-semibold text-gray-800">{{ emotion.name }}</p>
              </td>

              <!-- Description -->
              <td class="px-6 py-4">
                <p class="text-sm text-gray-500 line-clamp-1">{{ emotion.description }}</p>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 text-center">
                <button (click)="toggleStatus.emit(emotion)" class="cursor-pointer">
                  <app-status-badge [status]="emotion.status" />
                </button>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <button
                    (click)="edit.emit(emotion)"
                    class="p-2 rounded-lg text-primary/70 hover:text-primary hover:bg-primary/5
                           transition-colors"
                    title="Edit emotion">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582
                        16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0
                        0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25
                        2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button
                    (click)="delete.emit(emotion)"
                    class="p-2 rounded-lg text-danger/70 hover:text-danger hover:bg-red-50
                           transition-colors"
                    title="Delete emotion">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107
                        1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25
                        2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12
                        .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964
                        51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5" class="px-6 py-12 text-center">
                <div class="text-gray-300 text-5xl mb-3">😶</div>
                <p class="text-sm text-gray-400">No emotions found</p>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class EmotionTableComponent {
  readonly emotions = input.required<Emotion[]>();

  readonly edit = output<Emotion>();
  readonly delete = output<Emotion>();
  readonly toggleStatus = output<Emotion>();
}
