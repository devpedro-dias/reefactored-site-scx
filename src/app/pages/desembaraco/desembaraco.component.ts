import { Component } from '@angular/core';
import { ServiceLayoutComponent } from '../../components/service-layout/service-layout.component';
import { ServicePageConfig } from '../../components/service-layout/service-layout.model';

@Component({
  selector: 'app-desembaraco',
  standalone: true,
  imports: [ServiceLayoutComponent],
  template: '<app-service-layout [config]="config" />',
})
export class DesembaracoComponent {
  readonly config: ServicePageConfig = {
    key: 'desembaracoAduaneiro',
    navKey: 'navigation.desembaracoAduaneiro',
    descriptionCount: 3,
    image: 'website-images/images-des-adu/desembaraco-circle.png',
    imageAlt: 'Desembaraço aduaneiro',
    support: {
      titleKey: 'supportTitle',
      descriptionKeys: ['supportDescription1'],
    },
    listTitleKey: 'tasksTitle',
    items: [
      'consulting',
      'tariffClassification',
      'specialRegime',
      'documentation',
      'lpco',
      'duimpDue',
    ],
  };
}
