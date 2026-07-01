import { Component, inject } from '@angular/core';
import { isDevMode } from '@angular/core';
import { RoleService } from '../../../core/services/role.service';
import { UserRole } from '../../../core/models/role.model';

/**
 * Floater visible SOLO en desarrollo para cambiar de rol sin logout.
 * Agrégalo al shell (app.ts o cualquier layout) con <app-dev-role-switcher />.
 */
@Component({
  selector: 'app-dev-role-switcher',
  template: `
    @if (isDev) {
      <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-1.5 items-end">
        <span class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 pr-1">
          Dev · Rol: {{ current() }}
        </span>
        <div class="flex gap-1.5">
          <button (click)="toAdmin()"
                  class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white
                         hover:bg-primary-dark transition-colors shadow-lg">
            Admin
          </button>
          <button (click)="toUser()"
                  class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border
                         border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-lg">
            User
          </button>
        </div>
      </div>
    }
  `,
})
export class DevRoleSwitcherComponent {
  private readonly roleService = inject(RoleService);
  readonly isDev = isDevMode();
  readonly current = this.roleService.current.bind(this.roleService);

  toAdmin(): void { this.roleService.switchToAdmin(); }
  toUser(): void  { this.roleService.switchToUser(); }
}
