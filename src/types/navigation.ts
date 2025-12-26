// types/navigation.ts

// Definimos todos los tipos aquí para simplicidad
export type BodyMeasures = {
  chest: number;
  waist: number;
  hips: number;
  torsoLength: number;
  shoulderWidth: number;
  armLength: number;
  neckCircumference: number;
};

export type GarmentType = 'tshirt' | 'pants' | 'dress' | 'skirt';
export type GarmentStyle = {
  neckType: 'round' | 'v-neck';
  sleeveType: 'short' | 'long';
};

export type RootStackParamList = {
  Home: undefined;
  Biblioteca: undefined;
  MedidaEntrada: undefined;
  SeleccionPrendas: { 
    measures: BodyMeasures;
    garmentType?: GarmentType;
    garmentStyle?: GarmentStyle;
  };
  VisorPatrones: { 
    measures: BodyMeasures;
    garmentType: GarmentType;
    garmentStyle: GarmentStyle;
  };
  PerfilCliente: undefined;
  LoginRegister: undefined;
  SeleccionEntrada: undefined; 
  CameraScreen: undefined;
  MisClientes: undefined;
  LogoutAnimation: undefined;
};