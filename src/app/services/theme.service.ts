import {
  DOCUMENT,
  Injectable,
  PLATFORM_ID,
  effect,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/**
 * Tema do site.
 *
 * O padrão é claro por decisão de projeto — `prefers-color-scheme` é
 * deliberadamente ignorado na primeira visita, para que todo mundo veja
 * a mesma primeira impressão. A escolha do usuário, essa sim, persiste.
 *
 * O `data-theme` inicial é escrito por um script inline no index.html,
 * antes da primeira pintura; aqui só mantemos o valor sincronizado.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  readonly theme = signal<Theme>('light');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.theme.set(this.read());
    }

    effect(() => {
      const theme = this.theme();
      if (!isPlatformBrowser(this.platformId)) return;

      this.document.documentElement.dataset['theme'] = theme;
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // Modo privado ou storage cheio: o tema ainda vale nesta sessão.
      }
    });
  }

  toggle(): void {
    this.theme.update((theme) => (theme === 'dark' ? 'light' : 'dark'));
  }

  private read(): Theme {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignora
    }
    return 'light';
  }
}
