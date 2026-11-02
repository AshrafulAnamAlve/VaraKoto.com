import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'vk_theme';
  readonly currentTheme = signal<ThemeMode>(this.getInitialTheme());

  constructor() {
    // Synchronize HTML element data-theme attribute whenever currentTheme changes
    effect(() => {
      const theme = this.currentTheme();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.storageKey, theme);
      }
    });
  }

  toggleTheme(): void {
    this.currentTheme.update(prev => (prev === 'light' ? 'dark' : 'light'));
  }

  setTheme(theme: ThemeMode): void {
    this.currentTheme.set(theme);
  }

  isDark(): boolean {
    return this.currentTheme() === 'dark';
  }

  private getInitialTheme(): ThemeMode {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return 'light';
    }

    const saved = localStorage.getItem(this.storageKey) as ThemeMode | null;
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }
}
