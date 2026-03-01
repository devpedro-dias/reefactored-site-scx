import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, CommonModule
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'SCX Agencimentos Marítimos';
  private translate = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  ngOnInit(): void {
    const isBrowser = isPlatformBrowser(this.platformId);
    const savedLang = isBrowser ? localStorage.getItem('language') || 'pt' : 'pt';

    this.translate.setDefaultLang('pt');
    this.translate.use(savedLang);
    this.document.documentElement.lang = savedLang;
    
    const browserLang = this.translate.getBrowserLang();
    if (isBrowser && browserLang && ['pt', 'en'].includes(browserLang) && !localStorage.getItem('language')) {
      this.translate.use(browserLang);
      localStorage.setItem('language', browserLang);
      this.document.documentElement.lang = browserLang;
    }
  }
}
