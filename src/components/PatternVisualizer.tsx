import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

interface PatternVisualizerProps {
  piece: {
    d: string;
    nombre: string;
  } | null;
  scale?: number;
}

const PatternVisualizer: React.FC<PatternVisualizerProps> = ({ piece, scale = 1 }) => {
  if (!piece || !piece.d) return null;

  // Estimamos el tamaño de la pieza para el viewBox
  // Una playera de hombre rara vez mide más de 60cm de ancho (600px) y 90cm de alto (900px)
  // Le damos un margen (padding) de 50px
  return (
    <View style={styles.container}>
      <Svg 
        width="100%" 
        height="100%" 
        viewBox="-50 -50 700 1000" // El -50 permite ver las líneas que tocan el borde
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Cuadrícula de fondo opcional para referencia */}
        <G opacity="0.1">
          {[...Array(10)].map((_, i) => (
            <Path key={i} d={`M ${i * 100} 0 L ${i * 100} 1000`} stroke="white" strokeWidth="1" />
          ))}
        </G>

        <Path
          d={piece.d}
          fill="rgba(0, 122, 255, 0.2)"
          stroke="#007AFF"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 400, // Dale una altura fija para que el SVG tenga referencia
    backgroundColor: '#252525',
    borderRadius: 8,
    overflow: 'hidden'
  }
});

export default PatternVisualizer;