import AsyncStorage from '@react-native-async-storage/async-storage';
import { PatronGuardado } from '../types/navigation';

// Usamos el mismo nombre que tienes en Biblioteca para consistencia
const LLAVE_PATRONES = '@biblioteca_cache';

/**
 * Guarda un patrón nuevo en el almacenamiento local del teléfono.
 */
export const guardarPatronLocal = async (nuevoPatron: PatronGuardado): Promise<void> => {
  try {
    const patronesExistentes = await obtenerPatronesLocales();
    
    // Verificamos si el patrón ya existe para no duplicarlo (por ID)
    const existe = patronesExistentes.find(p => p.id === nuevoPatron.id);
    let patronesActualizados;

    if (existe) {
      patronesActualizados = patronesExistentes.map(p => 
        p.id === nuevoPatron.id ? nuevoPatron : p
      );
    } else {
      patronesActualizados = [nuevoPatron, ...patronesExistentes];
    }
    
    await AsyncStorage.setItem(LLAVE_PATRONES, JSON.stringify(patronesActualizados));
  } catch (error) {
    console.error('Error al guardar localmente:', error);
    throw new Error('No se pudo guardar el patrón en el dispositivo');
  }
};

/**
 * Obtiene la lista de todos los patrones guardados en el teléfono.
 */
export const obtenerPatronesLocales = async (): Promise<PatronGuardado[]> => {
  try {
    const patronesJson = await AsyncStorage.getItem(LLAVE_PATRONES);
    return patronesJson ? JSON.parse(patronesJson) : [];
  } catch (error) {
    console.error('Error al cargar patrones locales:', error);
    return [];
  }
};

/**
 * Elimina un patrón por su ID del almacenamiento local.
 */
export const eliminarPatronLocal = async (idPatron: string): Promise<void> => {
  try {
    const patrones = await obtenerPatronesLocales();
    const patronesActualizados = patrones.filter(p => p.id !== idPatron);
    await AsyncStorage.setItem(LLAVE_PATRONES, JSON.stringify(patronesActualizados));
  } catch (error) {
    console.error('Error al eliminar patrón local:', error);
    throw new Error('No se pudo eliminar el patrón del dispositivo');
  }
};

/**
 * (Opcional) Limpia toda la biblioteca local
 */
export const limpiarBibliotecaLocal = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(LLAVE_PATRONES);
  } catch (error) {
    console.error('Error al limpiar biblioteca:', error);
  }
};