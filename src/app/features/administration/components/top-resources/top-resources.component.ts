import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardResource, ResourceType } from '../../models/dashboard-resource.model';

@Component({
  selector: 'app-top-resources',
  imports: [RouterLink],
  template: `
    <div class="glass-card p-6 rounded-lg h-full">
      <div class="flex justify-between items-center mb-6">
        <h4 class="font-heading text-headline-md text-on-surface">Top Recursos</h4>
        <a routerLink="/admin/resources"
           class="text-primary text-label-sm font-heading hover:underline">Ver todo</a>
      </div>

      <div class="space-y-3">
        @for (resource of resources(); track resource.id) {
          <div class="flex items-center gap-4 group cursor-pointer p-2 rounded-lg
                      hover:bg-surface-variant/30 transition-colors">
            <!-- Thumbnail -->
            <div class="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 relative">
              <div class="w-full h-full bg-gradient-to-br flex items-center justify-center"
                   [class]="resource.thumbnailGradient">
                <span class="material-symbols-outlined text-white text-[22px]">
                  {{ iconForType(resource.type) }}
                </span>
              </div>
              <div class="absolute inset-0 bg-black/20 flex items-center justify-center
                          opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <span class="material-symbols-outlined text-white text-[20px]">
                  {{ playIconForType(resource.type) }}
                </span>
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <h5 class="text-label-md font-heading text-on-surface truncate">
                {{ resource.title }}
              </h5>
              <p class="text-on-surface-variant text-label-sm mt-0.5">
                {{ resource.stats }} · {{ labelForType(resource.type) }}
              </p>
            </div>

            <!-- Progress bar -->
            <div class="h-1.5 w-12 bg-surface-container rounded-full overflow-hidden flex-shrink-0">
              <div class="h-full bg-primary rounded-full transition-all"
                   [style.width.%]="resource.progressPercent"></div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class TopResourcesComponent {
  readonly resources = input.required<DashboardResource[]>();

  iconForType(type: ResourceType): string {
    const map: Record<ResourceType, string> = {
      audio: 'headphones', video: 'videocam', pdf: 'picture_as_pdf', article: 'article',
    };
    return map[type];
  }

  playIconForType(type: ResourceType): string {
    return type === 'video' ? 'videocam' : 'play_arrow';
  }

  labelForType(type: ResourceType): string {
    const map: Record<ResourceType, string> = {
      audio: 'Audio', video: 'Video', pdf: 'PDF', article: 'Artículo',
    };
    return map[type];
  }
}
