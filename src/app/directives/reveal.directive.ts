import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Revela o elemento quando ele entra na viewport.
 *
 * Aplica `.reveal` imediatamente e `.is-revealed` na entrada — a transição
 * em si vive no CSS global, para que o movimento seja um detalhe de estilo
 * e não de comportamento.
 *
 * Sem JS ou com movimento reduzido, o elemento simplesmente já está visível:
 * a classe base só é aplicada quando de fato há como animar.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  /** Atraso em ms — use para escalonar irmãos. */
  @Input('appReveal') delay: number | string = 0;

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const element = this.host.nativeElement as HTMLElement;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const delay = Number(this.delay) || 0;
    if (delay > 0) {
      element.style.transitionDelay = `${delay}ms`;
    }

    element.classList.add('reveal');

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          // Revelar é definitivo: nada reverte ao sair da tela.
          this.observer?.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
