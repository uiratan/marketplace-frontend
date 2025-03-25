import { Component, Output, EventEmitter, OnInit, inject, Inject, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorComponent } from '../http-error/http-error.component';
import { HttpErrorResponse } from '@angular/common/http';
import { FieldConfig } from './field-config.interface';

export interface CrudFormData<T> {
  formData: T | null;
  service: any;
  fields: FieldConfig[];
}

@Component({
  selector: 'app-crud-form',
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
export abstract class CrudFormComponent<T> implements OnInit {
  @Input({ required: true }) title!: string;
  @Output() save = new EventEmitter<T>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  error: HttpErrorResponse | null = null;
  dataDTO!: T;
  fields: FieldConfig[] = [];

  protected fb = new FormBuilder();
  protected snackBar = inject(MatSnackBar);
  protected dialogRef: MatDialogRef<CrudFormComponent<T>>;
  protected data: CrudFormData<T>;

  constructor(
    dialogRef: MatDialogRef<CrudFormComponent<T>>,
    @Inject(MAT_DIALOG_DATA) data: CrudFormData<T>
  ) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.fields = data.fields || [];
    this.initializeDataDTO();
  }

  ngOnInit(): void {
    this.form = this.fb.group({});
    this.fields.forEach(field => {
      const value = (this.dataDTO as any)[field.name] ?? '';
      const control = this.fb.control(
        value,
        field.required ? Validators.required : []
      );
      this.form.addControl(field.name, control);
    });
  }

  onSave(): void {
    if (this.form.valid) {
      const updatedDTO = { ...this.dataDTO, ...this.form.value };
      this.saveDTO(updatedDTO);
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.closeDialog(false);
  }

  protected showSuccess(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar-success'],
    });
  }

  protected closeDialog(result: boolean): void {
    this.dialogRef.close(result);
  }

  protected abstract initializeDataDTO(): void;
  protected abstract saveDTO(dto: T): void;
}
