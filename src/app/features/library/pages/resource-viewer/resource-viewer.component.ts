import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductService } from '../../../administration/services/product.service';
import { EntitlementService } from '../../../administration/services/entitlement.service';
import { Resource, ResourceType, RESOURCE_TYPE_META } from '../../../administration/models/resource.model';
import { VideoPlayerComponent } from '../../../../shared/components/resource-viewers/video-player.component';
import { AudioPlayerComponent } from '../../../../shared/components/resource-viewers/audio-player.component';
import { PdfViewerComponent } from '../../../../shared/components/resource-viewers/pdf-viewer.component';
import { ArticleReaderComponent } from '../../../../shared/components/resource-viewers/article-reader.component';

@Component({
  selector: 'app-resource-viewer',
  imports: [
    RouterLink,
    VideoPlayerComponent,
    AudioPlayerComponent,
    PdfViewerComponent,
    ArticleReaderComponent,
  ],
  templateUrl: './resource-viewer.component.html',
})
export class ResourceViewerComponent {
  private readonly route       = inject(ActivatedRoute);
  private readonly router      = inject(Router);
  private readonly products    = inject(ProductService);
  private readonly entitlements = inject(EntitlementService);

  private readonly params = toSignal(
    this.route.paramMap.pipe(map((p) => ({ productId: p.get('productId'), resourceId: p.get('resourceId') }))),
    { initialValue: { productId: null, resourceId: null } }
  );

  readonly product = computed(() => {
    const id = this.params().productId;
    return id ? this.products.getById(id) ?? null : null;
  });

  readonly resources = computed<Resource[]>(() => {
    const p = this.product();
    return p ? this.entitlements.getResourcesForProduct(p) : [];
  });

  readonly hasResources = computed(() => this.resources().length > 0);

  readonly active = computed<Resource | null>(() => {
    const list = this.resources();
    if (!list.length) return null;
    const id = this.params().resourceId;
    return list.find((r) => r.id === id) ?? list[0];
  });

  readonly typeMeta = computed(() => (this.active() ? RESOURCE_TYPE_META[this.active()!.type] : null));

  readonly typeMetaOf = (type: ResourceType) => RESOURCE_TYPE_META[type];

  select(resource: Resource): void {
    const p = this.product();
    if (p) this.router.navigate(['/app/library', p.id, resource.id]);
  }

  back(): void {
    this.router.navigate(['/app/library']);
  }
}
