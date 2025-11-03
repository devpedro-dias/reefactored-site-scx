import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { ContatoContentComponent } from '../../components/contato-content/contato-content.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-transporte-rodoviario',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterModule, CommonModule, FooterComponent, ContatoContentComponent,
    TranslateModule
  ],
  templateUrl: './transporte-rodoviario.component.html',
  styleUrl: './transporte-rodoviario.component.scss'
})
export class TransporteRodoviarioComponent {

}
