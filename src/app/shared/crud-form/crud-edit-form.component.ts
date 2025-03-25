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
  selector: 'app-crud-edit-form',
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
export class CrudEditFormComponent<TUpdate> extends CrudFormComponent<TUpdate> {
  private id: number | null = null;

  constructor(
    dialogRef: MatDialogRef<CrudEditFormComponent<TUpdate>>,
    @Inject(MAT_DIALOG_DATA) data: CrudFormData<TUpdate & { id: number }>
  ) {
    super(dialogRef, data);
    this.id = (data.formData as TUpdate & { id: number })?.id || null;
    this.title = 'Editar Usuário';
  }

  protected initializeDataDTO(): void {
    const { id, ...formDataWithoutId } = (this.data.formData || {}) as TUpdate & { id: number };
    this.dataDTO = formDataWithoutId as TUpdate;
  }

  protected saveDTO(dto: TUpdate): void {
    if (!this.id) {
      this.error = new HttpErrorResponse({
        status: 400,
        error: { message: 'ID do registro não encontrado para atualização.' },
      });
      return;
    }

    this.data.service.atualizar(this.id, dto).subscribe({
      next: () => {
        this.showSuccess('Registro atualizado com sucesso!');
        this.save.emit(dto);
        this.closeDialog(true);
      },
      error: (err: HttpErrorResponse) => {
        this.error = err;
      },
    });
  }
}
