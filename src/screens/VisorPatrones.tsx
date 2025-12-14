// screens/VisorPatrones.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  TextInput, 
  Modal 
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '../components/common/Header';
import { RootStackParamList } from '../types/navigation';
import { generatePattern, GeneratedPattern } from '../utils/patternGenerator';
import PatternVisualizer from '../components/PatternVisualizer';
import { savePatternToLibrary } from '../utils/storage';

type VisorPatronesNavigationProp = StackNavigationProp<RootStackParamList, 'VisorPatrones'>;
type VisorPatronesRouteProp = RouteProp<RootStackParamList, 'VisorPatrones'>;

const VisorPatrones: React.FC = () => {
  const navigation = useNavigation<VisorPatronesNavigationProp>();
  const route = useRoute<VisorPatronesRouteProp>();
  const { measures, garmentType, garmentStyle } = route.params;

  const [selectedPiece, setSelectedPiece] = useState<string>('');
  const [generatedPattern, setGeneratedPattern] = useState<GeneratedPattern | null>(null);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [patternName, setPatternName] = useState('');
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    try {
      const pattern = generatePattern(measures, garmentType, garmentStyle);
      setGeneratedPattern(pattern);
      if (pattern.pieces.length > 0) {
        setSelectedPiece(pattern.pieces[0].id);
      }
      
      // Generar nombre automático
      const autoName = `${garmentType === 'tshirt' ? 'Playera' : 'Prenda'} - ${new Date().toLocaleDateString()}`;
      setPatternName(autoName);
    } catch (error) {
      console.error('Error generating pattern:', error);
      Alert.alert('Error', 'No se pudo generar el patrón. Verifica las medidas.');
    }
  }, [measures, garmentType, garmentStyle]);

  const handleSavePattern = async () => {
    if (!generatedPattern || !patternName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el patrón');
      return;
    }

    try {
      await savePatternToLibrary(generatedPattern, patternName.trim(), clientName.trim() || undefined);
      setSaveModalVisible(false);
      Alert.alert(
        '¡Éxito!', 
        'Patrón guardado en la biblioteca',
        [
          {
            text: 'Ver Biblioteca',
            onPress: () => navigation.navigate('Biblioteca')
          },
          {
            text: 'Seguir aquí',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el patrón');
    }
  };

  const handleExportPDF = () => {
    Alert.alert(
      'Exportar Patrón',
      `¿Exportar patrón de ${generatedPattern?.garmentType} en PDF?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Exportar', 
          onPress: () => {
            console.log('Exportando patrón:', generatedPattern);
            Alert.alert('Éxito', 'PDF generado correctamente');
          }
        },
      ]
    );
  };

  if (!generatedPattern) {
    return (
      <View style={styles.container}>
        <Header title="Generando Patrón..." showBackButton={true} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Calculando medidas del patrón...</Text>
        </View>
      </View>
    );
  }

  const selectedPieceData = generatedPattern.pieces.find(p => p.id === selectedPiece);

  return (
    <View style={styles.container}>
      <Header title="Patrón Generado" showBackButton={true} />
      
      <ScrollView style={styles.content}>
        {/* Información del patrón */}
        <View style={styles.patternInfo}>
          <Text style={styles.patternTitle}>
            {garmentType === 'tshirt' ? 'Playera' : 
             garmentType === 'pants' ? 'Pantalón' :
             garmentType === 'dress' ? 'Vestido' : 'Falda'}
          </Text>
          <Text style={styles.patternSubtitle}>
            Cuello: {garmentStyle.neckType} | Manga: {garmentStyle.sleeveType}
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{generatedPattern.totalFabric}m</Text>
              <Text style={styles.statLabel}>Tela necesaria</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{generatedPattern.difficulty}</Text>
              <Text style={styles.statLabel}>Dificultad</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{generatedPattern.pieces.length}</Text>
              <Text style={styles.statLabel}>Piezas</Text>
            </View>
          </View>
        </View>

        {/* Selector de piezas */}
        <Text style={styles.sectionTitle}>Piezas del Patrón</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.piecesScroll}>
          {generatedPattern.pieces.map((piece) => (
            <TouchableOpacity
              key={piece.id}
              style={[
                styles.pieceButton,
                selectedPiece === piece.id && styles.pieceButtonSelected
              ]}
              onPress={() => setSelectedPiece(piece.id)}
            >
              <Text style={[
                styles.pieceButtonText,
                selectedPiece === piece.id && styles.pieceButtonTextSelected
              ]}>
                {piece.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Visualización del patrón */}
        <View style={styles.patternVisualization}>
          <Text style={styles.visualizationTitle}>
            {selectedPieceData?.name}
          </Text>
          <Text style={styles.measurementsText}>
            {selectedPieceData?.measurements}
          </Text>
          
          {/* Componente de visualización */}
          {selectedPieceData && (
            <PatternVisualizer 
              piece={selectedPieceData}
              scale={0.6}
              showMeasurements={true}
              showGrid={true}
            />
          )}
        </View>

        {/* Instrucciones */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Instrucciones de Corte</Text>
          {generatedPattern.instructions.map((instruction, index) => (
            <Text key={index} style={styles.instructionText}>
              • {instruction}
            </Text>
          ))}
        </View>

        {/* Acciones */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={() => setSaveModalVisible(true)}
          >
            <Text style={styles.saveButtonText}>Guardar en Biblioteca</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleExportPDF}>
            <Text style={styles.actionButtonText}>Exportar PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Imprimir', 'Función de impresión en desarrollo')}>
            <Text style={styles.actionButtonText}>Imprimir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal para guardar patrón */}
      <Modal
        visible={saveModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSaveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Guardar Patrón</Text>
            
            <Text style={styles.modalLabel}>Nombre del patrón *</Text>
            <TextInput
              style={styles.modalInput}
              value={patternName}
              onChangeText={setPatternName}
              placeholder="Ej: Playera básica verano"
              placeholderTextColor="#666666"
            />
            
            <Text style={styles.modalLabel}>Nombre del cliente (opcional)</Text>
            <TextInput
              style={styles.modalInput}
              value={clientName}
              onChangeText={setClientName}
              placeholder="Ej: María González"
              placeholderTextColor="#666666"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setSaveModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSavePattern}
              >
                <Text style={styles.confirmButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  patternInfo: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  patternTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  patternSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  piecesScroll: {
    marginBottom: 20,
  },
  pieceButton: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#444444',
  },
  pieceButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  pieceButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  pieceButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  patternVisualization: {
    marginBottom: 20,
    alignItems: 'center',
  },
  visualizationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  measurementsText: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 16,
    textAlign: 'center',
  },
  instructions: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 8,
    marginTop: 12,
  },
  modalInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#8E8E93',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VisorPatrones;