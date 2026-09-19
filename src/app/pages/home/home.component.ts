import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CotacaoComponent } from '../../components/cotacao/cotacao.component';
import { GlobeComponent } from '../../components/globe/globe.component';
import { RevealDirective } from '../../directives/reveal.directive';
import { TICKER_PORTS } from '../../data/ports';

interface Service {
  path: string;
  icon: string;
  labelKey: string;
  blurbKey: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    HeaderComponent,
    FooterComponent,
    CotacaoComponent,
    GlobeComponent,
    RevealDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  /**
   * A lista sai duplicada de propósito: o ticker anda -50% e emenda no
   * clone, o que faz o fluxo parecer infinito sem salto visível.
   */
  readonly tickerTrack = [...TICKER_PORTS, ...TICKER_PORTS];

  readonly services: Service[] = [
    {
      path: '/frete-maritimo',
      icon: 'ship',
      labelKey: 'navigation.freteMaritimo',
      blurbKey: 'home.serviceBlurb.freteMaritimo',
    },
    {
      path: '/frete-aereo',
      icon: 'airplane',
      labelKey: 'navigation.freteAereo',
      blurbKey: 'home.serviceBlurb.freteAereo',
    },
    {
      path: '/transporte-rodoviario',
      icon: 'truck',
      labelKey: 'navigation.transporteRodoviario',
      blurbKey: 'home.serviceBlurb.transporteRodoviario',
    },
    {
      path: '/desembaraco-aduaneiro',
      icon: 'display',
      labelKey: 'navigation.desembaracoAduaneiro',
      blurbKey: 'home.serviceBlurb.desembaracoAduaneiro',
    },
    {
      path: '/seguro-carga',
      icon: 'shield',
      labelKey: 'navigation.seguroCarga',
      blurbKey: 'home.serviceBlurb.seguroCarga',
    },
  ];

  /** "01", "02", … — o índice vira parte da composição editorial. */
  indexLabel(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
