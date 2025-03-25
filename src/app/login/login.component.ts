import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string = 'teste@gmail.com';
  password: string = '123456';
  errorMessage: string = '';
  hidePassword: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  // onSubmit(): void {
    signInUserPassword(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: (err) => {
        this.errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
        console.error(err);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword; // Alterna entre true e false
  }

  signInWithGoogle(): void {
    console.log('Iniciando signInWithGoogle');
    const redirectUri = 'postmessage';
    const clientId = (window as any).process?.env?.GOOGLE_CLIENT_ID || environment.googleClientId;
    console.log('Configurando initCodeClient com redirectUri:', redirectUri);
    console.log('Usando client_id:', clientId);

    const client = (window as any).google.accounts.oauth2.initCodeClient({
      client_id: clientId,
      scope: 'email profile openid',
      ux_mode: 'popup',
      redirect_uri: redirectUri,
      state: 'STATE_STRING',
      callback: (response: any) => {
        console.log('Callback do Google recebido:', response);
        if (response.code) {
          console.log('Código de autorização obtido:', response.code);
          console.log('Enviando POST para o backend:', 'https://marketplace-gnq2.onrender.com/api/auth/google/callback');
          this.http
            .post<{ token: string }>('https://marketplace-gnq2.onrender.com/api/auth/google/callback', { code: response.code })
            .subscribe({
              next: (response) => {
                console.log('Resposta do backend recebida:', response);
                console.log('Token JWT obtido:', response.token);
                localStorage.setItem('auth_token', response.token);
                console.log('Token salvo no localStorage, redirecionando para /');
                this.router.navigate(['']);
              },
              error: (err) => {
                this.errorMessage = 'Erro ao fazer login com Google.';
                console.error('Erro na requisição ao backend:', err);
                console.log('Detalhes do erro:', {
                  status: err.status,
                  statusText: err.statusText,
                  url: err.url,
                  message: err.message
                });
              },
            });
        } else {
          this.errorMessage = 'Erro ao obter código de autorização.';
          console.error('Erro na resposta do Google (sem código):', response);
          console.log('Detalhes da resposta:', response);
        }
      },
    });

    console.log('Solicitando código de autorização ao Google');
    client.requestCode();
  }
}
