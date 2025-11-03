import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contato-content',
  standalone: true,
  imports: [
    RouterLink, RouterLinkActive, TranslateModule
  ],
  templateUrl: './contato-content.component.html',
  styleUrl: './contato-content.component.scss'
})
export class ContatoContentComponent {

}
