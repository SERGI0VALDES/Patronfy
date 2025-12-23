// App.tsx - Asegúrate de tener todas las pantallas
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import Biblioteca from './src/screens/Biblioteca';
import MedidaEntrada from './src/screens/MedidaEntrada';
import SeleccionEntrada from './src/screens/SeleccionEntrada';
import SeleccionPrendas from './src/screens/SeleccionPrendas';
import VisorPatrones from './src/screens/VisorPatrones';
import PerfilCliente from './src/screens/profile/PerfilCliente';
import LoginRegister from './src/screens/auth/loginRegister';
import { RootStackParamList } from './src/types/navigation';
import ErrorBoundary from './src/components/ErrorBoundary';
import CameraScreen from './src/screens/functions/CameraScreen';

// Importamos el contexto de autenticación
import { AuthProvider, useAuth } from './src/context/AuthContext';


const Stack = createStackNavigator<RootStackParamList>();

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  // Mientras lee el token del disco, mostramos una pantalla de carga
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#1a1a1a' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        // Si el usuario existe, el inicio es Home. Si no, es LoginRegister.
        initialRouteName={user ? "Home" : "LoginRegister"}
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1a1a' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {/* Pantallas públicas */}
        <Stack.Screen name="LoginRegister" component={LoginRegister} options={{ headerShown: false }} />

        {/* Pantallas protegidas (Solo accesibles si estás logueado) */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
        <Stack.Screen name="Biblioteca" component={Biblioteca} options={{ title: 'Biblioteca' }} />
        <Stack.Screen name="MedidaEntrada" component={MedidaEntrada} options={{ title: 'Medidas' }} />
        <Stack.Screen name="SeleccionPrendas" component={SeleccionPrendas} options={{ title: 'Seleccionar Prenda' }} />
        <Stack.Screen name="VisorPatrones" component={VisorPatrones} options={{ title: 'Patrón Generado' }} />
        <Stack.Screen name="PerfilCliente" component={PerfilCliente} options={{ title: 'Cliente' }} />
        <Stack.Screen name='SeleccionEntrada' component={SeleccionEntrada} options={{ title: 'Seleccione algún método'}}/>
        <Stack.Screen name='CameraScreen' component={CameraScreen} options={{title:'Tome una foto!'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// El componente principal solo envuelve con el Provider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AuthProvider>
  );
};

export default App;