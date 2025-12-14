// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GeneratedPattern } from './patternGenerator';

const PATTERNS_KEY = 'saved_patterns';

export interface SavedPattern extends GeneratedPattern {
  id: string;
  name: string;
  createdAt: string;
  clientName?: string;
}

export const savePatternToLibrary = async (pattern: GeneratedPattern, name: string, clientName?: string): Promise<void> => {
  try {
    const savedPattern: SavedPattern = {
      ...pattern,
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      clientName
    };

    const existingPatterns = await getSavedPatterns();
    const updatedPatterns = [...existingPatterns, savedPattern];
    
    await AsyncStorage.setItem(PATTERNS_KEY, JSON.stringify(updatedPatterns));
  } catch (error) {
    console.error('Error saving pattern:', error);
    throw new Error('No se pudo guardar el patrón');
  }
};

export const getSavedPatterns = async (): Promise<SavedPattern[]> => {
  try {
    const patternsJson = await AsyncStorage.getItem(PATTERNS_KEY);
    return patternsJson ? JSON.parse(patternsJson) : [];
  } catch (error) {
    console.error('Error loading patterns:', error);
    return [];
  }
};

export const deletePattern = async (patternId: string): Promise<void> => {
  try {
    const patterns = await getSavedPatterns();
    const updatedPatterns = patterns.filter(pattern => pattern.id !== patternId);
    await AsyncStorage.setItem(PATTERNS_KEY, JSON.stringify(updatedPatterns));
  } catch (error) {
    console.error('Error deleting pattern:', error);
    throw new Error('No se pudo eliminar el patrón');
  }
};