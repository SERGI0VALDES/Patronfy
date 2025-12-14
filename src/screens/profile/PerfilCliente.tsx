// screens/profile/PerfilCliente.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';

type PerfilClienteRouteProp = RouteProp<RootStackParamList, 'PerfilCliente'>;

const PerfilCliente: React.FC = () => {
  const route = useRoute<PerfilClienteRouteProp>();
  const { photoUri } = route.params || {}; // Recibir la foto 

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  const handleSaveClient = () => {
    // Lógica para guardar el cliente con la foto
    console.log('Guardando cliente:', { 
      clientName, 
      clientEmail, 
      clientPhone, 
      clientNotes,
      photoUri 
    });
  };

  return (
    <View style={styles.container}>
      
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Información del Cliente</Text>
        
        {/* Mostrar foto si existe */}
        {photoUri && (
          <View style={styles.photoContainer}>
            <Text style={styles.photoTitle}>Foto del Cliente</Text>
            <Image source={{ uri: photoUri }} style={styles.clientPhoto} />
          </View>
        )}
        
        <View style={styles.form}>
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            value={clientName}
            onChangeText={setClientName}
            placeholder="Ingresa el nombre del cliente"
            placeholderTextColor="#666666"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={clientEmail}
            onChangeText={setClientEmail}
            placeholder="email@ejemplo.com"
            placeholderTextColor="#666666"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={clientPhone}
            onChangeText={setClientPhone}
            placeholder="+52 123 456 7890"
            placeholderTextColor="#666666"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Notas adicionales</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={clientNotes}
            onChangeText={setClientNotes}
            placeholder="Notas sobre medidas especiales, preferencias, etc."
            placeholderTextColor="#666666"
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveClient}>
            <Text style={styles.saveButtonText}>Guardar Cliente</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  photoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  photoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  clientPhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PerfilCliente;