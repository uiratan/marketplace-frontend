import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-http-error',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './http-error.component.html',
  styleUrls: ['./http-error.component.scss'],
})
export class HttpErrorComponent {
  @Input() error: HttpErrorResponse | null = null;

  getErrorTitle(): string {
    if (!this.error) return '';

    const errorMessages: Record<number, string> = {
      400: 'Erro de validação nos campos informados.',
      401: 'Não autorizado. Por favor, faça login novamente.',
      403: 'Acesso proibido. Você não tem permissão para realizar esta ação.',
      404: 'Recurso não encontrado.',
      405: 'Método não permitido. Por favor, contate o suporte.',
      500: 'Erro interno no servidor. Tente novamente mais tarde.',
    };

    return errorMessages[this.error.status] || 'Ocorreu um erro. Tente novamente.';
  }

  getValidationErrors(): string[] {
    if (!this.error || this.error.status !== 400 || !this.error.error?.errors) {
      return [];
    }

    console.log(this.error.error.errors);

    // Cria um array para cada erro de campo, separando os erros com o campo como prefixo
    const errors: string[] = [];

    for (const key of Object.keys(this.error.error.errors)) {
      const fieldErrors = this.error.error.errors[key];
      fieldErrors.forEach((error: string) => {
        errors.push(`${key}: ${error}`);
      });
    }

    return errors;
  }

  // Método para fechar a exibição de erro
  closeError() {
    this.error = null;
  }

}
