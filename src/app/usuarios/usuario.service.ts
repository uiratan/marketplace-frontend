import { Injectable } from '@angular/core';
import { Usuario, NovoUsuarioRequest, AtualizarUsuarioRequest } from '../models/usuario.model';
import { BaseCrudService, BasePage } from '../services/basecrud.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends BaseCrudService<Usuario, NovoUsuarioRequest, AtualizarUsuarioRequest> {
  constructor() {
    super('https://marketplace-gnq2.onrender.com/usuarios');
  }
}
