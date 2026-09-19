import { Component } from '@angular/core';
import { ServiceLayoutComponent } from '../../components/service-layout/service-layout.component';
import { ServicePageConfig } from '../../components/service-layout/service-layout.model';

@Component({
  selector: 'app-frete-maritimo',
  standalone: true,
  imports: [ServiceLayoutComponent],
  template: '<app-service-layout [config]="config" />',
})
export class FreteMaritimoComponent {
  readonly config: ServicePageConfig = {
    key: 'freteMaritimo',
    navKey: 'navigation.freteMaritimo',
    descriptionCount: 2,
    image: 'website-images/images-fr-marit/navio-IA-circle.png',
    imageAlt: 'Navio porta-contêineres',
    listTitleKey: 'servicesTitle',
    items: ['lcl', 'fcl', 'doorToDoor', 'projectCargo', 'roro', 'breakBulk'],
  };
}
