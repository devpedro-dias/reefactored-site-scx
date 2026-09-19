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
const DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * Tema do site.
 *
 * Precedência: escolha explícita do usuário > preferência do sistema.
 *
 * Enquanto ninguém tocou no alternador, o site acompanha o tema do
 * sistema operacional — inclusive se ele mudar com a página aberta. A
 * partir do primeiro clique no alternador, a escolha é gravada e passa
 * a mandar; o sistema deixa de ser consultado.
 *
 * O `data-theme` inicial é escrito por um script inline no index.html,
 * antes da primeira pintura, com a mesma regra. Se mudar a precedência
 * aqui, mude lá também.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  readonly theme = signal<Theme>('light');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.theme.set(this.stored() ?? this.systemTheme());
      this.followSystem();
    }

    // O efeito só pinta. Gravar aqui marcaria como "escolha do usuário"
    // um valor que veio do sistema, congelando o site no tema da
    // primeira visita.
    effect(() => {
      const theme = this.theme();
      if (!isPlatformBrowser(this.platformId)) return;
      this.document.documentElement.dataset['theme'] = theme;
    });
  }

  /** Alterna e passa a valer sobre a preferência do sistema. */
  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Modo privado ou storage cheio: o tema ainda vale nesta sessão.
    }
  }

  /** Volta a seguir o sistema, descartando a escolha gravada. */
  resetToSystem(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignora
    }
    this.theme.set(this.systemTheme());
  }

  private stored(): Theme | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignora
    }
    return null;
  }

  private systemTheme(): Theme {
    return this.document.defaultView?.matchMedia?.(DARK_QUERY).matches
      ? 'dark'
      : 'light';
  }

  /** Acompanha o sistema em tempo real, enquanto não houver escolha gravada. */
  private followSystem(): void {
    const media = this.document.defaultView?.matchMedia?.(DARK_QUERY);
    if (!media) return;

    media.addEventListener('change', (event) => {
      if (this.stored()) return;
      this.theme.set(event.matches ? 'dark' : 'light');
    });
  }
}
