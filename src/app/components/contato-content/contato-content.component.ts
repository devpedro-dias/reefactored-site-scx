import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RevealDirective } from '../../directives/reveal.directive';

/** Faixa de chamada reutilizada no pé de todas as páginas de serviço. */
@Component({
  selector: 'app-contato-content',
  standalone: true,
  imports: [RouterLink, TranslateModule, RevealDirective],
  templateUrl: './contato-content.component.html',
  styleUrl: './contato-content.component.scss',
})
export class ContatoContentComponent {}
