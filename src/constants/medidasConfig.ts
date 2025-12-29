import { TipoPrenda } from '../types/medidas';

// 1. Diccionario Maestro de Etiquetas
// Aquí definimos cómo se lee cada variable en la interfaz de usuario
export const ETIQUETAS_MEDIDAS: Record<string, string> = {
  // Playera Hombre Frente
  anchoEspalda: "Ancho de espalda",
  largoTalleFrente: "Largo de Talle Frente",
  largoTotal: "Largo Total",
  contornoPecho: "Contorno de Pecho",
  contornoCuello: "Contorno de Cuello (Con Holgura)",
  largoEscote: "Largo de Escote",
  hombro: "Largo de hombro",
  // Playera Hombre Trasero
  espaldaEscote: "Largo de Escote Espalda",
  // Playera Hombre Manga
  largoManga: "Largo de la manga",
  anchoPuño: "Ancho de Puño (Con Holgura)",
  mitadTalleFrente: "Mitad de Talla de Frente (Manga)",
  CSisa: "Caída de Sisa",

  // Inferiores (Pantalón/Falda)
  contornoCintura: "Contorno de Cintura",
  contornoCadera: "Contorno de Cadera",
  altoCadera: "Altura de Cadera",
  entrepierna: "Largo de Entrepierna",
  largoRodilla: "Largo a la Rodilla",
  anchoRodilla: "Ancho de Rodilla",
  anchoBajo: "Ancho de la Base (Bajo)",
  tiro: "Largo de Tiro",
  bajadaCadera: "Bajada de Cadera",
  bajadaTiro: "Altura de Tiro",
  largoFaldaDelantero: "Largo Falda (Frente)",
  largoFaldaLateral: "Largo Falda (Costado)",
  largoFaldaTrasero: "Largo Falda (Espalda)",
};

// 2. Configuración de qué campos pide cada prenda
// Esto servirá para renderizar los inputs dinámicamente
export const CAMPOS_POR_PRENDA: Record<TipoPrenda, string[]> = {
  playera_hombre: [
    'anchoEspalda', 'largoTalleFrente', 'largoTotal', 'contornoPecho',
    'contornoCuello', 'largoEscote', 'hombro', 'espaldaEscote', 
    'largoManga', 'anchoPuño', "mitadTalleFrente", "CSisa"
  ],
  pantalon_hombre: [
    'contornoCintura', 'contornoCadera', 'largoTotal', 'entrepierna', 
    'largoRodilla', 'tiro', 'anchoBajo', 'bajadaCadera'
  ],
  blusa_mujer: [
    'contornoBusto', 'talleDelantero', 'talleEspalda', 'altoBusto', 
    'separacionBusto', 'anchoEspalda', 'largoTotal', 'contornoCintura'
  ],
  falda_basica: [
    'contornoCintura', 'contornoCadera', 'altoCadera', 
    'largoFaldaDelantero', 'largoFaldaLateral', 'largoFaldaTrasero'
  ],
};
