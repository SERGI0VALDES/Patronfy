import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useAuth } from '../context/AuthContext'; 
import { RootStackParamList } from '../types/navigation';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  const { user, logout } = useAuth(); 
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <Text style={styles.welcomeTitle}>¡Bienvenido, {user?.nombre || 'a Patronfy'}!</Text>
        <Text style={styles.welcomeSubtitle}>
          Crea patrones de costura personalizados en minutos
        </Text>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('SeleccionEntrada')}
        >
          <Text style={styles.primaryButtonText}>Crear Nuevo Patrón</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Biblioteca')}
        >
          <Text style={styles.secondaryButtonText}>Ver Biblioteca de Patrones</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('MisClientes')}
        >
          <Text style={styles.secondaryButtonText}>Gestión de Clientes</Text>
        </TouchableOpacity>

        
        <TouchableOpacity 
      style={styles.logoutButton}
      onPress={() => navigation.navigate('LogoutAnimation')} // <-- Navegamos a la animación
      activeOpacity={0.6}
    >
      <Text style={styles.logoutButtonText}>Salir de Patronfy</Text>
    </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444444',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
  backgroundColor: '#ffffff',
  borderWidth: 1.5,
  borderColor: '#d1d1d1',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 12,
  elevation: 1,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
},
logoutButtonText: {
  color: '#2c3e50',
  fontSize: 15,
  fontWeight: '500',
},   
});

export default HomeScreen;