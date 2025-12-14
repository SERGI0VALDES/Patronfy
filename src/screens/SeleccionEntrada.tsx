// screens/SeleccionEntrada.tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


type RootStackParamList = {
  Home: undefined;
  SeleccionEntrada: undefined;
  MedidaEntrada: undefined;
  CameraScreen: undefined; // 
  PerfilCliente: undefined;
};

type SeleccionEntradaNavigationProp = StackNavigationProp<RootStackParamList, 'SeleccionEntrada'>;

const SeleccionEntrada: React.FC = () => {
  const navigation = useNavigation<SeleccionEntradaNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.content}>
        <Text style={styles.title}>¿Cómo quieres ingresar los datos?</Text>
        <Text style={styles.subtitle}>Elige el método que prefieras</Text>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('MedidaEntrada')}
        >
          <Text style={styles.buttonText}>📏 Ingresar Medidas Manualmente</Text>
          <Text style={styles.buttonDescription}>Ingresa las medidas corporales manualmente</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('CameraScreen')}
        >
          <Text style={styles.buttonText}>📸 Tomar Foto al Cliente</Text>
          <Text style={styles.buttonDescription}>Toma una foto para guardar la referencia visual</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default SeleccionEntrada;