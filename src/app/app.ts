import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DevRoleSwitcherComponent } from './shared/components/dev-role-switcher/dev-role-switcher.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DevRoleSwitcherComponent],
  template: `
    <router-outlet />
    <app-dev-role-switcher />
  `,
})
export class App {}
