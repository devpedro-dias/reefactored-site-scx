import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ContatoContentComponent } from '../contato-content/contato-content.component';
import { RevealDirective } from '../../directives/reveal.directive';
import { ServicePageConfig } from './service-layout.model';

@Component({
  selector: 'app-service-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    HeaderComponent,
    FooterComponent,
    ContatoContentComponent,
    RevealDirective,
  ],
  templateUrl: './service-layout.component.html',
  styleUrl: './service-layout.component.scss',
})
export class ServiceLayoutComponent {
  private readonly configSignal = signal<ServicePageConfig | null>(null);

  @Input({ required: true })
  set config(value: ServicePageConfig) {
    this.configSignal.set(value);
  }

  get cfg(): ServicePageConfig {
    return this.configSignal()!;
  }

  /** Raiz das chaves i18n desta página. */
  readonly base = computed(() => `services.${this.configSignal()?.key}`);

  /** ['…description1', '…description2', …] conforme a contagem configurada. */
  readonly descriptionKeys = computed(() => {
    const config = this.configSignal();
    if (!config) return [];
    return Array.from(
      { length: config.descriptionCount },
      (_, index) => `${this.base()}.description${index + 1}`,
    );
  });

  itemKey(item: string, field: 'title' | 'description'): string {
    return `${this.base()}.${item}.${field}`;
  }

  fullKey(suffix: string): string {
    return `${this.base()}.${suffix}`;
  }

  indexLabel(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
