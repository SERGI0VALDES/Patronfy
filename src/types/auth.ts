export interface Usuario {
  nombre: string;
  correo: string;
}

export interface AuthResponse {
  access_token: string;
  usuario: Usuario;
}