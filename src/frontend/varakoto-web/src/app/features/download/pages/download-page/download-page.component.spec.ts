import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DownloadPageComponent } from './download-page.component';
import { ThemeService } from '../../../../core/services/theme.service';
import { NativeMobileService } from '../../../../core/services/native-mobile.service';

describe('DownloadPageComponent', () => {
  let component: DownloadPageComponent;
  let fixture: ComponentFixture<DownloadPageComponent>;
  let themeService: ThemeService;
  let nativeMobile: NativeMobileService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadPageComponent],
      providers: [
        provideRouter([]),
        ThemeService,
        NativeMobileService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadPageComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService);
    nativeMobile = TestBed.inject(NativeMobileService);
    fixture.detectChanges();
  });

  it('should create the download page component', () => {
    expect(component).toBeTruthy();
  });

  it('should display download titles and badges', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-title')?.textContent).toContain('ভাড়া কত?');
    expect(compiled.querySelector('.app-tagline')?.textContent).toContain('অ্যান্ড্রয়েড মোবাইল অ্যাপ্লিকেশন');
    expect(compiled.textContent).toContain('v1.1.4');
    expect(compiled.textContent).toContain('~9.7 MB');
  });

  it('should have direct download and mirror links configured', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const directBtn = compiled.querySelector('.primary-download-btn') as HTMLAnchorElement;
    const mirrorBtn = compiled.querySelector('.mirror-btn') as HTMLAnchorElement;

    expect(directBtn.getAttribute('href')).toBe('downloads/varakoto.apk');
    expect(mirrorBtn.getAttribute('href')).toContain('github.com/AshrafulAnamAlve/VaraKoto.com/releases');
  });

  it('should trigger haptic impact when onDownloadClick is called', () => {
    const hapticSpy = vi.spyOn(nativeMobile, 'hapticImpact');
    component.onDownloadClick();
    expect(hapticSpy).toHaveBeenCalledWith('medium');
  });

  it('should toggle theme on button click', () => {
    const toggleSpy = vi.spyOn(themeService, 'toggleTheme');
    component.toggleTheme();
    expect(toggleSpy).toHaveBeenCalled();
  });
});
