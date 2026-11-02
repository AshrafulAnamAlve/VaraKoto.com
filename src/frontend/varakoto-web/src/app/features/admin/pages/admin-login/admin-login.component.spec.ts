import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { AdminLoginComponent } from './admin-login.component';
import { AdminService } from '../../../../core/services/admin.service';

describe('AdminLoginComponent', () => {
  let component: AdminLoginComponent;
  let fixture: ComponentFixture<AdminLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLoginComponent],
      providers: [
        AdminService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the admin login component', () => {
    expect(component).toBeTruthy();
  });

  it('should show error when submitting empty password', () => {
    component.password.set('');
    component.onLogin();
    expect(component.errorMessage()).toContain('পাসওয়ার্ড লিখুন');
  });
});
