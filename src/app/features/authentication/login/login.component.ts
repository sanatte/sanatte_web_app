import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/role.model';
import { AuthShellComponent } from '../components/auth-shell/auth-shell.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent],
  template: `
    <app-auth-shell icon="lock_open">
      <h1 class="font-heading text-headline-md text-on-surface mb-1">Inicia sesión</h1>
      <p class="font-sans text-label-md text-on-surface-variant mb-6">
        Bienvenido de nuevo a tu espacio de bienestar.
      </p>

      @if (errorMessage()) {
        <div class="mb-4 p-3 rounded-xl bg-error-container/50 border border-error/20 text-error
                    text-label-md font-heading flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">error</span>
          {{ errorMessage() }}
        </div>
      }

      <!-- Google -->
      <button (click)="withGoogle()" [disabled]="loading()"
              class="w-full py-3 rounded-full border border-outline-variant bg-white font-heading
                     font-semibold text-on-surface flex items-center justify-center gap-2
                     hover:bg-surface-container transition-colors disabled:opacity-50">
        <img src="https://www.google.com/favicon.ico" alt="" class="w-4 h-4" />
        Continuar con Google
      </button>

      <div class="flex items-center gap-3 my-5">
        <div class="flex-1 h-px bg-outline-variant/40"></div>
        <span class="text-label-sm font-heading text-outline">O con tu correo</span>
        <div class="flex-1 h-px bg-outline-variant/40"></div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="text-label-md font-heading font-semibold text-on-surface block mb-1.5">Correo electrónico</label>
          <div class="relative group">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline
                         group-focus-within:text-primary transition-colors text-[20px]">mail</span>
            <input formControlName="email" type="email" placeholder="ejemplo@sanatte.com"
                   class="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-transparent focus:border-primary
                          focus:ring-4 focus:ring-primary/10 rounded-full outline-none text-body-md transition-all" />
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="text-label-md font-heading font-semibold text-on-surface">Contraseña</label>
            <a routerLink="/auth/forgot" [queryParams]="{ returnUrl: returnUrl() }"
               class="text-label-sm font-heading text-primary hover:underline">¿Olvidaste tu contraseña?</a>
          </div>
          <div class="relative group">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline
                         group-focus-within:text-primary transition-colors text-[20px]">lock</span>
            <input formControlName="password" [type]="showPassword() ? 'text' : 'password'" placeholder="••••••••"
                   class="w-full pl-12 pr-11 py-3.5 bg-surface-container-low border border-transparent focus:border-primary
                          focus:ring-4 focus:ring-primary/10 rounded-full outline-none text-body-md transition-all" />
            <button type="button" (click)="showPassword.set(!showPassword())"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors">
              <span class="material-symbols-outlined text-[20px]">{{ showPassword() ? 'visibility_off' : 'visibility' }}</span>
            </button>
          </div>
        </div>

        <button type="submit" [disabled]="loading()"
                class="group w-full py-3.5 rounded-full gradient-primary text-white font-heading font-bold
                       shadow-[0px_10px_30px_rgba(107,56,212,0.25)] hover:opacity-95 active:scale-[0.98] transition-all
                       flex items-center justify-center gap-2 disabled:opacity-50">
          @if (loading()) {
            <span class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> Ingresando…
          } @else {
            Iniciar sesión
            <span class="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          }
        </button>
      </form>

      <p class="text-center text-label-md font-heading text-on-surface-variant mt-6">
        ¿No tienes cuenta?
        <a routerLink="/auth/register" [queryParams]="{ returnUrl: returnUrl() }"
           class="text-primary font-bold hover:underline">Crear cuenta</a>
      </p>
    </app-auth-shell>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly loading = this.auth.loading;
  readonly errorMessage = signal('');
  readonly showPassword = signal(false);
  readonly returnUrl = signal(this.route.snapshot.queryParamMap.get('returnUrl') ?? '');

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.errorMessage.set('');
    try {
      const { email, password } = this.form.getRawValue();
      await this.auth.login(email, password);
      await this.redirect();
    } catch (e) {
      if (e instanceof Error && e.message === 'email-not-verified') {
        await this.router.navigate(['/auth/verify-email']);
        return;
      }
      if (e instanceof Error && e.message === 'backend-unreachable') {
        this.errorMessage.set('No pudimos conectar con el servidor. Intenta más tarde.');
        return;
      }
      this.errorMessage.set('Credenciales inválidas. Intenta de nuevo.');
    }
  }

  async withGoogle(): Promise<void> {
    this.errorMessage.set('');
    try {
      await this.auth.signInWithGoogle();
      await this.redirect();
    } catch (e) {
      this.errorMessage.set(
        e instanceof Error && e.message === 'backend-unreachable'
          ? 'No pudimos conectar con el servidor. Intenta más tarde.'
          : 'No se pudo iniciar sesión con Google.'
      );
    }
  }

  private async redirect(): Promise<void> {
    const target = this.returnUrl()
      || (this.auth.role() === UserRole.Admin ? '/admin/dashboard' : '/app/library');
    await this.router.navigateByUrl(target);
  }
}
