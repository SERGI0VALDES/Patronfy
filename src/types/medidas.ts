// types/measures.ts
export type BodyMeasures = {
  chest: number;
  waist: number;
  hips: number;
  torsoLength: number;
  shoulderWidth: number;
  armLength: number;
  neckCircumference: number;
  // Agrega más medidas según tu documento funcional
};

export type GarmentType = 'tshirt' | 'pants' | 'dress' | 'skirt';
export type GarmentStyle = {
  neckType: 'round' | 'v-neck';
  sleeveType: 'short' | 'long';
};