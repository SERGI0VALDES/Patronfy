// screens/Biblioteca.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { SavedPattern, deletePattern } from '../utils/storage';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import api from '../api/axios';

type BibliotecaNavigationProp = StackNavigationProp<RootStackParamList, 'Biblioteca'>;

const CACHE_KEY = '@biblioteca_cache'; // Llave para guardar en el celular

const Biblioteca: React.FC = () => {
  const navigation = useNavigation<BibliotecaNavigationProp>();
  const isFocused = useIsFocused();
  
  const [patterns, setPatterns] = useState<SavedPattern[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatterns, setFilteredPatterns] = useState<SavedPattern[]>([]);
  const [isOffline, setIsOffline] = useState(false); // <--- Estado para avisar al usuario

  useEffect(() => {
    if (isFocused) {
      loadPatterns();
    }
  }, [isFocused]);

  useEffect(() => {
    filterPatterns();
  }, [patterns, searchQuery]);

  // Función para mapear los datos (la sacamos para reutilizarla)
  const mapResponseToPatterns = (data: any[]): SavedPattern[] => {
    return data.map((p: any) => ({
    id: p.id,
    name: p.nombre,
    garmentType: p.categoria,
    
    garmentStyle: p.medidas?.style || 'classic', 
    
    instructions: p.medidas?.instructions || [], 
    
    createdAt: p.fecha_sincronizacion || p.fecha_creacion,
    clientName: p.medidas?.client || 'Sin cliente',
    pieces: p.medidas?.stats?.pieces || [],
    totalFabric: p.medidas?.stats?.totalFabric || 0,
    difficulty: p.medidas?.stats?.difficulty || 'Media'
  }));
  };

  const loadPatterns = async () => {
    const state = await NetInfo.fetch();
    
    if (state.isConnected) {
      // --- CASO: CON INTERNET ---
      try {
        const response = await api.get('/patrones');
        const patronesMapeados = mapResponseToPatterns(response.data);
        
        // 1. Guardamos en el estado
        setPatterns(patronesMapeados);
        setIsOffline(false);
        
        // 2. ¡CLAVE! Guardamos una copia en el teléfono para después
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(patronesMapeados));
        
      } catch (error) {
        console.error("Error API, cargando local...", error);
        loadLocalCache(); // Si el servidor falla, intentamos cargar lo viejo
      }
    } else {
      // --- CASO: SIN INTERNET ---
      loadLocalCache();
    }
  };

  const loadLocalCache = async () => {
    setIsOffline(true);
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    if (cachedData) {
      setPatterns(JSON.parse(cachedData));
    }
  };

  const filterPatterns = () => {
    if (!searchQuery.trim()) {
      setFilteredPatterns(patterns);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = patterns.filter(pattern =>
      pattern.name.toLowerCase().includes(query) ||
      pattern.clientName?.toLowerCase().includes(query) ||
      pattern.garmentType.toLowerCase().includes(query)
    );
    setFilteredPatterns(filtered);
  };

  // ... (handleDeletePattern y handleViewPattern se mantienen igual)
  const handleDeletePattern = (patternId: string, patternName: string) => {
    if (isOffline) {
        Alert.alert("Acción no permitida", "Debes estar conectado a internet para eliminar patrones.");
        return;
    }
    Alert.alert(
      'Eliminar Patrón',
      `¿Estás seguro de que quieres eliminar "${patternName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/patrones/${patternId}`); // Borrar en DB
              await loadPatterns();
              Alert.alert('Éxito', 'Patrón eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el patrón');
            }
          }
        }
      ]
    );
  };

  const handleViewPattern = (pattern: SavedPattern) => {
    Alert.alert(
      pattern.name,
      `Tipo: ${pattern.garmentType}\nCliente: ${pattern.clientName || 'No especificado'}\nTela: ${pattern.totalFabric}m\nPiezas: ${pattern.pieces.length}`,
      [
        { text: 'Cerrar', style: 'cancel' },
        {
          text: 'Ver Detalles',
          onPress: () => {
            console.log('Ver patrón:', pattern);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Aviso de modo Offline */}
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Modo sin conexión: Viendo datos locales</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, cliente o tipo..."
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.resultsText}>
          {filteredPatterns.length} {filteredPatterns.length === 1 ? 'patrón' : 'patrones'} encontrado{filteredPatterns.length !== 1 ? 's' : ''}
        </Text>

        <ScrollView style={styles.patternsList}>
          {filteredPatterns.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {patterns.length === 0 
                  ? 'No hay patrones guardados aún' 
                  : 'No se encontraron patrones'
                }
              </Text>
            </View>
          ) : (
            filteredPatterns.map((pattern) => (
              <TouchableOpacity
                key={pattern.id}
                style={[styles.patternCard, isOffline && { borderLeftColor: '#666' }]}
                onPress={() => handleViewPattern(pattern)}
                onLongPress={() => handleDeletePattern(pattern.id, pattern.name)}
              >
                <View style={styles.patternHeader}>
                  <Text style={styles.patternName}>{pattern.name}</Text>
                  <Text style={styles.patternDate}>
                    {new Date(pattern.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.patternDetails}>
                  <Text style={styles.patternType}>
                    {pattern.garmentType === 'tshirt' ? 'Playera' : 
                     pattern.garmentType === 'pants' ? 'Pantalón' :
                     pattern.garmentType === 'dress' ? 'Vestido' : 'Falda'}
                  </Text>
                  {pattern.clientName && (
                    <Text style={styles.clientName}>Cliente: {pattern.clientName}</Text>
                  )}
                  <View style={styles.patternStats}>
                    <Text style={styles.stat}>Piezas: {pattern.pieces.length}</Text>
                    <Text style={styles.stat}>Tela: {pattern.totalFabric}m</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
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