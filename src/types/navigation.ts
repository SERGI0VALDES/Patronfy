// types/navigation.ts
import { TipoPrenda,
         MedidasPlayeraHombre
 } from './medidas'; // Importa el mismo

export interface PiezaSVG {
  id: string;
  nombre: string;
  d: string;
  medidasInfo?: string;
  instrucciones?: string[];
}

export interface PatronGuardado {
  id: string;
  nombre: string;
  nombreCliente: string;
  tipoPrenda: string;
  fechaCreacion: string;
  piezas: PiezaSVG[];
  categoria: string; // <--- AGREGA ESTA LÍNEA
  instrucciones: string[];
  estiloPrenda: any; // Aquí puedes ser más específico si tienes el tipo EstiloPrenda
  totalTela: number;
  dificultad: string;
  medidas?: any;
}

// 1. Unificamos todas las posibles medidas en un solo tipo
export type MedidasDePrenda = MedidasPlayeraHombre /* | MedidasPantalonHombre */;

// 2. Definimos el estilo estético de la prenda
export type EstiloPrenda = {
  tipoCuello: 'redondo' | 'en_v';
  tipoManga: 'corta' | 'larga';
};

// 4. Definición de las rutas de navegación
export type ListaParametrosNavegacion = {
  Home: undefined;
  Biblioteca: undefined;
  SeleccionPrendas: undefined;

  // Pantalla para ingresar medidas (recibe qué prenda vamos a medir)
  MedidaEntrada: { tipoPrenda: TipoPrenda };

  // El Visor puede recibir medidas nuevas para generar un trazo
  // O un patrón ya existente de la base de datos
  VisorPatrones: { 
    medidas?: MedidasDePrenda; 
    tipoPrenda?: TipoPrenda;
    estiloPrenda?: EstiloPrenda;
    patronGuardado?: PatronGuardado;
  };

  PerfilCliente?: { photoUri?: string, clienteId?: string };
  LoginRegister: undefined;
  SeleccionEntrada: undefined; 
  CameraScreen: { comingFrom: string; clienteId?: string };
  MisClientes: undefined;
  LogoutAnimation: undefined;
};