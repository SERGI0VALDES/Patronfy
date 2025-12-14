// utils/patternGenerator.ts - VERSIÓN CORREGIDA
import { BodyMeasures, GarmentType, GarmentStyle } from '../types/navigation';

export interface PatternPiece {
  id: string;
  name: string;
  paths: PathPoint[];
  measurements: string;
  boundingBox: { width: number; height: number };
}

export interface PathPoint {
  x: number;
  y: number;
  type: 'move' | 'line' | 'curve';
}

export interface GeneratedPattern {
  garmentType: GarmentType;
  garmentStyle: GarmentStyle;
  pieces: PatternPiece[];
  totalFabric: number;
  difficulty: string;
  instructions: string[];
}

// Lógica principal de generación de patrones
export const generatePattern = (
  measures: BodyMeasures,
  garmentType: GarmentType,
  garmentStyle: GarmentStyle
): GeneratedPattern => {
  switch (garmentType) {
    case 'tshirt':
      return generateTShirtPattern(measures, garmentStyle);
    case 'pants':
      return generatePantsPattern(measures, garmentStyle);
    case 'dress':
      return generateDressPattern(measures, garmentStyle);
    case 'skirt':
      return generateSkirtPattern(measures, garmentStyle);
    default:
      return generateTShirtPattern(measures, garmentStyle);
  }
};

// Generador específico para playeras - CORREGIDO
const generateTShirtPattern = (
  measures: BodyMeasures,
  style: GarmentStyle
): GeneratedPattern => {
  const { chest, torsoLength, shoulderWidth, armLength } = measures;
  
  // ✅ CÁLCULOS CORREGIDOS: Usar medidas realistas
  const ease = 8; // Holgura básica
  const halfChest = chest / 2 + ease; // Medio contorno de pecho + holgura
  const bodyLength = torsoLength + 8; // +8cm para dobladillo y comodidad
  const sleeveLength = style.sleeveType === 'short' ? 25 : armLength;
  
  // ✅ BOUNDING BOXES CONSISTENTES
  const frontPiece: PatternPiece = {
    id: 'front',
    name: 'Delantero',
    boundingBox: { width: halfChest, height: bodyLength },
    measurements: `Ancho: ${halfChest}cm, Largo: ${bodyLength}cm`,
    paths: generateTShirtFrontPaths(halfChest, bodyLength, style.neckType)
  };

  const backPiece: PatternPiece = {
    id: 'back',
    name: 'Trasero',
    boundingBox: { width: halfChest, height: bodyLength },
    measurements: `Ancho: ${halfChest}cm, Largo: ${bodyLength}cm`,
    paths: generateTShirtBackPaths(halfChest, bodyLength)
  };

  const sleevePiece: PatternPiece = {
    id: 'sleeve',
    name: style.sleeveType === 'short' ? 'Manga Corta' : 'Manga Larga',
    boundingBox: { 
      width: halfChest * 0.6, 
      height: sleeveLength 
    },
    measurements: `Ancho: ${(halfChest * 0.6).toFixed(1)}cm, Largo: ${sleeveLength}cm`,
    paths: generateSleevePaths(halfChest * 0.6, sleeveLength)
  };

  return {
    garmentType: 'tshirt',
    garmentStyle: style,
    pieces: [frontPiece, backPiece, sleevePiece],
    totalFabric: calculateFabricRequirement([frontPiece, backPiece, sleevePiece]),
    difficulty: 'Principiante',
    instructions: [
      'Colocar la tela doblada a lo ancho',
      'Ubicar el patrón delantero y trasero sobre el doblez',
      'Cortar dejando 1cm para costuras',
      'Para las mangas, cortar dos piezas espejo',
      'Unir hombros primero, luego mangas al cuerpo'
    ]
  };
};

// ✅ VERSIÓN CORREGIDA - generateTShirtFrontPaths
const generateTShirtFrontPaths = (
  width: number,
  length: number,
  neckType: 'round' | 'v-neck'
): PathPoint[] => {
  const neckDepth = neckType === 'round' ? width * 0.08 : width * 0.15;
  
  if (neckType === 'round') {
    return [
      // Comenzar desde el centro del escote
      { x: width / 2, y: 0, type: 'move' },
      
      // Escote redondo - lado izquierdo
      { x: width * 0.2, y: neckDepth, type: 'curve' },
      { x: 0, y: neckDepth * 2, type: 'curve' },
      
      // Lateral izquierdo
      { x: 0, y: length * 0.7, type: 'line' },
      
      // Dobladillo izquierdo
      { x: width * 0.1, y: length, type: 'curve' },
      { x: width * 0.4, y: length, type: 'curve' },
      
      // Centro del dobladillo
      { x: width / 2, y: length, type: 'line' },
      
      // Dobladillo derecho
      { x: width * 0.6, y: length, type: 'curve' },
      { x: width * 0.9, y: length, type: 'curve' },
      
      // Lateral derecho
      { x: width, y: length * 0.7, type: 'line' },
      
      // Escote redondo - lado derecho
      { x: width, y: neckDepth * 2, type: 'curve' },
      { x: width * 0.8, y: neckDepth, type: 'curve' },
      
      // Volver al centro del escote
      { x: width / 2, y: 0, type: 'line' },
    ];
  } else {
    // Escote en V
    return [
      // Comenzar desde el centro del escote
      { x: width / 2, y: 0, type: 'move' },
      
      // Escote en V - lado izquierdo
      { x: width * 0.3, y: neckDepth, type: 'line' },
      { x: 0, y: neckDepth * 1.5, type: 'line' },
      
      // Lateral izquierdo
      { x: 0, y: length * 0.7, type: 'line' },
      
      // Dobladillo izquierdo
      { x: width * 0.1, y: length, type: 'curve' },
      { x: width * 0.4, y: length, type: 'curve' },
      
      // Centro del dobladillo
      { x: width / 2, y: length, type: 'line' },
      
      // Dobladillo derecho
      { x: width * 0.6, y: length, type: 'curve' },
      { x: width * 0.9, y: length, type: 'curve' },
      
      // Lateral derecho
      { x: width, y: length * 0.7, type: 'line' },
      
      // Escote en V - lado derecho
      { x: width, y: neckDepth * 1.5, type: 'line' },
      { x: width * 0.7, y: neckDepth, type: 'line' },
      
      // Volver al centro del escote
      { x: width / 2, y: 0, type: 'line' },
    ];
  }
};

// ✅ VERSIÓN CORREGIDA - generateTShirtBackPaths
const generateTShirtBackPaths = (
  width: number,
  length: number
): PathPoint[] => {
  const neckDepth = width * 0.04;
  
  return [
    { x: width / 2, y: 0, type: 'move' },
    { x: width * 0.2, y: neckDepth, type: 'curve' },
    { x: 0, y: neckDepth * 1.5, type: 'curve' },
    { x: 0, y: length * 0.7, type: 'line' },
    { x: width * 0.1, y: length, type: 'curve' },
    { x: width * 0.4, y: length, type: 'curve' },
    { x: width / 2, y: length, type: 'line' },
    { x: width * 0.6, y: length, type: 'curve' },
    { x: width * 0.9, y: length, type: 'curve' },
    { x: width, y: length * 0.7, type: 'line' },
    { x: width, y: neckDepth * 1.5, type: 'curve' },
    { x: width * 0.8, y: neckDepth, type: 'curve' },
    { x: width / 2, y: 0, type: 'line' },
  ];
};

// ✅ VERSIÓN CORREGIDA - generateSleevePaths
const generateSleevePaths = (
  width: number,
  length: number
): PathPoint[] => {
  const capHeight = width * 0.4;
  
  return [
    { x: 0, y: length * 0.5, type: 'move' },
    { x: width * 0.2, y: 0, type: 'line' },
    { x: width * 0.5, y: -capHeight, type: 'line' },
    { x: width * 0.8, y: 0, type: 'line' },
    { x: width, y: length * 0.5, type: 'line' },
    { x: width * 0.9, y: length, type: 'line' },
    { x: width * 0.5, y: length * 1.05, type: 'line' },
    { x: width * 0.1, y: length, type: 'line' },
    { x: 0, y: length * 0.5, type: 'line' },
  ];
};

const calculateFabricRequirement = (pieces: PatternPiece[]): number => {
  const totalArea = pieces.reduce((area, piece) => {
    return area + (piece.boundingBox.width * piece.boundingBox.height);
  }, 0);
  
  // Cálculo más realista considerando ancho de tela
  return Math.ceil((totalArea / 10000) * 1.5);
};

// Placeholders se mantienen igual...
const generatePantsPattern = (measures: BodyMeasures, style: GarmentStyle): GeneratedPattern => {
  return {
    garmentType: 'pants',
    garmentStyle: style,
    pieces: [],
    totalFabric: 2.0,
    difficulty: 'Intermedio',
    instructions: ['Patrón de pantalón - En desarrollo']
  };
};

const generateDressPattern = (measures: BodyMeasures, style: GarmentStyle): GeneratedPattern => {
  return {
    garmentType: 'dress',
    garmentStyle: style,
    pieces: [],
    totalFabric: 3.0,
    difficulty: 'Avanzado',
    instructions: ['Patrón de vestido - En desarrollo']
  };
};

const generateSkirtPattern = (measures: BodyMeasures, style: GarmentStyle): GeneratedPattern => {
  return {
    garmentType: 'skirt',
    garmentStyle: style,
    pieces: [],
    totalFabric: 1.5,
    difficulty: 'Principiante',
    instructions: ['Patrón de falda - En desarrollo']
  };
};