// types/medidas.ts

// Definimos las medidas de una playera basica de hombre
export type MedidasPlayeraHombre = {
  // Playera Hombre Frente
  anchoEspalda: number,
  largoTalleFrente: number,
  largoTotal: number,
  contornoPecho: number,
  contornoCuello: number,
  largoEscote: number,
  hombro: number,
  // Playera Hombre Trasero
  espaldaEscote: number,
  // Playera Hombre Manga
  largoManga: number,
  anchoPuño: number,
  mitadTalleFrente: number,
  CSisa: number,
};

// Definimos las medidas de un Pantalon Recto Hombre
export type MedidasPantalonRectoHombre = {
  contornoCintura: number;     // Contorno de cintura
  contornoCadera: number;      // Contorno de cadera
  largoTotal: number;          // Largo desde la cintura hasta el dobladillo
  entrepierna: number;         // Desde la sisa hasta el interior del muslo
  largoRodilla: number;        // Desde la cintura hasta la altura de la rodilla
  anchoBajo: number;           // Ancho del dobladillo (bajo del pantalón)
  tiro: number;                // Profundidad de la sisa (MTE o caja)
  anchoRodilla: number;        // Ancho a la altura de la rodilla
  bajadaCadera: number;        // Distancia vertical desde la cintura hasta la cadera
  bajadaTiro: number;          // Altura vertical desde la cintura hasta la sisa
};

// Definimos las medidas de una Blusa de Mujer
export type MedidasBlusaBasicaMujer = {
  contornoBusto: number;        // 1/4 del total para el trazado
  talleDelantero: number;       // Desde la base del cuello hasta la cintura
  talleEspalda: number;         // Desde la séptima vértebra hasta la cintura
  altoBusto: number;            // Desde el hombro hasta el pezón
  separacionBusto: number;      // Distancia entre ambos pezones
  anchoEspalda: number;         // 1/2 del contorno de espalda
  largoTotal: number;           // Desde el hombro hasta el dobladillo
  contornoCuello: number;       // Para calcular escote
  anchoHombro: number;          // Desde el cuello hasta el final del hombro
  largoManga: number;           // Desde el hombro hasta la muñeca
  contornoPuño: number;         // Alrededor de la muñeca
  contornoCintura: number;      // 1/4 del total para el patrón
}

// Definimos las medidas de una falda
export type MedidasFaldaRectaBasica = {
  contornoCintura: number;     // Contorno total de la cintura
  contornoCadera: number;      // Contorno total de la cadera
  altoCadera: number;          // Distancia desde la cintura hasta la línea de cadera
  largoFaldaDelantero: number; // Largo desde la cintura hasta el dobladillo en la parte delantera
  largoFaldaLateral: number;   // Largo desde la cintura hasta el dobladillo en el costado
  largoFaldaTrasero: number;   // Largo desde la cintura hasta el dobladillo en la espalda
};

export type MedidasDePrenda = 
  | MedidasPlayeraHombre 
  | MedidasPantalonRectoHombre 
  | MedidasBlusaBasicaMujer 
  | MedidasFaldaRectaBasica;

// Tipos de prenda en español para ser coherentes
export type TipoPrenda = 'playera_hombre' | 'pantalon_hombre' | 'blusa_mujer' | 'falda_basica';
