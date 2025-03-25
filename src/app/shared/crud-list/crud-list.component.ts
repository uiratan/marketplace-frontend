import { Component, computed, signal, inject, effect, Input, Type } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, switchMap, debounceTime, catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { BaseCrudService } from '../../services/basecrud.service';
import { FieldConfig } from '../crud-form/field-config.interface';

@Component({
  selector: 'app-crud-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './crud-list.component.html',
})
export abstract class CrudListComponent<T extends object, TCreate = T, TUpdate = T> {
  @Input({ required: true }) service!: BaseCrudService<T, TCreate, TUpdate>;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) displayedColumns!: string[];
  @Input({ required: true }) embeddedKey!: string;
  @Input({ required: true }) formComponent!: Type<any>;
  @Input({ required: true }) mapToFormData!: (item: T) => TUpdate & { id: number };

  protected dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  dataSource = new MatTableDataSource<T>([]);

  pageIndex = signal(0);
  pageSize = signal(10);
  sortBy = signal('id');
  sortDirection = signal<'ASC' | 'DESC'>('ASC');
  totalElements = signal(0);
  filterValue = signal('');
  error = signal<HttpErrorResponse | null>(null);

  private reload$ = new BehaviorSubject<void>(undefined);

  private pageObservable = this.reload$.pipe(
    debounceTime(100),
    switchMap(() =>
      this.service.buscarTodosPaginado(
        this.pageIndex(),
        this.pageSize(),
        this.sortBy(),
        this.sortDirection()
      ).pipe(
        catchError((err: HttpErrorResponse) => {
          this.error.set(err);
          return of(null);
        })
      )
    )
  );

  private pageSignal = toSignal(this.pageObservable, { initialValue: null });
  private tableData = computed(() => this.pageSignal());

  getDisplayedColumnsWithoutLast(): string[] {
    return this.displayedColumns.slice(0, -1);
  }

  constructor() {
    this.dataSource.filterPredicate = (data: T, filter: string) => {
      const filterText = filter.trim().toLowerCase();
      const columnsToFilter = this.getDisplayedColumnsWithoutLast();

      for (let column of columnsToFilter) {
        if (column in data) {
          const value = (data as any)[column];
          if (value && value.toString().toLowerCase().includes(filterText)) {
            return true;
          }
        }
      }
      return false;
    };

    effect(() => {
      const page = this.tableData();
      if (page && page._embedded && page._embedded[this.embeddedKey] && page.page) {
        this.dataSource.data = page._embedded[this.embeddedKey];
        this.totalElements.set(page.page.totalElements);
      } else if (page === null) {
        console.log('Aguardando dados (page é null)');
      } else {
        this.error.set(
          new HttpErrorResponse({
            status: 500,
            error: { message: 'Resposta inválida do servidor.' },
          })
        );
      }
    });

    this.carregarDados();
  }

  protected carregarDados(): void {
    this.error.set(null);
    this.reload$.next();
  }

  applyFilter(filterValue: string): void {
    this.filterValue.set(filterValue.trim().toLowerCase());
    this.dataSource.filter = this.filterValue();
    this.pageIndex.set(0);
    this.reload$.next();
  }

  onFilterKeyup(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.applyFilter(input.value);
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.reload$.next();
  }

  onSortChange(event: Sort): void {
    this.sortBy.set(event.active);
    const direction = event.direction === 'asc' ? 'ASC' : event.direction === 'desc' ? 'DESC' : 'ASC';
    this.sortDirection.set(direction);
    this.reload$.next();
  }

  abrirFormulario(item?: T, fields?: FieldConfig[]): void {
    this.openFormDialog(item, fields);
  }

  excluir(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: `Tem certeza que deseja excluir este ${this.title.toLowerCase()}?` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.excluir(id).subscribe({
          next: () => {
            this.carregarDados();
            this.snackBar.open('Registro excluído com sucesso!', 'Fechar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['custom-snackbar'],
            });
          },
          error: (err: HttpErrorResponse) => {
            this.error.set(err);
          },
        });
      }
    });
  }

  protected abstract openFormDialog(item?: T, fields?: FieldConfig[]): void;
}
