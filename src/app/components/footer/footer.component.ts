import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

interface ExternalLink {
  label: string;
  href: string;
}

interface NavLink {
  path: string;
  labelKey: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly year = 2025;

  readonly services: NavLink[] = [
    { path: '/frete-maritimo', labelKey: 'navigation.freteMaritimo' },
    { path: '/frete-aereo', labelKey: 'navigation.freteAereo' },
    { path: '/transporte-rodoviario', labelKey: 'navigation.transporteRodoviario' },
    { path: '/desembaraco-aduaneiro', labelKey: 'navigation.desembaracoAduaneiro' },
    { path: '/seguro-carga', labelKey: 'navigation.seguroCarga' },
  ];

  /** Órgãos e portais que o cliente consulta no dia a dia do comex. */
  readonly officialLinks: ExternalLink[] = [
    { label: 'Portal Siscomex', href: 'https://portalunico.siscomex.gov.br/portal/' },
    { label: 'Banco Central', href: 'https://www.bcb.gov.br/' },
    { label: 'Mdic', href: 'https://www.gov.br/mdic/pt-br' },
    { label: 'Receita Federal', href: 'https://www.gov.br/receitafederal/pt-br' },
    { label: 'Anvisa', href: 'https://www.gov.br/anvisa/pt-br' },
    {
      label: 'Vigiagro',
      href: 'https://www.gov.br/agricultura/pt-br/assuntos/vigilancia-agropecuaria',
    },
    {
      label: 'Inmetro',
      href: 'https://www.gov.br/pt-br/orgaos/instituto-nacional-de-metrologia-qualidade-e-tecnologia',
    },
  ];
}
