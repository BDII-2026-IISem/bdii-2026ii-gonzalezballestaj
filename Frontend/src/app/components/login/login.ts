
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/security/auth';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  isSuperuser: boolean;
  isStaff: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  identifier = '';
  password = '';
  loading = false;
  errorMessage = '';
  showPassword = false;

  submit(): void {
    if (!this.identifier.trim() || !this.password) {
      this.errorMessage =
        'Ingresa tu usuario o correo y tu contraseña.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const value = this.identifier.trim();
    const isEmail = value.includes('@');

    this.auth.login({
      ...(isEmail ? { email: value } : { username: value }),
      password: this.password
    }).subscribe({
      next: () => {
        this.auth.getProfile().subscribe({
          next: (profile: Record<string, unknown>) => {
            const user = profile as unknown as UserProfile;

            this.loading = false;

            if (user.isSuperuser === true) {
              void this.router.navigate(['/admin'], {
                state: {
                  welcomeMessage: '¡Bienvenido, administrador!',
                  username: user.username
                }
              });
            } else {
              void this.router.navigate(['/inicio']);
            }
          },
          error: (error: unknown) => {
            this.auth.logout();
            this.loading = false;
            this.errorMessage =
              'No se pudo consultar tu perfil. Intenta iniciar sesión nuevamente.';
            console.error('Error al consultar el perfil:', error);
          }
        });
      },
      error: (error: {
        error?: {
          detail?: string;
          non_field_errors?: string[];
          username?: string[];
          email?: string[];
          password?: string[];
        };
        status?: number;
      }) => {
        this.auth.logout();
        this.loading = false;

        if (error.status === 401) {
          this.errorMessage = 'Usuario o contraseña incorrectos.';
        } else if (error.status === 400) {
          this.errorMessage =
            error.error?.detail ??
            error.error?.non_field_errors?.[0] ??
            error.error?.username?.[0] ??
            error.error?.email?.[0] ??
            error.error?.password?.[0] ??
            'Verifica los datos ingresados.';
        } else {
          this.errorMessage =
            'No se pudo conectar con el servidor. Intenta nuevamente.';
        }

        console.error('Error al iniciar sesión:', error);
      }
    });
  }
}
