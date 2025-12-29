import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext'; // Asegúrate de que la ruta sea correcta
import api from '../../api/axios'; // Para el registro directo
import { ListaParametrosNavegacion } from '../../types/navigation';

// NetInfor para verificar la conexión de internet
import NetInfo from '@react-native-community/netinfo';

type LoginRegisterNavigationProp = StackNavigationProp<ListaParametrosNavegacion>;

const LoginRegister: React.FC = () => {
  // Estado para la conexión a internet
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  const navigation = useNavigation<LoginRegisterNavigationProp>();
  const { login } = useAuth(); // Usamos la función de nuestro contexto

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState(''); // Añadido para el registro

  const handleAuth = async () => {
    // 1. Validaciones básicas
    if (!email || !password) {
      Alert.alert('Error', 'Por favor llena todos los campos');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        
        await login(email.trim(), password.trim()); 
        
      } else {
        // --- LOGICA DE REGISTRO ---
        if (password !== confirmPassword) {
          Alert.alert('Error', 'Las contraseñas no coinciden');
          setLoading(false);
          return;
        }

        await api.post('/usuarios/registro', {
          nombre: nombre || 'Usuario de Patronfy',
          correo: email.trim(),
          clave: password
        });

        Alert.alert('¡Éxito!', 'Cuenta creada. Ahora puedes iniciar sesión.');
        setIsLogin(true);
      }
    } catch (error: any) {
      console.log("--- ERROR EN AUTH ---");
      const mensaje = error.response?.data?.message || 'Error de autenticación';
      Alert.alert('Error', Array.isArray(mensaje) ? mensaje.join(', ') : mensaje);
    } finally {
      setLoading(false);
    }
    
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  // Monitorear el estado de la conexión a internet
  useEffect(() => {
    // Suscribirse a los cambios de conexión
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe(); // Limpiar al salir
  }, []);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.statusBadge}>
        <View style={[
          styles.dot, 
          { backgroundColor: isConnected ? '#4CD964' : '#FF3B30' } // Verde si hay, Rojo si no
        ]} />
        <Text style={styles.statusText}>
          {isConnected ? 'Conectado' : 'Desconectado'}
        </Text>
      </View>

      <View style={styles.content}>

        <Text style={styles.title}>
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </Text>
        <Text style={styles.subtitle}>
          {isLogin ? 'Bienvenido de vuelta a Patronfy' : 'Únete a la comunidad de Patronfy'}
        </Text>

        <View style={styles.form}>
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor="#666666"
              value={nombre}
              onChangeText={setNombre}
              autoCapitalize="words"
            />
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#666666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Confirmar Contraseña"
              placeholderTextColor="#666666"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          )}

          <TouchableOpacity 
            style={[styles.authButton, loading && { backgroundColor: '#444' }]} 
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.authButtonText}>
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
            <Text style={styles.toggleButtonText}>
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 50, // Ajusta según tu diseño
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 8,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
  },
  authButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  toggleButtonText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

export default LoginRegister;