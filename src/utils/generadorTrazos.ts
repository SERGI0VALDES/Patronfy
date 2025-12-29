// utils/generadorTrazos.ts
import { TipoPrenda, MedidasDePrenda } from '../types/medidas';
import { generarTrazoPlayera } from '../utils/trazos/playera';
//import { generarTrazoPantalon } from '../utils/trazos/pantalon';
//import { generarTrazoFalda } from '../utils/trazos/falda';
//import { generarTrazoBlusa } from '../utils/trazos/blusa';

export const obtenerPuntosPatron = (tipo: TipoPrenda, medidas: any, estilo?: any) => {
  switch (tipo) {
    case 'playera_hombre':
      return generarTrazoPlayera(medidas, estilo);
    /*case 'pantalon_hombre':
      return generarTrazoPantalon(medidas);
    case 'falda_basica':
      return generarTrazoFalda(medidas);
    case 'blusa_mujer':
      return generarTrazoBlusa(medidas);*/
    default:
      throw new Error(`Tipo de prenda ${tipo} no soportado aún.`);
  }
};