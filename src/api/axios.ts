import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  // Asegúrate de que esta sea tu IP del adaptador Wi-Fi
  baseURL: 'http://192.168.100.52:3000', 
});

// Interceptor para añadir el token a todas las peticiones
/** Añadimos 'async' porque AsyncStorage es asíncrono
api.interceptors.request.use(async (config) => {
  try {
    // Usamos await para esperar a que el celular lea el "disco duro"
    const token = await AsyncStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error al obtener el token de AsyncStorage", error);
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});*/

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Si el servidor dice que el token no sirve, borramos todo
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('usuario');
      // Aquí podrías disparar una redirección al Login
    }
    return Promise.reject(error);
  }
);

export default api;