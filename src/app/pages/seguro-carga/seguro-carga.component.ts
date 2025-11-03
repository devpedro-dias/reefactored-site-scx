import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { ContatoContentComponent } from '../../components/contato-content/contato-content.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-seguro-carga',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterModule, CommonModule, FooterComponent, ContatoContentComponent,
    TranslateModule
  ],
  templateUrl: './seguro-carga.component.html',
  styleUrl: './seguro-carga.component.scss'
})
export class SeguroCargaComponent {

}
