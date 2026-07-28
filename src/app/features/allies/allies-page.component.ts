import { Component } from '@angular/core';
import { AlliesSectionComponent } from '../public/components/allies-section/allies-section.component';

/** Página "Aliados" dentro del shell del usuario (/app/allies). */
@Component({
  selector: 'app-allies-page',
  imports: [AlliesSectionComponent],
  template: `
    <div class="p-4 md:p-6">
      <app-public-allies-section variant="app" />
    </div>
  `,
})
export class AlliesPageComponent {}
