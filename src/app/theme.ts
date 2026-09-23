import { computed, Service, signal } from '@angular/core';

const storageKey = 'django-study-tracker.theme';

export type ThemeName = 'dark' | 'light';

function readTheme(): ThemeName {
  try {
    return localStorage.getItem(storageKey) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function applyTheme(theme: ThemeName): void {
  document.documentElement.setAttribute('data-theme', theme);
}

@Service()
export class Theme {
  readonly name = signal<ThemeName>(readTheme());
  readonly light = computed(() => this.name() === 'light');

  constructor() {
    applyTheme(this.name());
  }

  toggle(): void {
    const next: ThemeName = this.light() ? 'dark' : 'light';
    this.name.set(next);
    applyTheme(next);
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // The switch still updates this visit if storage is blocked.
    }
  }
}
