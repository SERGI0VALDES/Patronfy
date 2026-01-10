// src\screens\VisorPatrones.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  Alert, TextInput, Modal, ActivityIndicator 
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListaParametrosNavegacion, PiezaSVG, PatronGuardado } from '../types/navigation'

import { obtenerPuntosPatron } from '../utils/generadorTrazos';
import PatternVisualizer from '../components/PatternVisualizer';

import api from '../api/axios';

import { guardarPatronLocal } from '../utils/storage';

type VisorPatronesNavigationProp = StackNavigationProp<ListaParametrosNavegacion, 'VisorPatrones'>;
type VisorPatronesRouteProp = RouteProp<ListaParametrosNavegacion, 'VisorPatrones'>;

const VisorPatrones: React.FC = () => {
  const navigation = useNavigation<VisorPatronesNavigationProp>();
  const route = useRoute<VisorPatronesRouteProp>();

  // Extraemos los parámetros (ahora usando tipoPrenda en español)
  const { patronGuardado, medidas, tipoPrenda, estiloPrenda } = route.params || {};

  const [selectedPiece, setSelectedPiece] = useState<string>('');
  const [generatedPattern, setGeneratedPattern] = useState<any | null>(null);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [nombrePatron, setNombrePatron] = useState('');
  const [nombreCliente, setClientName] = useState('');

  // Traducción amigable para la UI
  const nombresPrendas: Record<string, string> = {
    playera_hombre: 'Playera Hombre',
    pantalon_hombre: 'Pantalón Hombre',
    blusa_mujer: 'Blusa Mujer',
    falda_basica: 'Falta Básica'
  };

  useEffect(() => {
    if (patronGuardado) {
      // CASO A: Viene de la biblioteca (datos ya procesados)
      setGeneratedPattern(patronGuardado);
      setNombrePatron(patronGuardado.nombre);
      setClientName(patronGuardado.nombreCliente || '');
      if (patronGuardado.piezas?.length > 0) setSelectedPiece(patronGuardado.piezas[0].id);
    } 
    else if (medidas && tipoPrenda) {
      // CASO B: Flujo de creación nueva
      try {
        // Llamamos al generador dinámico que definimos anteriormente
        const newPattern = obtenerPuntosPatron(tipoPrenda, medidas, estiloPrenda);
        setGeneratedPattern(newPattern);
        
        if (newPattern.piezas && newPattern.piezas.length > 0) {
        setSelectedPiece(newPattern.piezas[0].id);
        }

        const autoName = `${nombresPrendas[tipoPrenda] || 'Prenda'} - ${new Date().toLocaleDateString()}`;
        setNombrePatron(autoName);
      } catch (error) {
        console.error('Error al generar:', error);
        Alert.alert('Error', 'Hubo un problema al calcular el trazado técnico.');
      }
    }
  }, [patronGuardado, medidas, tipoPrenda, estiloPrenda]);

  const handleSavePattern = async () => {
  if (!generatedPattern || !nombrePatron.trim()) {
    Alert.alert('Error', 'Por favor ingresa un nombre para el patrón');
    return;
  }

  try {
    const tipoPrendaFinal = tipoPrenda || patronGuardado?.tipoPrenda || 'playera_hombre';
    const categoriaCalculada = tipoPrendaFinal.includes('hombre') ? 'Caballero' : 'Dama';

    // Generamos el ID una sola vez para que sea consistente
    const idUnico = patronGuardado?.id || Crypto.randomUUID();

    const datosParaEnviar = {
      id_local: idUnico, // <--- EL SERVIDOR ESPERA "id_local"
      nombre: nombrePatron.trim(),
      nombreCliente: nombreCliente.trim() || 'Sin nombre',
      tipoPrenda: tipoPrendaFinal,
      categoria: categoriaCalculada,
      piezas: generatedPattern.piezas,
      instrucciones: generatedPattern.instrucciones || [],
      // Asegúrate de que totalTela sea número, no string
      totalTela: parseFloat(generatedPattern.totalTela) || 1.5, 
      dificultad: generatedPattern.dificultad || 'Media',
      medidas: medidas || patronGuardado?.medidas,
      estiloPrenda: estiloPrenda || patronGuardado?.estiloPrenda || {},
    };

    // 1. Guardar local (Aquí puedes seguir usando tu interfaz PatronGuardado)
    await guardarPatronLocal({ ...datosParaEnviar, id: idUnico } as any);

    // 2. Enviar al servidor
    console.log("Enviando a la nube:", datosParaEnviar);
    const response = await api.post('/patrones', datosParaEnviar);

    if (response.status === 201 || response.status === 200) {
      setSaveModalVisible(false);
      Alert.alert('¡Éxito!', 'Patrón guardado y sincronizado.', [
        { text: 'Ir a Biblioteca', onPress: () => navigation.navigate('Biblioteca') }
      ]);
    }
  } catch (error: any) {
    console.error('Error al guardar:', error.response?.data || error.message);
    setSaveModalVisible(false);
    Alert.alert('Guardado Local', 'Se guardó en el dispositivo, pero el servidor lo rechazó.');
    navigation.navigate('Biblioteca');
  }
};

  
  if (!generatedPattern) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Generando...</Text>
      </View>
    );
  }

  const selectedPieceData = generatedPattern.piezas?.find((p: any) => p.id === selectedPiece);

  return (
    <View style={styles.container}>
      
      <ScrollView style={styles.content}>
        {/* Card de Información Técnica */}
        <View style={styles.patternInfo}>
          <Text style={styles.patternTitle}>
            {tipoPrenda ? nombresPrendas[tipoPrenda] : 'Patrón Personalizado'}
          </Text>
          <Text style={styles.patternSubtitle}>
            Sistema: Geometría Proporcional | Cliente: {nombreCliente || 'Ninguno asignado'}
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{generatedPattern.totalTela || '1.5'}m</Text>
              <Text style={styles.statLabel}>Tela aprox.</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{generatedPattern.dificultad || 'Media'}</Text>
              <Text style={styles.statLabel}>Dificultad</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{generatedPattern.piezas?.length || 0}</Text>
              <Text style={styles.statLabel}>Piezas</Text>
            </View>
          </View>
        </View>

        {/* Selector de Piezas (Delantero, Trasero, etc.) */}
        <Text style={styles.sectionTitle}>Piezas a Cortar</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.piecesScroll}>
          {generatedPattern.piezas?.map((piece: any, index: number) => (
            <TouchableOpacity
              key={piece.id || index} 
              style={[styles.pieceButton, selectedPiece === piece.id && styles.pieceButtonSelected]}
              onPress={() => setSelectedPiece(piece.id)} 
            >
              <Text style={[styles.pieceButtonText, selectedPiece === piece.id && styles.pieceButtonTextSelected]}>
                {piece.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* El Canvas del Patrón */}
        <View style={styles.patternVisualization}>
          <Text style={styles.visualizationTitle}>
            {selectedPieceData?.nombre || 'Seleccione una pieza'}
          </Text>
          <Text style={styles.measurementsText}>
            {selectedPieceData?.descripcion || 'Calculando geometría...'}
          </Text>
          
          {selectedPieceData ? (
            <View style={styles.canvasContainer}>
              {selectedPieceData ? (
                <PatternVisualizer 
                  piece={selectedPieceData}
                  // Si la escala 1:10 es muy grande, aquí la ajustamos para la pantalla
                  scale={0.5} 
                />
              ) : (
                <View style={styles.errorContainer}>
                  <Text style={{color: 'white'}}>Generando trazo técnico...</Text>
                </View>
              )}
            </View>
          ) : (
            <ActivityIndicator size="small" color="#666" />
          )}
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={() => setSaveModalVisible(true)}>
            <Text style={styles.saveButtonText}>Guardar Patrón</Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('PDF', 'Generando archivo de impresión...')}>
              <Text style={styles.actionButtonText}>Exportar PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.goBack()}>
              <Text style={styles.actionButtonText}>Corregir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Guardado */}
      <Modal visible={saveModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sincronizar Patrón</Text>
            <TextInput
              style={styles.modalInput}
              value={nombrePatron}
              onChangeText={setNombrePatron}
              placeholder="Nombre del Proyecto"
              placeholderTextColor="#666"
            />
            <TextInput
              style={styles.modalInput}
              value={nombreCliente}
              onChangeText={setClientName}
              placeholder="Nombre del Cliente"
              placeholderTextColor="#666"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setSaveModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleSavePattern}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  errorContainer: {flex:1, backgroundColor: '#121212'},
  content: { flex: 1, padding: 15 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  loadingText: { color: '#FFF', marginTop: 15, fontSize: 16 },
  patternInfo: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
  patternTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  patternSubtitle: { color: '#888', marginBottom: 15 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#333', paddingTop: 15 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  statLabel: { fontSize: 11, color: '#666', textTransform: 'uppercase' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 15 },
  piecesScroll: { marginBottom: 20 },
  pieceButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, backgroundColor: '#1E1E1E', marginRight: 10, borderWidth: 1, borderColor: '#333' },
  pieceButtonSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  pieceButtonText: { color: '#AAA', fontWeight: '600' },
  pieceButtonTextSelected: { color: '#FFF' },
  patternVisualization: { alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 20 },
  canvasContainer: { width: '100%', height: 400, justifyContent: 'center', alignItems: 'center' },
  visualizationTitle: { fontSize: 18, fontWeight: 'bold', color: '#121212' },
  measurementsText: { color: '#666', marginBottom: 10 },
  actionsContainer: { marginBottom: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  saveButton: { backgroundColor: '#34C759', padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 10 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  actionButton: { backgroundColor: '#222', padding: 15, borderRadius: 12, flex: 0.48, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  actionButtonText: { color: '#FFF', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#1E1E1E', padding: 25, borderRadius: 20, width: '85%' },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalInput: { backgroundColor: '#121212', borderRadius: 10, padding: 15, color: '#FFF', marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelButton: { flex: 0.45, padding: 15, alignItems: 'center' },
  confirmButton: { flex: 0.45, backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  cancelButtonText: { color: '#888', fontWeight: 'bold' },
  confirmButtonText: { color: '#FFF', fontWeight: 'bold' },
});

export default VisorPatrones;