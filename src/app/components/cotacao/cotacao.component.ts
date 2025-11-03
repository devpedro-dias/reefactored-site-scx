import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MoedasService } from '../../services/moedas.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Observable, concat, Subscription } from 'rxjs';
import { Moeda } from '../../interfaces/moeda';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-cotacao',
  standalone: true,
  imports: [
    HttpClientModule, CommonModule, TranslateModule
  ],
  templateUrl: './cotacao.component.html',
  styleUrl: './cotacao.component.scss'
})
export class CotacaoComponent implements OnInit, OnDestroy {
  moedas: Moeda[] = [];
  myDate = Date.now();
  currentLang: string = 'pt';
  dateFormat: string = 'dd/MM/yyyy';
  dateLocale: string = 'pt-BR';
  private langChangeSubscription?: Subscription;

  
  constructor (
    private moedasService: MoedasService,
    private translate: TranslateService
  ) {
    this.currentLang = this.translate.currentLang || this.translate.defaultLang || 'pt';
    this.updateDateFormat();
    
    // Observar mudanças no idioma
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
      this.updateDateFormat();
    });
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  private updateDateFormat(): void {
    if (this.currentLang === 'en') {
      this.dateFormat = 'MM/dd/yyyy';
      this.dateLocale = 'en-US';
    } else {
      this.dateFormat = 'dd/MM/yyyy';
      this.dateLocale = 'pt-BR';
    }
  }

  ngOnInit() {
    this.getMoedasData().subscribe(
      (data) => {
        this.moedas = Object.values(data);
      },
      (error) => {
        this.handleError(error);
      }
    );
  }
  
  getMoedasData(): Observable<{ [key: string]: Moeda }> {
    return this.moedasService.getMoedas();
  }
  
  handleError(error: any) {
    if (error.status === 404) {
      console.error('Nenhuma moeda encontrada.');
    } else {
      console.error('Erro ao obter as moedas:', error);
    }
  } 
  
  parseToNumber(value: string): number {
    return parseFloat(value);
  }
}