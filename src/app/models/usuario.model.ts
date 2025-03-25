export interface Usuario {
  id: number;
  login: string;
  nome?: string;
  senha: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NovoUsuarioRequest {
  login: string;
  senha: string;
}

export interface AtualizarUsuarioRequest {
  login: string;
  nome: string;
  senha: string;
}
