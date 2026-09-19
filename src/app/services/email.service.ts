import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EmailData {
  from_name: string;
  from_email: string;
  to_name?: string;
  subject: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor() {
    // EmailJS será inicializado automaticamente no primeiro uso
  }

  sendEmail(data: EmailData): Observable<any> {
    // Sem logs do payload aqui: `data` carrega e-mail e mensagem de quem
    // preencheu o formulário, e isso ficava visível no console em produção.
    try {
      emailjs.init(environment.emailjs.publicKey);
    } catch (error) {
      console.warn('EmailJS init warning (may already be initialized):', error);
    }

    const templateParams = {
      from_name: data.from_name,
      from_email: data.from_email,
      to_name: data.to_name || 'SCX Agenciamentos Marítimos',
      subject: data.subject,
      message: data.message,
    };

    return from(
      emailjs
        .send(
          environment.emailjs.serviceId,
          environment.emailjs.templateId,
          templateParams
        )
        .catch((error) => {
          console.error('EmailJS send error:', error);
          // Extrair mensagem de erro mais amigável
          let errorMessage = 'Failed to send email';
          if (error.text) {
            errorMessage = error.text;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.status === 412) {
            errorMessage =
              'Email service configuration error. Please contact support.';
          }
          const customError = new Error(errorMessage);
          (customError as any).status = error.status || 500;
          (customError as any).originalError = error;
          throw customError;
        })
    );
  }
}
