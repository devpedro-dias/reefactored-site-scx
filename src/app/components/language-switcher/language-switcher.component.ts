import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  languages = [
    { code: 'pt', name: 'PT', flag: '🇧🇷' },
    { code: 'en', name: 'EN', flag: '🇺🇸' }
  ];

  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('language') || 'pt';
    this.currentLang = savedLang;
    this.translate.use(savedLang);
  }

  switchLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  }
}

