// screens/SeleccionPrendas.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList, GarmentType, GarmentStyle } from '../types/navigation';

type SeleccionPrendasNavigationProp = StackNavigationProp<RootStackParamList, 'SeleccionPrendas'>;
type SeleccionPrendasRouteProp = RouteProp<RootStackParamList, 'SeleccionPrendas'>;

const SeleccionPrendas: React.FC = () => {
  const navigation = useNavigation<SeleccionPrendasNavigationProp>();
  const route = useRoute<SeleccionPrendasRouteProp>();
  const { measures } = route.params;

  const [selectedGarment, setSelectedGarment] = useState<GarmentType>('tshirt');
  const [garmentStyle, setGarmentStyle] = useState<GarmentStyle>({
    neckType: 'round',
    sleeveType: 'short'
  });

  const garmentTypes = [
    { id: 'tshirt' as GarmentType, name: 'Playera', description: 'Prenda básica de torso', available: true },
    { id: 'pants' as GarmentType, name: 'Pantalón', description: 'Prenda para piernas', available: false },
    { id: 'dress' as GarmentType, name: 'Vestido', description: 'Prenda única para torso y piernas', available: false },
    { id: 'skirt' as GarmentType, name: 'Falda', description: 'Prenda para cintura hacia abajo', available: false },
  ];

  const neckTypes = [
    { id: 'round', name: 'Cuello Redondo' },
    { id: 'v-neck', name: 'Cuello en V' }
  ];

  const sleeveTypes = [
    { id: 'short', name: 'Manga Corta' },
    { id: 'long', name: 'Manga Larga' }
  ];

  const handleGarmentSelect = (garmentId: GarmentType) => {
    setSelectedGarment(garmentId);
  };

  const handleStyleSelect = (styleType: keyof GarmentStyle, value: any) => {
    setGarmentStyle(prev => ({
      ...prev,
      [styleType]: value
    }));
  };

  const handleGeneratePattern = () => {
    // Navegamos a VisorPatrones pasando todos los datos
    navigation.navigate('VisorPatrones', {
      measures,
      garmentType: selectedGarment,
      garmentStyle
    });
  };

  return (
    <View style={styles.container}>

      
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Resumen de Medidas</Text>
        <View style={styles.measuresSummary}>
          <Text style={styles.measureText}>Pecho: {measures.chest} cm</Text>
          <Text style={styles.measureText}>Cintura: {measures.waist} cm</Text>
          <Text style={styles.measureText}>Cadera: {measures.hips} cm</Text>
        </View>

        <Text style={styles.sectionTitle}>Elige el tipo de prenda</Text>
        <Text style={styles.sectionSubtitle}>Selecciona la prenda que deseas crear</Text>

        {garmentTypes.map((garment) => (
          <TouchableOpacity
            key={garment.id}
            style={[
              styles.garmentCard,
              selectedGarment === garment.id && styles.selectedCard,
              !garment.available && styles.disabledCard
            ]}
            onPress={() => garment.available && handleGarmentSelect(garment.id)}
            disabled={!garment.available}
          >
            <View style={styles.garmentInfo}>
              <Text style={[
                styles.garmentName,
                selectedGarment === garment.id && styles.selectedText,
                !garment.available && styles.disabledText
              ]}>
                {garment.name}
              </Text>
              <Text style={[
                styles.garmentDescription,
                !garment.available && styles.disabledText
              ]}>
                {garment.description}
              </Text>
              {!garment.available && (
                <Text style={styles.comingSoon}>Próximamente</Text>
              )}
            </View>
            <View style={[
              styles.radioButton,
              selectedGarment === garment.id && styles.radioButtonSelected
            ]} />
          </TouchableOpacity>
        ))}

        {/* Opciones de estilo para playera */}
        {selectedGarment === 'tshirt' && (
          <>
            <Text style={styles.sectionTitle}>Tipo de Cuello</Text>
            <View style={styles.styleOptions}>
              {neckTypes.map((neck) => (
                <TouchableOpacity
                  key={neck.id}
                  style={[
                    styles.styleButton,
                    garmentStyle.neckType === neck.id && styles.styleButtonSelected
                  ]}
                  onPress={() => handleStyleSelect('neckType', neck.id)}
                >
                  <Text style={[
                    styles.styleButtonText,
                    garmentStyle.neckType === neck.id && styles.styleButtonTextSelected
                  ]}>
                    {neck.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Tipo de Manga</Text>
            <View style={styles.styleOptions}>
              {sleeveTypes.map((sleeve) => (
                <TouchableOpacity
                  key={sleeve.id}
                  style={[
                    styles.styleButton,
                    garmentStyle.sleeveType === sleeve.id && styles.styleButtonSelected
                  ]}
                  onPress={() => handleStyleSelect('sleeveType', sleeve.id)}
                >
                  <Text style={[
                    styles.styleButtonText,
                    garmentStyle.sleeveType === sleeve.id && styles.styleButtonTextSelected
                  ]}>
                    {sleeve.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGeneratePattern}
        >
          <Text style={styles.generateButtonText}>Generar Patrón</Text>
        </TouchableOpacity>
      </ScrollView>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  measuresSummary: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  measureText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 16,
  },
  garmentCard: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#007AFF',
    backgroundColor: '#2a4a7a',
  },
  disabledCard: {
    opacity: 0.6,
  },
  garmentInfo: {
    flex: 1,
  },
  garmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  garmentDescription: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  disabledText: {
    color: '#666666',
  },
  comingSoon: {
    fontSize: 12,
    color: '#FFA500',
    marginTop: 4,
    fontStyle: 'italic',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666666',
  },
  radioButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  styleOptions: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  styleButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444444',
  },
  styleButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  styleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  styleButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  generateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SeleccionPrendas;