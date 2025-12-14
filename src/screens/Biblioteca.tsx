// screens/Biblioteca.tsx - Eliminar el botón "Crear Primer Patrón"
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// import Header from '../components/common/Header';
import { RootStackParamList } from '../types/navigation';
import { getSavedPatterns, SavedPattern, deletePattern } from '../utils/storage';

type BibliotecaNavigationProp = StackNavigationProp<RootStackParamList, 'Biblioteca'>;

const Biblioteca: React.FC = () => {
  const navigation = useNavigation<BibliotecaNavigationProp>();
  const isFocused = useIsFocused();
  
  const [patterns, setPatterns] = useState<SavedPattern[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatterns, setFilteredPatterns] = useState<SavedPattern[]>([]);

  useEffect(() => {
    if (isFocused) {
      loadPatterns();
    }
  }, [isFocused]);

  useEffect(() => {
    filterPatterns();
  }, [patterns, searchQuery]);

  const loadPatterns = async () => {
    const savedPatterns = await getSavedPatterns();
    setPatterns(savedPatterns);
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

  const handleDeletePattern = (patternId: string, patternName: string) => {
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
              await deletePattern(patternId);
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
            // Podríamos navegar a una pantalla de detalle aquí
            console.log('Ver patrón:', pattern);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.content}>
        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, cliente o tipo..."
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Contador */}
        <Text style={styles.resultsText}>
          {filteredPatterns.length} {filteredPatterns.length === 1 ? 'patrón' : 'patrones'} encontrado{filteredPatterns.length !== 1 ? 's' : ''}
        </Text>

        {/* Lista de patrones */}
        <ScrollView style={styles.patternsList}>
          {filteredPatterns.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {patterns.length === 0 
                  ? 'No hay patrones guardados aún' 
                  : 'No se encontraron patrones que coincidan con la búsqueda'
                }
              </Text>
              {/* ELIMINADO: Botón "Crear Primer Patrón" */}
            </View>
          ) : (
            filteredPatterns.map((pattern) => (
              <TouchableOpacity
                key={pattern.id}
                style={styles.patternCard}
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
                    <Text style={styles.stat}>Dificultad: {pattern.difficulty}</Text>
                  </View>
                </View>
                
                <Text style={styles.longPressHint}>
                  Mantén presionado para eliminar
                </Text>
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
  // ELIMINADO: createButton y createButtonText
});

export default Biblioteca;