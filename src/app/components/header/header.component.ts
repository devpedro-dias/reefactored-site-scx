import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterModule, CommonModule,
    RouterLink, RouterLinkActive,
    TranslateModule,
    LanguageSwitcherComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  routes = [
    {
      path: 'home',
      labelKey: 'navigation.home',
    },
    {
      path: 'frete-maritimo',
      labelKey: 'navigation.freteMaritimo',
    },
    {
      path: 'frete-aereo',
      labelKey: 'navigation.freteAereo',
    },
    {
      path: 'desembaraco-aduaneiro',
      labelKey: 'navigation.desembaracoAduaneiro',
    },
    {
      path: 'transporte-rodoviario',
      labelKey: 'navigation.transporteRodoviario'
    },
    {
      path: 'seguro-carga',
      labelKey: 'navigation.seguroCarga'
    },
    {
      path: 'contato',
      labelKey: 'navigation.contato'
    }
  ]
}
