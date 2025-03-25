export interface FieldConfig {
  name: string; // Nome do campo (usado para binding com o DTO)
  label: string; // Rótulo a ser exibido no formulário
  type: 'text' | 'password' | 'number'; // Tipo do input
  required: boolean; // Se o campo é obrigatório
  placeholder?: string; // Placeholder opcional
}
