import { Component, Inject } from '@angular/core';
import { CrudFormComponent, CrudFormData } from './crud-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorComponent } from '../http-error/http-error.component';

@Component({
  selector: 'app-crud-create-form',
  standalone: true,
  imports: [
    MatDialogModule,         // Para mat-dialog-title, mat-dialog-content, mat-dialog-actions
    MatFormFieldModule,      // Para mat-form-field, mat-label, mat-error
    MatInputModule,          // Para matInput
    MatButtonModule,         // Para mat-button, mat-raised-button
    ReactiveFormsModule,     // Para formGroup e formControlName
    MatSnackBarModule,       // Para snackBar
    HttpErrorComponent,      // Componente standalone
  ],
  templateUrl: './crud-form.component.html',
})
export class CrudCreateFormComponent<TCreate> extends CrudFormComponent<TCreate> {
  constructor(
    dialogRef: MatDialogRef<CrudCreateFormComponent<TCreate>>,
    @Inject(MAT_DIALOG_DATA) data: CrudFormData<TCreate>
  ) {
    super(dialogRef, data);
    this.title = 'Novo Usuário';
  }

  protected initializeDataDTO(): void {
    this.dataDTO = (this.data.formData || {}) as TCreate;
  }

  protected saveDTO(dto: TCreate): void {
    this.data.service.criar(dto).subscribe({
      next: () => {
        this.showSuccess('Registro criado com sucesso!');
        this.save.emit(dto);
        this.closeDialog(true);
      },
      error: (err: HttpErrorResponse) => {
        this.error = err;
      },
    });
  }
}
