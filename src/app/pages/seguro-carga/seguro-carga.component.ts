import { Component } from '@angular/core';
import { ServiceLayoutComponent } from '../../components/service-layout/service-layout.component';
import { ServicePageConfig } from '../../components/service-layout/service-layout.model';

@Component({
  selector: 'app-seguro-carga',
  standalone: true,
  imports: [ServiceLayoutComponent],
  template: '<app-service-layout [config]="config" />',
})
export class SeguroCargaComponent {
  // Única página sem lista de sub-serviços: são três parágrafos e a chamada.
  readonly config: ServicePageConfig = {
    key: 'seguroCarga',
    navKey: 'navigation.seguroCarga',
    descriptionCount: 3,
    image: 'website-images/images-seguro-carga/insurance.png',
    imageAlt: 'Seguro de carga',
  };
}
