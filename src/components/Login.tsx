import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(correo, clave);
      alert('¡Bienvenido de nuevo!');
    } catch (error) {
      alert('Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="Email" />
      <input type="password" value={clave} onChange={e => setClave(e.target.value)} placeholder="Password" />
      <button type="submit">Entrar</button>
    </form>
  );
};