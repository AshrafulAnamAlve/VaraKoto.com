import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created with a default theme', () => {
    expect(service).toBeTruthy();
    expect(['light', 'dark']).toContain(service.currentTheme());
  });

  it('should toggle theme between light and dark', () => {
    service.setTheme('light');
    expect(service.currentTheme()).toBe('light');
    expect(service.isDark()).toBe(false);

    service.toggleTheme();
    expect(service.currentTheme()).toBe('dark');
    expect(service.isDark()).toBe(true);

    service.toggleTheme();
    expect(service.currentTheme()).toBe('light');
    expect(service.isDark()).toBe(false);
  });

  it('should set specific theme', () => {
    service.setTheme('dark');
    expect(service.currentTheme()).toBe('dark');

    service.setTheme('light');
    expect(service.currentTheme()).toBe('light');
  });
});
