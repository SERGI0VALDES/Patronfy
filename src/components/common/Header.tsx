import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Importa si ya usas esta librería
import Icon from 'react-native-vector-icons/Ionicons'; 

// 1. Definición de la Interfaz (Props)
// Define los tipos de datos que este componente puede recibir.
interface HeaderProps {
  /** El texto principal que se mostrará en el centro del encabezado (obligatorio). */
  title: string;
  
  /** Función a ejecutar cuando se presiona el botón 'Volver' (opcional). */
  onBackPress?: () => void; 
  
  /** Indica si el botón de 'Volver' debe ser visible (opcional). */
  showBackButton?: boolean;
}

// 2. Definición del Componente Funcional (React.FC<Interface>)
const Header: React.FC<HeaderProps> = ({ title, onBackPress, showBackButton = false }) => {
  return (
    // SafeAreaView asegura que el contenido no se oculte detrás de la barra de estado/notch.
    // Usamos el padding superior para manejar la barra de estado en Android.
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        
        {/* Lado Izquierdo: Botón de Volver */}
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBackPress}
            disabled={!onBackPress} // Deshabilita si no se pasó ninguna función
          >
            <Icon name="arrow-back" size={24} color="#FFF" /> 
          </TouchableOpacity>
        )}
        
        {/* Centro: Título */}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        
        {/* Espacio vacío para centrar el título si hay un botón de volver */}
        <View style={styles.spacer} /> 

      </View>
    </SafeAreaView>
  );
};

// 3. Estilos
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0A0A0A', // Fondo oscuro del header
    // Nota: Si usas Expo o React Native CLI moderno, 
    // a menudo el SafeAreaView ya maneja el padding.
  },
  headerContainer: {
    height: 55, // Altura estándar de un header
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    // Ajuste para el shadow o elevación en Android
    ...Platform.select({
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    // Para que ocupe el mismo espacio que el 'spacer'
    paddingRight: 15,
  },
  backText: {
    color: '#007AFF', // Tono azul para interactividad
    fontSize: 16,
  },
  title: {
    flex: 1, // Permite que el título ocupe el espacio central
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    // El marginLeft negativo ayuda a centrar si solo hay título
    marginLeft: -40, 
  },
  spacer: {
    width: 40, // Espacio para que el título se centre si el botón no está
  },
});

export default Header;