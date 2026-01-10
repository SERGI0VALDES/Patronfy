import api from '../../api/axios';

// 1. Obtener todos los clientes
export const obtenerClientes = async () => {
  const response = await api.get('/clientes');
  return response.data; // Retorna el array de clientes de Supabase
};

export const guardarCliente = async (datos: any, photoUri?: string) => {
  // 1. Preparamos el FormData (necesario para enviar archivos)
  const formData = new FormData();

  // 2. Agregamos los textos (nombre, correo, etc.)
  formData.append('nombre', datos.nombre);
  formData.append('correo', datos.correo);
  formData.append('telefono', datos.telefono);
  formData.append('notas', datos.notas);

  // 3. Agregamos la foto si existe
  if (photoUri) {
    const filename = photoUri.split('/').pop() || 'cliente.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    formData.append('foto', {
      uri: photoUri,
      name: filename,
      type: type,
    } as any);
  }

  // 4. Enviamos usando tu instancia de axios personalizada
  // No necesitas pasar el token aquí, el interceptor ya lo hace por ti.
  return await api.post('/clientes', formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

// 3. Eliminar un cliente por ID
export const eliminarCliente = async (id: string) => {
  // axios.delete enviará la petición a http://tu-ip:3000/clientes/:id
  const response = await api.delete(`/clientes/${id}`);
  return response.data;
};

export const actualizarCliente = async (id: string, datos: any, photoUri?: string) => {
  const formData = new FormData();
  formData.append('nombre', datos.nombre);
  formData.append('correo', datos.correo);
  formData.append('telefono', datos.telefono);
  formData.append('notas', datos.notas);

  if (photoUri && !photoUri.startsWith('http')) {
    const filename = photoUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('foto', {
      uri: photoUri,
      name: filename,
      type,
    } as any);
  }

  // Usamos PATCH y pasamos el ID en la URL
  return await api.patch(`/clientes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};