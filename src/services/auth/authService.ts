import api from '../../api/axios'; // Importamos la configuración de Axios
import { Usuario, AuthResponse } from '../../types/auth';

// 1. Iniciar Sesión
export const login = async (correo: string, clave: string): Promise<AuthResponse> => {
  // Con Axios ya no necesitas JSON.stringify ni poner la URL completa
  const { data } = await api.post<AuthResponse>('/auth/login', { correo, clave });
  
  // Guardamos los datos para que persistan al recargar
  localStorage.setItem('token', data.access_token);
  localStorage.setItem('usuario', JSON.stringify(data.usuario));
  
  return data;
};

// 2. Guardar Patrón
export const guardarPatron = async (datosPatron: any) => {
  // ¡MAGIA! Ya no necesitas sacar el token manualmente ni poner Headers.
  // El interceptor que pusimos en axios.ts lo hace por ti en cada petición.
  const { data } = await api.post('/patrones/guardar', datosPatron);
  return data;
};

// 3. Cerrar Sesión
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '/login'; // Opcional: redirigir
};