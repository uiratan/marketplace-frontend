import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://marketplace-gnq2.onrender.com/api/auth'; // Ajuste para o URL do seu backend
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<string> {
    return this.http.post(this.apiUrl, { email, password }, { responseType: 'text' }).pipe(
      tap(token => {
        if (token) {
          localStorage.setItem(this.tokenKey, token); // Armazena o token JWT
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey); // Verifica se o token existe
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
