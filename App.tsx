// App.tsx - Asegúrate de tener todas las pantallas
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ListaParametrosNavegacion} from './src/types/navigation';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import HomeScreen from './src/screens/HomeScreen';
import Biblioteca from './src/screens/Biblioteca';
import MedidaEntrada from './src/screens/MedidaEntrada';
import SeleccionEntrada from './src/screens/SeleccionEntrada';
import SeleccionPrendas from './src/screens/SeleccionPrendas';
import VisorPatrones from './src/screens/VisorPatrones';
import PerfilCliente from './src/screens/profile/PerfilCliente';
import LoginRegister from './src/screens/auth/loginRegister';
import ErrorBoundary from './src/components/ErrorBoundary';
import CameraScreen from './src/screens/functions/CameraScreen';
import MisClientes from './src/screens/clientes/misClientes';
import LogoutScreen from './src/screens/auth/LogoutScreen';

// Importamos el contexto de autenticación

const Stack = createStackNavigator<ListaParametrosNavegacion>();

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

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
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1a1a' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {user ? (
          // --- GRUPO DE PANTALLAS PROTEGIDAS ---
          // Si el usuario existe, estas pantallas se "montan". 
          // Al cerrar sesión, desaparecen del mapa y React Navigation te saca de aquí.
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
            <Stack.Screen name="Biblioteca" component={Biblioteca} options={{ title: 'Biblioteca' }} />
            <Stack.Screen name="MedidaEntrada" component={MedidaEntrada} options={{ title: 'Medidas' }} />
            <Stack.Screen name="SeleccionPrendas" component={SeleccionPrendas} options={{ title: 'Seleccionar Prenda' }} />
            <Stack.Screen name="VisorPatrones" component={VisorPatrones} options={{ title: 'Patrón Generado' }} />
            <Stack.Screen name="PerfilCliente" component={PerfilCliente} options={{ title: 'Cliente' }} />
            <Stack.Screen name='SeleccionEntrada' component={SeleccionEntrada} options={{ title: 'Seleccione algún método'}}/>
            <Stack.Screen name='CameraScreen' component={CameraScreen} 
                                              options={{title:'Tome una foto!'}}/>
            <Stack.Screen name='MisClientes' component={MisClientes} 
                                              options={{title:'Mis clientes'}}/>
            <Stack.Screen 
              name="LogoutAnimation" 
              component={LogoutScreen} 
              options={{ 
                headerShown: false, 
                // Si 'animationEnabled' falla, intenta 'animation: "none"'
                // O fuerza el tipo así:
                ...({ animationEnabled: false } as any) 
              }} 
            />
          </>
        ) : (
          // --- GRUPO DE PANTALLAS PÚBLICAS ---
          // Si NO hay usuario, la ÚNICA pantalla que existe es el Login.
          /*<Stack.Screen 
            name="LoginRegister" 
            component={LoginRegister} 
            options={{ headerShown: false }} 
          />*/
          <Stack.Screen 
            name="LoginRegister" 
            component={LoginRegister} 
            options={{ headerShown: false }} 
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// El componente principal solo envuelve con el Provider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <AppContent/>
      </ErrorBoundary>
    </AuthProvider>
  );
};

export default App;