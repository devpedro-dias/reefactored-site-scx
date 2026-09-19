import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmailService } from '../../services/email.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss',
})
export class FormsComponent implements OnDestroy {
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
  private hideTimeout: any = null;

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private translate: TranslateService
  ) {}

  ngOnDestroy(): void {
    // Sem isso, os timers seguem vivos depois de sair da página.
    clearTimeout(this.messageTimeout);
    clearTimeout(this.hideTimeout);
  }

  // -----------------------------------------------------------------
  //  Erros por campo
  // -----------------------------------------------------------------

  /** Só mostra erro depois que o campo foi tocado — não acusa antecipadamente. */
  showError(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  /** Mapeia o erro do campo para a chave i18n correspondente. */
  errorKey(name: string): string {
    const control = this.form.get(name);
    if (!control?.errors) return '';

    const map: Record<string, Record<string, string>> = {
      from_name: { required: 'contact.form.companyRequired' },
      from_email: {
        required: 'contact.form.emailRequired',
        email: 'contact.form.emailInvalid',
      },
      subject: { required: 'contact.form.subjectRequired' },
      message: {
        required: 'contact.form.messageRequired',
        minlength: 'contact.form.messageMinLength',
      },
    };

    const forField = map[name] ?? {};
    const firstError = Object.keys(control.errors).find((key) => forField[key]);
    return firstError ? forField[firstError] : 'contact.form.fillAll';
  }

  /** Caracteres restantes na mensagem, para o contador. */
  get messageRemaining(): number {
    const value = (this.form.get('message')?.value as string) ?? '';
    return 500 - value.length;
  }

  // -----------------------------------------------------------------
  //  Envio
  // -----------------------------------------------------------------

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  private setMessageTimeout(): void {
    clearTimeout(this.messageTimeout);
    clearTimeout(this.hideTimeout);
    this.isHiding = false;

    this.messageTimeout = setTimeout(() => {
      this.isHiding = true;

      this.hideTimeout = setTimeout(() => {
        this.clearMessages();
        this.isHiding = false;
        this.messageTimeout = null;
      }, 400);
    }, 4000);
  }

  private announce(key: string, kind: 'success' | 'error'): void {
    this.translate.get(key).subscribe((text: string) => {
      if (kind === 'success') {
        this.successMessage = text;
        this.errorMessage = '';
      } else {
        this.errorMessage = text;
        this.successMessage = '';
      }
      this.setMessageTimeout();
    });
  }

  async send(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsTouched();
    });

    if (this.form.invalid) {
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

      this.announce(errorKey, 'error');
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].disable();
    });

    try {
      // getRawValue(): os campos acabaram de ser desabilitados, e
      // `form.value` omite controles desabilitados — enviaria vazio.
      const raw = this.form.getRawValue();

      await firstValueFrom(
        this.emailService.sendEmail({
          from_name: raw.from_name,
          from_email: raw.from_email,
          to_name: raw.to_name,
          subject: raw.subject,
          message: raw.message,
        })
      );

      this.announce('contact.form.success', 'success');
      this.form.reset({ to_name: 'SCX Agenciamentos Marítimos' });
    } catch (error: any) {
      const isConfigError =
        error?.status === 412 ||
        error?.message?.includes('Invalid grant') ||
        error?.message?.includes('Gmail');

      this.announce(
        isConfigError ? 'contact.form.configError' : 'contact.form.error',
        'error'
      );
    } finally {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.controls[key].enable();
      });
      this.isSubmitting = false;
    }
  }

  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.form.controls).forEach((key) => {
      const control: AbstractControl = this.form.controls[key];
      if (control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}
