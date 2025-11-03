import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
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

  ngOnInit(): void {
    const savedLang = localStorage.getItem('language') || 'pt';
    this.translate.setDefaultLang('pt');
    this.translate.use(savedLang);
    document.documentElement.lang = savedLang;
    
    const browserLang = this.translate.getBrowserLang();
    if (browserLang && ['pt', 'en'].includes(browserLang) && !localStorage.getItem('language')) {
      this.translate.use(browserLang);
      localStorage.setItem('language', browserLang);
      document.documentElement.lang = browserLang;
    }
  }
}
