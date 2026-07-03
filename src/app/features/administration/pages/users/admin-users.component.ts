import { Component, inject, signal, computed, viewChild } from '@angular/core';
import { UserAdminService } from '../../services/user-admin.service';
import { UserTableComponent } from '../../components/user-table/user-table.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AdminPageHeaderComponent } from '../../../../shared/components/admin-page-header/admin-page-header.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { CreateAdminDialogComponent, CreateAdminInput } from '../../components/create-admin-dialog/create-admin-dialog.component';
import { AdminUser } from '../../models/user-admin.model';
import { UserRole } from '../../../../core/models/role.model';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-admin-users',
  imports: [UserTableComponent, ConfirmDialogComponent, AdminPageHeaderComponent, SearchInputComponent, CreateAdminDialogComponent],
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent {
  private readonly userService = inject(UserAdminService);
  private readonly createDialog = viewChild(CreateAdminDialogComponent);

  readonly searchTerm    = signal('');
  readonly currentPage   = signal(1);
  readonly isConfirmOpen = signal(false);
  readonly isCreateOpen  = signal(false);
  readonly userToDelete  = signal<AdminUser | null>(null);
  readonly confirmConfig = signal({ title: '', message: '', confirmText: '', variant: 'danger' as 'danger' | 'primary', action: '' });

  readonly filtered = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.userService.users();
    return this.userService.users().filter(
      (u) => u.displayName.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
  });

  readonly paginated = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });

  readonly stats = computed(() => ({
    total: this.userService.users().length,
    active: this.userService.users().filter((u) => u.status === 'active').length,
    admins: this.userService.users().filter((u) => u.role === UserRole.Admin).length,
    withSub: this.userService.users().filter((u) => u.hasActiveSubscription).length,
  }));

  onSearch(term: string): void { this.searchTerm.set(term); this.currentPage.set(1); }

  // ─── Crear administrador ──────────────────────────────────────────────────
  openCreate(): void { this.isCreateOpen.set(true); }
  onCreateCancel(): void { this.isCreateOpen.set(false); }

  async onCreateAdmin(input: CreateAdminInput): Promise<void> {
    const dialog = this.createDialog();
    dialog?.setSubmitting(true);
    try {
      await this.userService.createAdmin(input);
      dialog?.reset();
      this.isCreateOpen.set(false);
    } catch (e: unknown) {
      const msg = (e as { error?: { detail?: string } })?.error?.detail
        ?? 'No se pudo crear el administrador. Intenta de nuevo.';
      dialog?.setError(msg);
    }
  }

  onToggleStatus(user: AdminUser): void {
    const action = user.status === 'active' ? 'bloquear' : 'desbloquear';
    this.userToDelete.set(user);
    this.confirmConfig.set({
      title: `${user.status === 'active' ? 'Bloquear' : 'Desbloquear'} usuario`,
      message: `¿Deseas ${action} la cuenta de "${user.displayName}"?`,
      confirmText: `Sí, ${action}`,
      variant: user.status === 'active' ? 'danger' : 'primary',
      action: 'status',
    });
    this.isConfirmOpen.set(true);
  }

  onDeleteUser(user: AdminUser): void {
    this.userToDelete.set(user);
    this.confirmConfig.set({
      title: 'Eliminar usuario',
      message: `¿Eliminar la cuenta de "${user.displayName}"? Esta acción no se puede deshacer.`,
      confirmText: 'Sí, eliminar',
      variant: 'danger',
      action: 'delete',
    });
    this.isConfirmOpen.set(true);
  }

  async onConfirm(): Promise<void> {
    const user = this.userToDelete();
    if (!user) return;
    const { action } = this.confirmConfig();
    try {
      if (action === 'delete') await this.userService.delete(user.id);
      else if (action === 'status') {
        await this.userService.updateStatus(user.id, user.status === 'active' ? 'blocked' : 'active');
      }
    } catch (e: unknown) {
      const msg = (e as { error?: { detail?: string } })?.error?.detail
        ?? 'No se pudo completar la acción.';
      alert(msg);
    } finally {
      this.isConfirmOpen.set(false);
      this.userToDelete.set(null);
    }
  }

  onCancel(): void { this.isConfirmOpen.set(false); this.userToDelete.set(null); }
  onPageChange(page: number): void { this.currentPage.set(page); }
}
