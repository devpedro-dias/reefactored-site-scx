import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MensagemComponent } from '../mensagem/mensagem.component';
import { EmailService } from '../../services/email.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss',
})
export class FormsComponent {
  form: FormGroup = this.fb.group({
    from_name: ['', [Validators.required]],
    to_name: 'SCX Agenciamentos Marítimos',
    from_email: new FormControl('', [Validators.required, Validators.email]),
    subject: ['', [Validators.required]],
    message: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500),
      ],
    ],
  });

  successMessage: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;
  isHiding: boolean = false;
  private messageTimeout: any = null;

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private translate: TranslateService
  ) {}

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  private setMessageTimeout(): void {
    // Limpar timeout anterior se existir
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }

    // Resetar flag de hiding
    this.isHiding = false;

    // Definir novo timeout para iniciar animação de saída após 3 segundos
    this.messageTimeout = setTimeout(() => {
      // Iniciar animação de saída
      this.isHiding = true;

      // Aguardar animação de saída terminar antes de limpar
      setTimeout(() => {
        this.clearMessages();
        this.isHiding = false;
        this.messageTimeout = null;
      }, 400); // Tempo da animação de saída
    }, 3000);
  }

  async send(event?: Event) {
    console.log('=== send() CALLED ===');
    console.log('Event:', event);

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    console.log('Form state:', {
      valid: this.form.valid,
      invalid: this.form.invalid,
      value: this.form.value,
    });
    console.log('Form valid:', this.form.valid);
    console.log('Form value:', this.form.value);
    console.log('Form errors:', this.getFormErrors());

    // Marcar todos os campos como touched para mostrar erros
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsTouched();
    });

    if (this.form.invalid) {
      console.log('Form is invalid');

      // Verificar qual campo está com erro
      const errors = this.getFormErrors();
      let errorKey = 'contact.form.fillAll';

      if (errors.message?.minlength) {
        errorKey = 'contact.form.messageMinLength';
      } else if (errors.message?.required) {
        errorKey = 'contact.form.messageRequired';
      } else if (errors.from_email?.email) {
        errorKey = 'contact.form.emailInvalid';
      } else if (errors.from_email?.required) {
        errorKey = 'contact.form.emailRequired';
      } else if (errors.from_name?.required) {
        errorKey = 'contact.form.companyRequired';
      } else if (errors.subject?.required) {
        errorKey = 'contact.form.subjectRequired';
      }

      this.translate.get(errorKey).subscribe((text: string) => {
        this.errorMessage = text;
        this.successMessage = '';
        this.setMessageTimeout();
      });
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Desabilitar campos durante o envio
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].disable();
    });

    try {
      console.log('Sending email with data:', {
        from_name: this.form.value.from_name,
        from_email: this.form.value.from_email,
        to_name: this.form.value.to_name,
        subject: this.form.value.subject,
        message: this.form.value.message,
      });

      const result = await firstValueFrom(
        this.emailService.sendEmail({
          from_name: this.form.value.from_name,
          from_email: this.form.value.from_email,
          to_name: this.form.value.to_name,
          subject: this.form.value.subject,
          message: this.form.value.message,
        })
      );

      console.log('Email sent successfully:', result);
      this.translate.get('contact.form.success').subscribe((text: string) => {
        this.successMessage = text;
        this.errorMessage = '';
        this.setMessageTimeout();
      });
      this.form.reset();
    } catch (error: any) {
      console.error('Error sending email:', error);

      // Verificar se é erro de configuração do EmailJS (412)
      if (
        error?.status === 412 ||
        error?.message?.includes('Invalid grant') ||
        error?.message?.includes('Gmail')
      ) {
        this.translate
          .get('contact.form.configError')
          .subscribe((text: string) => {
            this.errorMessage = text;
            this.successMessage = '';
            this.setMessageTimeout();
          });
      } else {
        this.translate.get('contact.form.error').subscribe((text: string) => {
          this.errorMessage = text;
          this.successMessage = '';
          this.setMessageTimeout();
        });
      }
    } finally {
      // Reabilitar campos após o envio
      Object.keys(this.form.controls).forEach((key) => {
        this.form.controls[key].enable();
      });
      this.isSubmitting = false;
    }
  }

  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.controls[key];
      if (control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}
