import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LogoComponent],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  private readonly adminService = inject(AdminService);
  private readonly router = inject(Router);

  readonly username = signal<string>('admin');
  readonly password = signal<string>('');
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  onLogin(): void {
    const user = this.username().trim();
    const pass = this.password();

    if (!user || !pass) {
      this.errorMessage.set('ব্যবহারকারী নাম এবং পাসওয়ার্ড লিখুন।');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.adminService.login({ username: user, password: pass }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'ভুল ব্যবহারকারী নাম অথবা পাসওয়ার্ড।');
      }
    });
  }
}
