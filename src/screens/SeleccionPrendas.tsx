// src\screens\SeleccionPrendas.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Importamos los tipos unificados
import { ListaParametrosNavegacion } from '../types/navigation';
import { TipoPrenda } from '../types/medidas';

type SeleccionPrendasNavProp = StackNavigationProp<ListaParametrosNavegacion, 'SeleccionPrendas'>;

const SeleccionPrendas: React.FC = () => {
  const navegacion = useNavigation<SeleccionPrendasNavProp>();
  const [prendaSeleccionada, setPrendaSeleccionada] = useState<TipoPrenda | null>(null);

  // 1. Catálogo alineado con las llaves de CAMPOS_POR_PRENDA
  const prendasDisponibles = [
    { id: 'playera_hombre' as TipoPrenda, nombre: 'Playera Hombre', desc: 'Corte recto tradicional', icono: '👕' },
    { id: 'blusa_mujer' as TipoPrenda, nombre: 'Blusa Mujer', desc: 'Ajuste femenino con pinzas', icono: '👚' },
    { id: 'pantalon_hombre' as TipoPrenda, nombre: 'Pantalón Hombre', desc: 'Corte recto formal/casual', icono: '👖' },
    { id: 'falda_basica' as TipoPrenda, nombre: 'Falda Básica', desc: 'Falda de tubo o línea A', icono: '👗' },
  ];

  const prendasBloqueadas = [
    { nombre: 'Saco Formal', icono: '🧥' },
    { nombre: 'Vestido Gala', icono: '💃' },
    { nombre: 'Overol Trabajo', icono: '👷' },
  ];

  const manejarContinuar = () => {
    if (prendaSeleccionada) {
      // Pasamos 'tipoPrenda' en español a MedidaEntrada
      navegacion.navigate('MedidaEntrada', { tipoPrenda: prendaSeleccionada });
    }
  };

  return (
    <View style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.contenidoScroll}>
        <Text style={styles.tituloPrincipal}>Diseño de Patrón</Text>
        <Text style={styles.subtitulo}>¿Qué vamos a confeccionar hoy?</Text>

        <View style={styles.cuadricula}>
          {prendasDisponibles.map((prenda) => (
            <TouchableOpacity
              key={prenda.id}
              style={[
                styles.tarjeta,
                prendaSeleccionada === prenda.id && styles.tarjetaSeleccionada
              ]}
              onPress={() => setPrendaSeleccionada(prenda.id)}
            >
              <Text style={styles.iconoTarjeta}>{prenda.icono}</Text>
              <Text style={styles.nombreTarjeta}>{prenda.nombre}</Text>
              <Text style={styles.descTarjeta}>{prenda.desc}</Text>

            </TouchableOpacity>
          ))}
        </View>

        {/* Sección Premium con Difuminado */}
        <View style={styles.seccionBloqueada}>
          <Text style={styles.tituloBloqueado}>Catálogo Premium</Text>
          <View style={styles.cuadriculaDeshabilitada}>
             {prendasBloqueadas.map((p, i) => (
               <View key={i} style={styles.tarjetaDeshabilitada}>
                 <Text style={styles.iconoDeshabilitado}>{p.icono}</Text>
                 <Text style={styles.nombreDeshabilitado}>{p.nombre}</Text>
               </View>
             ))}
             <View style={styles.capaOverlay}>
                <TouchableOpacity style={styles.botonDesbloquear}>
                  <Text style={styles.textoBotonDesbloquear}>Desbloquear más patrones</Text>
                </TouchableOpacity>
             </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón de Continuar (Solo aparece si hay selección) */}
      {prendaSeleccionada && (
        <View style={styles.piePagina}>
          <TouchableOpacity style={styles.botonSiguiente} onPress={manejarContinuar}>
            <Text style={styles.textoBotonSiguiente}>Continuar a Medidas</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#121212' },
  contenidoScroll: { padding: 20, paddingBottom: 110 },
  tituloPrincipal: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  subtitulo: { fontSize: 16, color: '#aaa', marginBottom: 25 },
  cuadricula: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tarjeta: {
    width: '48%',
    backgroundColor: '#1e1e1e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  tarjetaSeleccionada: { borderColor: '#007AFF', backgroundColor: '#1a2a40' },
  iconoTarjeta: { fontSize: 32, marginBottom: 10 },
  nombreTarjeta: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  descTarjeta: { fontSize: 12, color: '#777', marginTop: 5 },
  
  seccionBloqueada: { marginTop: 30 },
  tituloBloqueado: { fontSize: 18, fontWeight: 'bold', color: '#555', marginBottom: 15 },
  cuadriculaDeshabilitada: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', position: 'relative' },
  tarjetaDeshabilitada: { 
    width: '48%', 
    backgroundColor: '#181818', 
    borderRadius: 15, 
    padding: 20, 
    marginBottom: 15,
    opacity: 0.2 
  },
  iconoDeshabilitado: { fontSize: 32 },
  nombreDeshabilitado: { fontSize: 16, color: '#444' },
  capaOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 18, 18, 0.4)',
    borderRadius: 15,
  },
  botonDesbloquear: {
    backgroundColor: '#222',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#444',
  },
  textoBotonDesbloquear: { color: '#fff', fontWeight: 'bold' },

  piePagina: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    padding: 20, 
    backgroundColor: 'rgba(18, 18, 18, 0.95)' 
  },
  botonSiguiente: { 
    backgroundColor: '#007AFF', 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center' 
  },
  textoBotonSiguiente: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default SeleccionPrendas;