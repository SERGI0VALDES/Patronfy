// screens/clientes/misClientes.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Alert,
  RefreshControl
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Cliente {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  notas?: string;
  fechaRegistro: string;
  totalPatrones: number;
}

const MisClientes: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    conTelefono: 0,
    conEmail: 0
  });

  const CLIENTES_KEY = 'patronfy_clientes';

  // Cargar clientes al montar y cuando la pantalla gana foco
  useEffect(() => {
    if (isFocused) {
      cargarClientes();
    }
  }, [isFocused]);

  // Filtrar clientes cuando cambia la búsqueda
  useEffect(() => {
    filtrarClientes();
  }, [busqueda, clientes]);

  const cargarClientes = async () => {
    try {
      const clientesJson = await AsyncStorage.getItem(CLIENTES_KEY);
      const clientesGuardados: Cliente[] = clientesJson ? JSON.parse(clientesJson) : [];
      
      setClientes(clientesGuardados);
      setClientesFiltrados(clientesGuardados);
      
      // Calcular estadísticas
      calcularEstadisticas(clientesGuardados);
    } catch (error) {
      console.error('Error cargando clientes:', error);
      Alert.alert('Error', 'No se pudieron cargar los clientes');
    }
  };

  const calcularEstadisticas = (listaClientes: Cliente[]) => {
    const total = listaClientes.length;
    const conTelefono = listaClientes.filter(c => c.telefono && c.telefono.trim() !== '').length;
    const conEmail = listaClientes.filter(c => c.email && c.email.trim() !== '').length;
    
    setEstadisticas({ total, conTelefono, conEmail });
  };

  const filtrarClientes = () => {
    if (!busqueda.trim()) {
      setClientesFiltrados(clientes);
      return;
    }
    
    const query = busqueda.toLowerCase();
    const filtrados = clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(query) ||
      cliente.email?.toLowerCase().includes(query) ||
      cliente.telefono?.includes(query)
    );
    
    setClientesFiltrados(filtrados);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarClientes();
    setRefreshing(false);
  };

  const handleEliminarCliente = (clienteId: string, nombre: string) => {
    Alert.alert(
      'Eliminar Cliente',
      `¿Estás seguro de eliminar a ${nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => confirmarEliminacion(clienteId)
        }
      ]
    );
  };

  const confirmarEliminacion = async (clienteId: string) => {
    try {
      const nuevosClientes = clientes.filter(c => c.id !== clienteId);
      await AsyncStorage.setItem(CLIENTES_KEY, JSON.stringify(nuevosClientes));
      setClientes(nuevosClientes);
      Alert.alert('Éxito', 'Cliente eliminado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el cliente');
    }
  };

  const handleVerPerfil = (cliente: Cliente) => {
    // Navegar a pantalla de perfil del cliente con datos
    // navigation.navigate('PerfilCliente', { cliente });
  };

  const handleAgregarCliente = () => {
    navigation.navigate('PerfilCliente');
  };

  const renderClienteCard = (cliente: Cliente) => (
    <TouchableOpacity
      key={cliente.id}
      style={styles.clienteCard}
      onPress={() => handleVerPerfil(cliente)}
      onLongPress={() => handleEliminarCliente(cliente.id, cliente.nombre)}
    >
      <View style={styles.clienteHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {cliente.nombre.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.clienteInfo}>
          <Text style={styles.clienteNombre}>{cliente.nombre}</Text>
          {cliente.email && (
            <Text style={styles.clienteEmail}>{cliente.email}</Text>
          )}
          {cliente.telefono && (
            <Text style={styles.clienteTelefono}>{cliente.telefono}</Text>
          )}
        </View>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>
            {cliente.totalPatrones} {cliente.totalPatrones === 1 ? 'patrón' : 'patrones'}
          </Text>
        </View>
      </View>
      
      <View style={styles.clienteFooter}>
        <Text style={styles.fechaRegistro}>
          Registrado: {new Date(cliente.fechaRegistro).toLocaleDateString()}
        </Text>
        <Text style={styles.longPressHint}>
          Mantén presionado para eliminar
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No hay clientes aún</Text>
      <Text style={styles.emptyStateText}>
        Agrega tu primer cliente para empezar a guardar sus medidas y patrones
      </Text>
      <TouchableOpacity 
        style={styles.emptyStateButton}
        onPress={handleAgregarCliente}
      >
        <Text style={styles.emptyStateButtonText}>Agregar Primer Cliente</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Estadísticas de Clientes */}
      <View style={styles.statsContainer}>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{estadisticas.total}</Text>
          <Text style={styles.statLabel}>Existencia</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{estadisticas.conTelefono}</Text>
          <Text style={styles.statLabel}>Con Teléfono</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{estadisticas.conEmail}</Text>
          <Text style={styles.statLabel}>Con Email</Text>
        </View>

      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar cliente..."
          placeholderTextColor="#666666"
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* Lista de clientes */}
      <ScrollView
        style={styles.clientesList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      >
        {clientesFiltrados.length === 0 ? (
          renderEmptyState()
        ) : (
          clientesFiltrados.map(renderClienteCard)
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#2a2a2a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#2a2a2a',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
  },
  searchInput: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  resultsText: {
    color: '#CCCCCC',
    fontSize: 14,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#1a1a1a',
  },
  clientesList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  clienteCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  clienteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  clienteInfo: {
    flex: 1,
  },
  clienteNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  clienteEmail: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 2,
  },
  clienteTelefono: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  badgeContainer: {
    backgroundColor: '#444444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  clienteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#444444',
    paddingTop: 8,
  },
  fechaRegistro: {
    fontSize: 12,
    color: '#888888',
  },
  longPressHint: {
    fontSize: 10,
    color: '#666666',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyStateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MisClientes;