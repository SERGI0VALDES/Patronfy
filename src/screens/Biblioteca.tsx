import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatterns, setFilteredPatterns] = useState<PatronGuardado[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (isFocused) {
      loadPatterns();
    }
  }, [isFocused]);

  useEffect(() => {
    filterPatterns();
  }, [patrones, searchQuery]);

  // EL MAPEO: Aquí es donde resolvemos el lío con Prisma y los nombres
  const mapResponseToPatterns = (data: any[]): PatronGuardado[] => {
    return data.map((p: any) => ({
      id: p.id || p.id_local,
      nombre: p.nombre,
      // Si el server no manda categoria, la inferimos del tipo para que Prisma no falle
      categoria: p.categoria || (p.tipoPrenda?.includes('hombre') ? 'Caballero' : 'Dama'),
      tipoPrenda: p.tipoPrenda || 'playera_hombre',
      
      nombreCliente: p.nombreCliente || p.medidas?.cliente || 'Sin cliente',
      fechaCreacion: p.fechaCreacion || p.fecha_sincronizacion || p.fecha_creacion,
      
      // Recuperamos los dibujos (piezas)
      piezas: p.piezas || p.medidas?.piezas || [],
      instrucciones: p.instrucciones || p.medidas?.instrucciones || [],
      
      // Datos de estilo y stats
      estiloPrenda: p.estiloPrenda || p.medidas?.estilo || { tipoCuello: 'redondo', tipoManga: 'corta' },
      totalTela: p.totalTela || p.medidas?.stats?.totalTela || 1.5,
      dificultad: p.dificultad || p.medidas?.stats?.dificultad || 'Media',
      medidas: p.medidas
    }));
  };

  const loadPatterns = async () => {
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      try {
        const response = await api.get('/patrones');
        const patronesMapeados = mapResponseToPatterns(response.data);
        setPatrones(patronesMapeados);
        setIsOffline(false);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(patronesMapeados));
      } catch (error) {
        console.error("Error API, cargando local...", error);
        loadLocalCache();
      }
    } else {
      loadLocalCache();
    }
  };

  const loadLocalCache = async () => {
    setIsOffline(true);
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    if (cachedData) {
      // Importante: También mapeamos el caché para que tenga los campos nuevos
      setPatrones(mapResponseToPatterns(JSON.parse(cachedData)));
    }
  };

  const filterPatterns = () => {
    if (!searchQuery.trim()) {
      setFilteredPatterns(patrones);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = patrones.filter(p =>
      p.nombre.toLowerCase().includes(query) ||
      p.nombreCliente?.toLowerCase().includes(query) ||
      p.categoria.toLowerCase().includes(query)
    );
    setFilteredPatterns(filtered);
  };

  const handleDeletePattern = (id: string, name: string) => {
    if (isOffline) {
      Alert.alert("Acción no permitida", "Conéctate para eliminar de la nube.");
      return;
    }
    Alert.alert('Eliminar', `¿Borrar "${name}"?`, [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, borrar', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/patrones/${id}`);
            loadPatterns();
          } catch (e) { Alert.alert('Error', 'No se pudo eliminar'); }
      }}
    ]);
  };

  // Función para ir al Visor (Ya no es solo un Alert)
  const handleViewPattern = (patron: PatronGuardado) => {
    navigation.navigate('VisorPatrones', { patronGuardado: patron });
  };

  return (
    <View style={styles.container}>
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Modo Offline: Datos Locales</Text>
        </View>
      )}

      <View style={styles.content}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar patrón..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView style={styles.patternsList}>
          {filteredPatterns.map((patron) => (
            <TouchableOpacity
              key={patron.id}
              style={styles.patternCard}
              onPress={() => handleViewPattern(patron)}
              onLongPress={() => handleDeletePattern(patron.id, patron.nombre)}
            >
              <View style={styles.patternHeader}>
                <Text style={styles.patternName}>{patron.nombre}</Text>
                <Text style={styles.patternDate}>
                  {patron.fechaCreacion ? new Date(patron.fechaCreacion).toLocaleDateString() : 'S/F'}
                </Text>
              </View>
              
              <View style={styles.patternDetails}>
                <Text style={[styles.patternType, { color: patron.categoria === 'Caballero' ? '#007AFF' : '#FF2D55' }]}>
                  {patron.categoria} - {patron.tipoPrenda.replace('_', ' ')}
                </Text>
                <Text style={styles.clientName}>Cliente: {patron.nombreCliente}</Text>
                <View style={styles.patternStats}>
                  <Text style={styles.stat}>Tela: {patron.totalTela}m</Text>
                  <Text style={styles.stat}>Piezas: {patron.piezas.length}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
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
  searchContainer: {
    marginBottom: 16,
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
    marginBottom: 16,
  },
  patternsList: {
    flex: 1,
  },
  patternCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  patternName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  patternDate: {
    fontSize: 12,
    color: '#888888',
    marginLeft: 8,
  },
  patternDetails: {
    marginBottom: 8,
  },
  patternType: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 8,
  },
  patternStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    fontSize: 12,
    color: '#888888',
  },
  longPressHint: {
    fontSize: 10,
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#CCCCCC',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  offlineBanner: {
    backgroundColor: '#FF9500',
    padding: 8,
    alignItems: 'center',
  },
  offlineText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Biblioteca;