// src/config/apiConfig.ts

// Cambiar en caso de ejecutar en otro red
export const BASE_URL = 'http://192.168.1.74:3000'; 

export const API_ROUTES = {
  clientes: `${BASE_URL}/clientes`,
  uploads: `${BASE_URL}`, // Para las imágenes
};