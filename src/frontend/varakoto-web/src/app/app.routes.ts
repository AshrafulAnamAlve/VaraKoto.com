import { Routes } from '@angular/router';
import { HomePageComponent } from './features/fare-finder/pages/home-page/home-page.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/pages/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./features/admin/pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard]
  },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
