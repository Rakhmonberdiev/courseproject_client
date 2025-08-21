import { effect, Injectable, signal } from '@angular/core';
export type Theme = 'light' | 'dark';
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  private readonly _theme = signal<Theme>('light');
  theme = this._theme.asReadonly();
  constructor() {
    effect(() => {
      const t = this._theme();
      document.documentElement.setAttribute('data-theme', t);
      try {
        localStorage.setItem(this.STORAGE_KEY, t);
      } catch {}
    });
  }

  initTheme() {
    const saved = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    const systemDark = window.matchMedia?.(
      '(prefers-color-scheme: dark)'
    ).matches;
    this._theme.set(saved ?? (systemDark ? 'dark' : 'light'));
  }

  toggle() {
    this._theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }

  set(theme: Theme) {
    this._theme.set(theme);
  }

  isDark() {
    return this._theme() === 'dark';
  }
}
