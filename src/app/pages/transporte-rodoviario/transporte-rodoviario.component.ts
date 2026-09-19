import { Component } from '@angular/core';
import { ServiceLayoutComponent } from '../../components/service-layout/service-layout.component';
import { ServicePageConfig } from '../../components/service-layout/service-layout.model';

@Component({
  selector: 'app-transporte-rodoviario',
  standalone: true,
  imports: [ServiceLayoutComponent],
  template: '<app-service-layout [config]="config" />',
})
export class TransporteRodoviarioComponent {
  readonly config: ServicePageConfig = {
    key: 'transporteRodoviario',
    navKey: 'navigation.transporteRodoviario',
    descriptionCount: 3,
    image: 'website-images/images-transp-rod/truck-circle.png',
    imageAlt: 'Caminhão de transporte rodoviário',
    support: {
      titleKey: 'supportTitle',
      descriptionKeys: ['supportDescription'],
    },
    // Sem listTitleKey: o texto de suporte já introduz a lista, então o
    // layout cai no rótulo genérico "O que oferecemos".
    items: [
      'receiving',
      'storage',
      'handling',
      'pickingPacking',
      'shipping',
      'vmi',
    ],
    footnoteKey: 'vmiDescription',
  };
}
