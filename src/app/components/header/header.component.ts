import {
  Component,
  DOCUMENT,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription, filter } from 'rxjs';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

interface NavItem {
  path: string;
  labelKey: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    LanguageSwitcherComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnDestroy {
  /** Os cinco serviços — vivem no dropdown do desktop e na lista do drawer. */
  readonly services: NavItem[] = [
    { path: '/frete-maritimo', labelKey: 'navigation.freteMaritimo' },
    { path: '/frete-aereo', labelKey: 'navigation.freteAereo' },
    { path: '/transporte-rodoviario', labelKey: 'navigation.transporteRodoviario' },
    { path: '/desembaraco-aduaneiro', labelKey: 'navigation.desembaracoAduaneiro' },
    { path: '/seguro-carga', labelKey: 'navigation.seguroCarga' },
  ];

  readonly drawerOpen = signal(false);
  readonly servicesOpen = signal(false);
  readonly condensed = signal(false);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly routerSub: Subscription;

  constructor() {
    // Navegar sempre fecha o que estiver aberto — no drawer isso é essencial,
    // senão o menu cobre a página que acabou de carregar.
    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeDrawer();
        this.servicesOpen.set(false);
      });
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
    this.unlockScroll();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.condensed.set(window.scrollY > 24);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.drawerOpen()) this.closeDrawer();
    if (this.servicesOpen()) this.servicesOpen.set(false);
  }

  toggleDrawer(): void {
    this.drawerOpen() ? this.closeDrawer() : this.openDrawer();
  }

  openDrawer(): void {
    this.drawerOpen.set(true);
    this.lockScroll();
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
    this.unlockScroll();
  }

  toggleServices(): void {
    this.servicesOpen.update((open) => !open);
  }

  /** Fecha o dropdown quando o foco sai dele por completo. */
  onServicesBlur(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    const container = event.currentTarget as HTMLElement;
    if (!next || !container.contains(next)) {
      this.servicesOpen.set(false);
    }
  }

  private lockScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.document.body.style.overflow = 'hidden';
  }

  private unlockScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.document.body.style.overflow = '';
  }
}
