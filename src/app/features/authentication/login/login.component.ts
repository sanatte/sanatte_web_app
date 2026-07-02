import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MockAuthService } from '../../../core/services/mock-auth.service';
import { UserRole } from '../../../core/models/role.model';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(MockAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  readonly loading = this.auth.loading;
  readonly errorMessage = signal('');
  readonly showPassword = signal(false);

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.errorMessage.set('');
    try {
      const { email, password } = this.loginForm.getRawValue();
      await this.auth.login(email, password);
      // Si venimos de un flujo que requería cuenta (p. ej. checkout), volvemos allí.
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      const target = returnUrl
        ?? (this.auth.role() === UserRole.Admin ? '/admin/dashboard' : '/app/library');
      await this.router.navigateByUrl(target);
    } catch {
      this.errorMessage.set('Credenciales inválidas. Por favor intenta de nuevo.');
    }
  }
}
