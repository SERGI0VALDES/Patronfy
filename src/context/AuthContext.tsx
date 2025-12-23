import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios';
import { Usuario, AuthResponse } from '../types/auth';

interface AuthContextType {
  user: Usuario | null;
  login: (correo: string, clave: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean; // Para saber cuando estamos leyendo el disco
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario al iniciar la App
  useEffect(() => {
    const loadStorageData = async () => {

      // await AsyncStorage.clear();

      try {
        const savedUser = await AsyncStorage.getItem('usuario');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error("Error cargando datos", e);
      } finally {
        setLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const login = async (correo: string, clave: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { correo, clave });
    
    // Guardar en el celular (AsyncStorage)
    await AsyncStorage.setItem('token', data.access_token);
    await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario));
    
    setUser(data.usuario);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('usuario');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);