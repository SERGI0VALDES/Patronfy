// components/PatternVisualizer.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';
import { PatternPiece } from '../utils/patternGenerator';

interface PatternVisualizerProps {
  piece: PatternPiece;
  scale?: number;
  showMeasurements?: boolean;
  showGrid?: boolean;
}

const PatternVisualizer: React.FC<PatternVisualizerProps> = ({
  piece,
  scale = 0.8,
  showMeasurements = true,
  showGrid = true
}) => {
  const { width, height } = piece.boundingBox;
  
  // Tamaño del contenedor basado en el scale
  const containerWidth = width * scale + 40;
  const containerHeight = height * scale + 40;

  // Generar el path data para SVG
  const pathData = generatePathData(piece.paths);

  return (
    <View style={[styles.container, { width: containerWidth, height: containerHeight }]}>
      <Svg 
        width={containerWidth} 
        height={containerHeight}
        viewBox={`0 0 ${width + 20} ${height + 20}`}
      >
        {/* Grid de fondo */}
        {showGrid && <Grid width={width} height={height} />}
        
        {/* Patrón principal */}
        <G>
          <Path
            d={pathData}
            fill="none"
            stroke="#007AFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Medidas */}
        {showMeasurements && (
          <>
            <SvgText 
              x={width / 2} 
              y={height + 15} 
              fill="#CCCCCC" 
              fontSize="12" 
              textAnchor="middle"
            >
              {Math.round(width)}cm
            </SvgText>
            <SvgText 
              x={-10} 
              y={height / 2} 
              fill="#CCCCCC" 
              fontSize="12" 
              textAnchor="middle"
              
            >
              {Math.round(height)}cm
            </SvgText>
          </>
        )}
      </Svg>
    </View>
  );
};

// Componente Grid simplificado
const Grid: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const gridLines = [];
  const gridSize = 10; // Cada 10cm

  // Líneas verticales
  for (let x = 0; x <= width; x += gridSize) {
    gridLines.push(
      <Path
        key={`v-${x}`}
        d={`M ${x} 0 L ${x} ${height}`}
        stroke="#333333"
        strokeWidth="0.5"
        strokeDasharray="1,1"
      />
    );
  }

  // Líneas horizontales
  for (let y = 0; y <= height; y += gridSize) {
    gridLines.push(
      <Path
        key={`h-${y}`}
        d={`M 0 ${y} L ${width} ${y}`}
        stroke="#333333"
        strokeWidth="0.5"
        strokeDasharray="1,1"
      />
    );
  }

  return <>{gridLines}</>;
};

// Función para generar path data
const generatePathData = (paths: any[]): string => {
  let pathData = '';
  
  paths.forEach((point, index) => {
    if (point.type === 'move') {
      pathData += `M ${point.x} ${point.y} `;
    } else if (point.type === 'line' || point.type === 'curve') {
      pathData += `L ${point.x} ${point.y} `;
    }
  });
  
  // Cerrar el path si no está cerrado
  if (paths.length > 2) {
    pathData += 'Z';
  }
  
  return pathData;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 10,
    alignSelf: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#444444',
  },
});

export default PatternVisualizer;