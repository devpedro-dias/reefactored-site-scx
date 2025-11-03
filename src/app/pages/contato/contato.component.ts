import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsComponent } from '../../components/forms/forms.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../../components/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterModule, FormsComponent,
    ReactiveFormsModule, CommonModule, FooterComponent,
    TranslateModule
  ],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.scss'
})
export class ContatoComponent {

}
