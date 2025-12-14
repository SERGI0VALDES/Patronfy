// screens/MedidaEntrada.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../types/navigation';
import { BodyMeasures } from '../types/medidas';

type MedidaEntradaNavigationProp = StackNavigationProp<RootStackParamList, 'MedidaEntrada'>;

const MedidaEntrada: React.FC = () => {
  const navigation = useNavigation<MedidaEntradaNavigationProp>();
  const [measures, setMeasures] = useState<BodyMeasures>({
    chest: 0,
    waist: 0,
    hips: 0,
    torsoLength: 0,
    shoulderWidth: 0,
    armLength: 0,
    neckCircumference: 0,
  });

  const updateMeasure = (field: keyof BodyMeasures, value: string) => {
    setMeasures(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const validateMeasures = (): boolean => {
    // Validación básica - puedes expandir esto
    if (measures.chest <= 0 || measures.waist <= 0) {
      Alert.alert('Error', 'Por favor ingresa medidas válidas');
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validateMeasures()) {
      navigation.navigate('SeleccionPrendas', { measures });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Medidas Corporales</Text>
        <Text style={styles.subtitle}>Ingresa las medidas en centímetros</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Pecho (cm)</Text>
          <TextInput
            style={styles.input}
            value={measures.chest.toString()}
            onChangeText={(text) => updateMeasure('chest', text)}
            placeholder="0"
            placeholderTextColor="#666666"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Cintura (cm)</Text>
          <TextInput
            style={styles.input}
            value={measures.waist.toString()}
            onChangeText={(text) => updateMeasure('waist', text)}
            placeholder="0"
            placeholderTextColor="#666666"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Cadera (cm)</Text>
          <TextInput
            style={styles.input}
            value={measures.hips.toString()}
            onChangeText={(text) => updateMeasure('hips', text)}
            placeholder="0"
            placeholderTextColor="#666666"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Largo de Torso (cm)</Text>
          <TextInput
            style={styles.input}
            value={measures.torsoLength.toString()}
            onChangeText={(text) => updateMeasure('torsoLength', text)}
            placeholder="0"
            placeholderTextColor="#666666"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Ancho de Hombros (cm)</Text>
          <TextInput
            style={styles.input}
            value={measures.shoulderWidth.toString()}
            onChangeText={(text) => updateMeasure('shoulderWidth', text)}
            placeholder="0"
            placeholderTextColor="#666666"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Largo de Brazo (cm)</Text>
          <TextInput
            style={styles.input}
            value={measures.armLength.toString()}
            onChangeText={(text) => updateMeasure('armLength', text)}
            placeholder="0"
            placeholderTextColor="#666666"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Contorno de Cuello (cm)</Text>
          <TextInput
            style={styles.input}
            value={measures.neckCircumference.toString()}
            onChangeText={(text) => updateMeasure('neckCircumference', text)}
            placeholder="0"
            placeholderTextColor="#666666"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continuar a Selección de Prenda</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 30,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MedidaEntrada;