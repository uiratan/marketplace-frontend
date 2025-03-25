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
    const redirectUri = 'postmessage'; // Alinhar com o backend
    const client = (window as any).google.accounts.oauth2.initCodeClient({
      client_id: environment.googleClientId,
      scope: 'email profile openid',
      ux_mode: 'popup',
      redirect_uri: redirectUri,
      state: 'STATE_STRING',
      callback: (response: any) => {
        if (response.code) {
          this.http
            .post<{ token: string }>('https://marketplace-gnq2.onrender.com/api/auth/google/callback', { code: response.code }) // Tipar o Observable
            .subscribe({
              next: (response) => { // O tipo é inferido automaticamente de post<{ token: string }>
                localStorage.setItem('auth_token', response.token);
                this.router.navigate(['']);
              },
              error: (err) => {
                this.errorMessage = 'Erro ao fazer login com Google.';
                console.error('Erro na requisição ao backend:', err);
              },
            });
        } else {
          this.errorMessage = 'Erro ao obter código de autorização.';
          console.error('Erro na resposta do Google:', response);
        }
      },
    });
    client.requestCode();
  }
}
