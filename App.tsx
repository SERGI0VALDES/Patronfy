// App.tsx - Asegúrate de tener todas las pantallas
import React from 'react';
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

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#1a1a1a' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
          <Stack.Screen name="Biblioteca" component={Biblioteca} options={{ title: 'Biblioteca' }} />
          <Stack.Screen name="MedidaEntrada" component={MedidaEntrada} options={{ title: 'Medidas' }} />
          <Stack.Screen name="SeleccionPrendas" component={SeleccionPrendas} options={{ title: 'Seleccionar Prenda' }} />
          <Stack.Screen name="VisorPatrones" component={VisorPatrones} options={{ title: 'Patrón Generado' }} />
          <Stack.Screen name="PerfilCliente" component={PerfilCliente} options={{ title: 'Cliente' }} />
          <Stack.Screen name='SeleccionEntrada' component={SeleccionEntrada} options={{ title: 'Seleccione algun método'}}/>
          <Stack.Screen name="LoginRegister" component={LoginRegister} options={{ headerShown: false }} />
          <Stack.Screen name='CameraScreen' component={CameraScreen} options={{title:'Tome una foto!'}}/>
          
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
};

export default App;