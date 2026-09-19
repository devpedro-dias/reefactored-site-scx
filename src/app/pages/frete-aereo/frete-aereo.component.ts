import { Component } from '@angular/core';
import { ServiceLayoutComponent } from '../../components/service-layout/service-layout.component';
import { ServicePageConfig } from '../../components/service-layout/service-layout.model';

@Component({
  selector: 'app-frete-aereo',
  standalone: true,
  imports: [ServiceLayoutComponent],
  template: '<app-service-layout [config]="config" />',
})
export class FreteAereoComponent {
  readonly config: ServicePageConfig = {
    key: 'freteAereo',
    navKey: 'navigation.freteAereo',
    descriptionCount: 3,
    image: 'website-images/images-fr-aereo/airplane-circle.png',
    imageAlt: 'Aeronave cargueira',
    listTitleKey: 'servicesTitle',
    items: [
      'doorToDoor',
      'directConsolidated',
      'dangerousGoods',
      'perishableGoods',
      'pharmaceutical',
      'packaging',
    ],
  };
}
