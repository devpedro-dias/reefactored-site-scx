import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
import { ContatoContentComponent } from '../../components/contato-content/contato-content.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-frete-aereo',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterModule, CommonModule, FooterComponent, ContatoContentComponent,
    TranslateModule
  ],
  templateUrl: './frete-aereo.component.html',
  styleUrl: './frete-aereo.component.scss'
})
export class FreteAereoComponent {

}
