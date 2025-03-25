import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';

export interface BasePage<T> {
  _embedded: {
    [key: string]: T[];
  };
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export abstract class BaseCrudService<T, TCreate = T, TUpdate = T> {
  protected readonly apiUrl: string;
  private http = inject(HttpClient);

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  buscarTodos(): Observable<BasePage<T>> {
    return this.http.get<BasePage<T>>(this.apiUrl).pipe(catchError(this.handleError));
  }

  buscarTodosPaginado(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDirection: 'ASC' | 'DESC' = 'ASC'
  ): Observable<BasePage<T>> {
    if (page < 0) throw new Error('O número da página não pode ser negativo.');
    if (size <= 0) throw new Error('O tamanho da página deve ser maior que zero.');
    if (!['ASC', 'DESC'].includes(sortDirection)) throw new Error("A direção de ordenação deve ser 'ASC' ou 'DESC'.");

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection.toUpperCase());

    return this.http.get<BasePage<T>>(this.apiUrl, { params }).pipe(catchError(this.handleError));
  }

  buscarPorId(id: number): Observable<T> {
    if (id <= 0) throw new Error('O ID deve ser maior que zero.');
    return this.http.get<T>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  criar(data: TCreate): Observable<void> {
    return this.http.post<void>(this.apiUrl, data).pipe(catchError(this.handleError));
  }

  atualizar(id: number, data: TUpdate): Observable<void> {
    if (id <= 0) throw new Error('O ID deve ser maior que zero.');
    return this.http.put<void>(`${this.apiUrl}/${id}`, data).pipe(catchError(this.handleError));
  }

  excluir(id: number): Observable<void> {
    if (id <= 0) throw new Error('O ID deve ser maior que zero.');
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro do cliente: ${error.error.message}`;
    } else {
      errorMessage = `Erro do servidor: Código ${error.status}, Mensagem: ${error.message}`;
      if (error.error?.message) errorMessage += `, Detalhe: ${error.error.message}`;
    }
    return throwError(() => error);
  }
}
