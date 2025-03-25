import { Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UsuarioService } from './usuario.service';
import { AtualizarUsuarioRequest, NovoUsuarioRequest, Usuario } from '../models/usuario.model';
import { ComponentType } from '@angular/cdk/portal';
import { CrudListComponent } from '../shared/crud-list/crud-list.component';
import { FieldConfig } from '../shared/crud-form/field-config.interface';
import { CrudCreateFormComponent } from '../shared/crud-form/crud-create-form.component';
import { CrudEditFormComponent } from '../shared/crud-form/crud-edit-form.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [
    MatDialogModule,
    MatSnackBarModule,
    // Não precisa importar os módulos do template aqui, pois o CrudListComponent já os tem
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
  templateUrl: '../shared/crud-list/crud-list.component.html', // Herda o template do pai
  providers: [{ provide: UsuarioService, useClass: UsuarioService }],
})
export class ListaUsuariosComponent extends CrudListComponent<Usuario, NovoUsuarioRequest, AtualizarUsuarioRequest> {
  private usuarioService = inject(UsuarioService);

  colunasTabela = ['id', 'login', 'nome', 'createdAt', 'updatedAt', 'acoes'];

  private createFields: FieldConfig[] = [
    { name: 'login', label: 'Login', type: 'text', required: true },
    { name: 'senha', label: 'Senha', type: 'password', required: true },
  ];

  private editFields: FieldConfig[] = [
    { name: 'login', label: 'Login', type: 'text', required: true },
    { name: 'nome', label: 'Nome', type: 'text', required: false },
    { name: 'senha', label: 'Senha', type: 'password', required: false },
  ];

  constructor() {
    super();
    this.service = this.usuarioService;
    this.title = 'Cadastro de Usuários';
    this.displayedColumns = this.colunasTabela;
    this.embeddedKey = 'usuarioList';
    this.formComponent = CrudEditFormComponent;
    this.mapToFormData = (usuario: Usuario): AtualizarUsuarioRequest & { id: number } => {
      const formData: AtualizarUsuarioRequest = {
        login: usuario.login,
        nome: usuario.nome || '',
        senha: '',
      };
      return { ...formData, id: usuario.id };
    };
  }

  protected override openFormDialog(item?: Usuario, fields?: FieldConfig[]): void {
    const isEditMode = !!item;
    const selectedFields = fields || (isEditMode ? this.editFields : this.createFields);
    const component = isEditMode ? CrudEditFormComponent : CrudCreateFormComponent;

    const dialogRef = this.dialog.open(component as ComponentType<any>, {
      width: '400px',
      data: {
        formData: item ? this.mapToFormData(item) : null,
        service: this.service,
        fields: selectedFields,
      },
      panelClass: 'custom-dialog-container',
      disableClose: true,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.carregarDados();
      }
    });
  }
}
