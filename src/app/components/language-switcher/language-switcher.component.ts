import { Component } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent {
  currentLang: string = 'pt';
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  // Sem bandeiras em emoji: no Windows elas viram as letras regionais
  // ("BR", "US") e poluem o controle. O código do idioma basta.
  languages = [
    { code: 'pt', name: 'PT' },
    { code: 'en', name: 'EN' },
  ];

  constructor(private translate: TranslateService) {
    const savedLang = isPlatformBrowser(this.platformId) ? localStorage.getItem('language') || 'pt' : 'pt';
    this.currentLang = savedLang;
    this.translate.use(savedLang);
  }

  switchLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', lang);
      this.document.documentElement.lang = lang;
    }
  }
}

