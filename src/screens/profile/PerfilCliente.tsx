// screens/profile/PerfilCliente.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { guardarCliente, obtenerClientes, actualizarCliente } from '../../services/clientes/clientesService';
import { StackNavigationProp } from '@react-navigation/stack';
import { ListaParametrosNavegacion } from '../../types/navigation';
import { BASE_URL } from '../../api/apiConfig';

type PerfilClienteRouteProp = RouteProp<ListaParametrosNavegacion, 'PerfilCliente'>;
type PerfilClienteNavProp = StackNavigationProp<ListaParametrosNavegacion, 'PerfilCliente'>;

const PerfilCliente: React.FC = () => {
  const route = useRoute<PerfilClienteRouteProp>();
  const navigation = useNavigation<PerfilClienteNavProp>();

  // Obtenemos los parámetros que vienen de la navegación
  const { photoUri, clienteId } = route.params || {}; 

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [existingPhoto, setExistingPhoto] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // EFECTO: Si hay un clienteId, buscamos sus datos para rellenar el formulario
  useEffect(() => {
    if (clienteId) {
      cargarDatosCliente();
    }
  }, [clienteId]);

  const cargarDatosCliente = async () => {
    setIsLoading(true);
    try {
      const todos = await obtenerClientes();
      const cliente = todos.find((c: any) => c.id === clienteId);
      
      if (cliente) {
        setClientName(cliente.nombre);
        setClientEmail(cliente.correo);
        setClientPhone(cliente.telefono);
        setClientNotes(cliente.notas || '');
        if (cliente.photoUri) {
          // Construimos la URL completa para mostrar la foto que ya tiene el cliente
          setExistingPhoto(`${BASE_URL}${cliente.photoUri}`);
        }
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo obtener la información del cliente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveClient = async () => {
  if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
    Alert.alert('Atención', 'Nombre, Correo y Teléfono son obligatorios.');
    return;
  }

  setIsSaving(true);
  try {
    const datos = {
      nombre: clientName.trim(),
      correo: clientEmail.trim().toLowerCase(),
      telefono: clientPhone.trim(),
      notas: clientNotes.trim(),
    };

    let response;

    if (clienteId) {
      // --- MODO EDICIÓN ---
      console.log("Actualizando cliente existente...");
      response = await actualizarCliente(clienteId, datos, photoUri);
    } else {
      // --- MODO CREACIÓN ---
      console.log("Creando nuevo cliente...");
      response = await guardarCliente(datos, photoUri || '');
    }

    if (response.status === 200 || response.status === 201) {
      Alert.alert("¡Éxito!", clienteId ? "Cliente actualizado" : "Cliente registrado");
      navigation.goBack();
    }
  } catch (error: any) {
    const msg = error.response?.data?.message || "Error al procesar la solicitud";
    Alert.alert("Error", msg);
  } finally {
    setIsSaving(false);
  }
};

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{clienteId ? 'Editar Perfil' : 'Nuevo Cliente'}</Text>
        
        <View style={styles.photoSection}>
          <TouchableOpacity 
            style={styles.photoTarget} 
            onPress={() => navigation.navigate('CameraScreen', { 
              comingFrom: 'PerfilCliente', 
              clienteId: clienteId
             })}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.clientPhoto} />
            ) : existingPhoto ? (
              <Image source={{ uri: existingPhoto }} style={styles.clientPhoto} />
            ) : (
              <View style={styles.placeholderPhoto}>
                <Text style={styles.placeholderText}>+ Foto</Text> 
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.form}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput style={styles.input} value={clientName} onChangeText={setClientName} placeholder="Ej: Juan Pérez" placeholderTextColor="#666" />

          <Text style={styles.label}>Correo</Text>
          <TextInput style={styles.input} value={clientEmail} onChangeText={setClientEmail} keyboardType="email-address" autoCapitalize="none" placeholder="correo@ejemplo.com" placeholderTextColor="#666" />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput style={styles.input} value={clientPhone} onChangeText={setClientPhone} keyboardType="phone-pad" placeholder="000 000 0000" placeholderTextColor="#666" />

          <Text style={styles.label}>Notas adicionales</Text>
          <TextInput style={[styles.input, styles.textArea]} value={clientNotes} onChangeText={setClientNotes} multiline={true} numberOfLines={4} textAlignVertical="top" placeholder="Medidas de cintura, largo, etc..." placeholderTextColor="#666" />

          <TouchableOpacity 
            style={[styles.saveButton, isSaving && { backgroundColor: '#444' }]} 
            onPress={handleSaveClient}
            disabled={isSaving}
          >
            {isSaving ? <ActivityIndicator color="#FFF"/> : <Text style={styles.saveButtonText}>{clienteId ? 'Guardar Cambios' : 'Registrar Cliente'}</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  content: { padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 25, textAlign: 'center' },
  photoSection: { alignItems: 'center', marginBottom: 25 },
  photoTarget: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 2, borderColor: '#007AFF' },
  clientPhoto: { width: '100%', height: '100%' },
  placeholderPhoto: { alignItems: 'center' },
  placeholderText: { color: '#007AFF', fontWeight: 'bold', fontSize: 16 },
  form: { marginTop: 5 },
  label: { color: '#888', marginBottom: 8, fontSize: 14, fontWeight: '600' },
  input: { backgroundColor: '#2a2a2a', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, fontSize: 16 },
  textArea: { height: 100 },
  saveButton: { backgroundColor: '#007AFF', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default PerfilCliente;