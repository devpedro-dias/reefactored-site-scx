import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { CotacaoComponent } from '../../components/cotacao/cotacao.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterModule, FooterComponent, CotacaoComponent,
    TranslateModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
