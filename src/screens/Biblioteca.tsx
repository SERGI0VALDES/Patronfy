import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  TextInput, 
  RefreshControl,
  ActivityIndicator 
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ListaParametrosNavegacion, PatronGuardado } from '../types/navigation'; 
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import api from '../api/axios';

type BibliotecaNavigationProp = StackNavigationProp<ListaParametrosNavegacion, 'Biblioteca'>;

const CACHE_KEY = '@biblioteca_cache';

const Biblioteca: React.FC = () => {
  const navigation = useNavigation<BibliotecaNavigationProp>();
  const isFocused = useIsFocused();
  
  const [patrones, setPatrones] = useState<PatronGuardado[]>([]);
  const [filteredPatterns, setFilteredPatterns] = useState<PatronGuardado[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<'Todos' | 'Dama' | 'Caballero'>('Todos');
  
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (isFocused) loadPatterns();
  }, [isFocused]);

  useEffect(() => {
    filterPatterns();
  }, [patrones, searchQuery, categoriaActiva]);

  // Mapeo para normalizar datos del servidor o locales
  const mapResponseToPatterns = (data: any[]): PatronGuardado[] => {
    return data.map((p: any) => ({
      id: p.id || p.id_local,
      nombre: p.nombre,
      categoria: p.categoria || (p.tipoPrenda?.includes('hombre') ? 'Caballero' : 'Dama'),
      tipoPrenda: p.tipoPrenda || 'prenda',
      nombreCliente: p.nombreCliente || 'Sin asignar',
      fechaCreacion: p.fechaCreacion || p.fecha_creacion,
      piezas: p.piezas || [],
      instrucciones: p.instrucciones || [],
      totalTela: p.totalTela || 0,
      dificultad: p.dificultad || 'Media',
      medidas: p.medidas,
      estiloPrenda: p.estiloPrenda || p.medidas?.estilo || { tipoCuello: 'redondo', tipoManga: 'corta' }
    }));
  };

  const loadPatterns = async () => {
    setIsLoading(true);
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      try {
        const response = await api.get('/patrones');
        const mapeados = mapResponseToPatterns(response.data);
        setPatrones(mapeados);
        setIsOffline(false);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(mapeados));
      } catch (error) {
        loadLocalCache();
      }
    } else {
      loadLocalCache();
    }
    setIsLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPatterns();
    setRefreshing(false);
  }, []);

  const loadLocalCache = async () => {
    setIsOffline(true);
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    if (cachedData) setPatrones(JSON.parse(cachedData));
  };

  const filterPatterns = () => {
    let filtered = patrones;
    if (categoriaActiva !== 'Todos') filtered = filtered.filter(p => p.categoria === categoriaActiva);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.nombre.toLowerCase().includes(q) || p.nombreCliente?.toLowerCase().includes(q));
    }
    setFilteredPatterns(filtered);
  };

  const handleDelete = (id: string, name: string) => {
    if (isOffline) {
      Alert.alert("Modo Offline", "Debes estar conectado para eliminar patrones de la nube.");
      return;
    }
    Alert.alert('Eliminar Patrón', `¿Estás seguro de borrar "${name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
          setPatrones(prev => prev.filter(p => p.id !== id));
          try { await api.delete(`/patrones/${id}`); } 
          catch (e) { Alert.alert('Error', 'No se pudo eliminar el archivo'); loadPatterns(); }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      {isOffline && (
        <View style={styles.offlineBanner}><Text style={styles.offlineText}>Visualizando datos locales</Text></View>
      )}

      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o cliente..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.filterContainer}>
          {['Todos', 'Dama', 'Caballero'].map((cat) => (
            <TouchableOpacity 
              key={cat}
              onPress={() => setCategoriaActiva(cat as any)}
              style={[styles.filterChip, categoriaActiva === cat && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, categoriaActiva === cat && styles.filterTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />}
      >
        {isLoading && !refreshing ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
        ) : filteredPatterns.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{searchQuery ? 'No hay coincidencias' : 'No hay patrones disponibles'}</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredPatterns.map((patron) => (
              <TouchableOpacity
                key={patron.id}
                style={styles.card}
                onPress={() => navigation.navigate('VisorPatrones', { patronGuardado: patron })}
                onLongPress={() => handleDelete(patron.id, patron.nombre)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{patron.nombre}</Text>
                  <View style={[styles.dot, { backgroundColor: patron.categoria === 'Caballero' ? '#007AFF' : '#FF2D55' }]} />
                </View>
                <Text style={styles.cardSubtitle}>{patron.nombreCliente}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardInfo}>{patron.piezas.length} piezas</Text>
                  <Text style={styles.cardInfo}>{patron.totalTela}m</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { padding: 20, backgroundColor: '#1a1a1a' },
  searchInput: { backgroundColor: '#2a2a2a', borderRadius: 10, padding: 12, color: '#FFF', marginBottom: 15 },
  filterContainer: { flexDirection: 'row', gap: 10 },
  filterChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#2a2a2a' },
  filterChipActive: { backgroundColor: '#007AFF' },
  filterText: { color: '#888', fontWeight: 'bold', fontSize: 12 },
  filterTextActive: { color: '#FFF' },
  grid: { padding: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: '#1e1e1e', width: '48%', borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  cardTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 15, flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  cardSubtitle: { color: '#AAA', fontSize: 12, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#333', paddingTop: 8 },
  cardInfo: { color: '#666', fontSize: 10, fontWeight: 'bold' },
  emptyState: { marginTop: 100, alignItems: 'center' },
  emptyText: { color: '#444', fontSize: 16 },
  offlineBanner: { backgroundColor: '#FF9500', padding: 4, alignItems: 'center' },
  offlineText: { fontSize: 10, fontWeight: 'bold' }
});

export default Biblioteca;