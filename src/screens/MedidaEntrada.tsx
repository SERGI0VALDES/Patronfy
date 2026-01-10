// src\screens\MedidaEntrada.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Importamos los tipos y la configuración dinámica
import { ListaParametrosNavegacion } from '../types/navigation';
import { ETIQUETAS_MEDIDAS, CAMPOS_POR_PRENDA} from '../constants/medidasConfig';

type MedidaEntradaNavigationProp = StackNavigationProp<ListaParametrosNavegacion, 'MedidaEntrada'>;
type MedidaEntradaRouteProp = RouteProp<ListaParametrosNavegacion, 'MedidaEntrada'>;

const MedidaEntrada: React.FC = () => {
  const navegacion = useNavigation<MedidaEntradaNavigationProp>();
  const ruta = useRoute<MedidaEntradaRouteProp>();
  
  // Obtenemos la prenda seleccionada de los parámetros de navegación
  const { tipoPrenda } = ruta.params;

  // Obtenemos la lista de campos que requiere esta prenda específica
  const camposRequeridos = CAMPOS_POR_PRENDA[tipoPrenda] || [];

  // Iniciamos el estado como un objeto vacío
  const [medidas, setMedidas] = useState<Record<string, string>>({});

  const actualizarMedida = (campo: string, valor: string) => {
    // Solo permitimos números y puntos decimales
    const valorLimpio = valor.replace(/[^0-9.]/g, '');
    setMedidas(prev => ({
      ...prev,
      [campo]: valorLimpio
    }));
  };

  const validarFormulario = (): boolean => {
    // Verificamos que todos los campos requeridos tengan un valor mayor a 0
    for (const campo of camposRequeridos) {
      const valor = parseFloat(medidas[campo]);
      if (!valor || valor <= 0) {
        Alert.alert('Faltan datos', `Por favor ingresa una medida válida para: ${ETIQUETAS_MEDIDAS[campo]}`);
        return false;
      }
    }
    return true;
  };

  const manejarContinuar = () => {
    if (validarFormulario()) {
      // Convertimos los strings a números antes de enviar
      const medidasNumericas: Record<string, number> = {};
      camposRequeridos.forEach(campo => {
        medidasNumericas[campo] = parseFloat(medidas[campo]);
      });

      // Navegamos al Visor de Patrones
      navegacion.navigate('VisorPatrones', { 
        medidas: medidasNumericas as any, 
        tipoPrenda 
      });
    }
  };

  return (
    <View style={styles.contenedor}>
      <ScrollView style={styles.contenido} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Ingresar Medidas</Text>
        <Text style={styles.subtitulo}>
          Prenda: <Text style={styles.prendaResaltada}>{tipoPrenda.replace('_', ' ').toUpperCase()}</Text>
        </Text>

        <View style={styles.formulario}>
          {camposRequeridos.map((campo) => (
            <View key={campo} style={styles.grupoInput}>
              <View style={styles.filaEtiqueta}>
                <Text style={styles.etiqueta}>{ETIQUETAS_MEDIDAS[campo]}</Text>
                <Text style={styles.unidad}>cm</Text>
              </View>
              
              <TextInput
                style={styles.input}
                value={medidas[campo] || ''}
                onChangeText={(text) => actualizarMedida(campo, text)}
                placeholder="0.0"
                placeholderTextColor="#666"
                keyboardType="decimal-pad"
                returnKeyType="next"
              />
              
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.botonContinuar} onPress={manejarContinuar}>
          <Text style={styles.textoBoton}>Generar Patrón Maestro</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#121212' },
  contenido: { flex: 1, padding: 20 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#FFF', marginBottom: 5 },
  subtitulo: { fontSize: 16, color: '#AAA', marginBottom: 25 },
  prendaResaltada: { color: '#007AFF', fontWeight: 'bold' },
  formulario: { marginBottom: 30 },
  grupoInput: { marginBottom: 20 },
  filaEtiqueta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  etiqueta: { fontSize: 16, fontWeight: '600', color: '#EEE' },
  unidad: { color: '#666', fontSize: 14 },
  input: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 15,
    color: '#FFF',
    fontSize: 18,
  },
  textoAyuda: { fontSize: 12, color: '#777', marginTop: 5, fontStyle: 'italic' },
  botonContinuar: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 40,
    // Sombra para iOS/Android
    elevation: 5,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  textoBoton: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

export default MedidaEntrada;