import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AdminLoginRequestModel,
  AdminLoginResponseModel,
  AdminStatsModel,
  AdminSubmissionModel
} from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/admin`;
  private readonly storageKey = 'varakoto_admin_session';

  readonly currentUser = signal<AdminLoginResponseModel | null>(this.getStoredSession());
  readonly isAuthenticated = computed(() => !!this.currentUser());

  login(credentials: AdminLoginRequestModel): Observable<AdminLoginResponseModel> {
    return this.http.post<AdminLoginResponseModel>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        this.currentUser.set(res);
        localStorage.setItem(this.storageKey, JSON.stringify(res));
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.storageKey);
    this.router.navigate(['/admin/login']);
  }

  getStats(): Observable<AdminStatsModel> {
    return this.http.get<AdminStatsModel>(`${this.apiUrl}/stats`);
  }

  getSubmissions(status: string = 'Pending'): Observable<AdminSubmissionModel[]> {
    const url = status && status !== 'All' 
      ? `${this.apiUrl}/submissions?status=${status}` 
      : `${this.apiUrl}/submissions`;
    return this.http.get<AdminSubmissionModel[]>(url);
  }

  approveSubmission(id: number, adminNote?: string, adjustedFare?: number): Observable<AdminSubmissionModel> {
    const body = { adminNote, adjustedFare };
    return this.http.post<AdminSubmissionModel>(`${this.apiUrl}/submissions/${id}/approve`, body);
  }

  rejectSubmission(id: number, adminNote?: string): Observable<AdminSubmissionModel> {
    const body = { adminNote };
    return this.http.post<AdminSubmissionModel>(`${this.apiUrl}/submissions/${id}/reject`, body);
  }

  deleteSubmission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/submissions/${id}`);
  }

  private getStoredSession(): AdminLoginResponseModel | null {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return null;
      const parsed: AdminLoginResponseModel = JSON.parse(data);
      if (new Date(parsed.expiresAt) < new Date()) {
        localStorage.removeItem(this.storageKey);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }
}
