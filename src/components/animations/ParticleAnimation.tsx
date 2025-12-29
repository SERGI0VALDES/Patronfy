// components/ExitAnimation/ParticleAnimation.tsx
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated, 
  Image,
  ImageSourcePropType 
} from 'react-native';

interface ParticleAnimationProps {
  onFinish?: () => void;
  logoImage?: ImageSourcePropType;
  duration?: number;
}

const ParticleAnimation: React.FC<ParticleAnimationProps> = ({ 
  onFinish,
  logoImage,
}) => {

  // Si no se pasa imagen, usa una por defecto
  const defaultLogo = require('../../assets/images/logo.png');
  const currentLogo = logoImage || defaultLogo;

  // REDUCIDO de 50 a 30 partículas para mejor performance
  const particles = useRef(
    Array.from({ length: 30 }, () => ({
      x: useRef(new Animated.Value(0)).current,
      y: useRef(new Animated.Value(0)).current,
      scale: useRef(new Animated.Value(0)).current,
      opacity: useRef(new Animated.Value(0)).current,
      rotation: useRef(new Animated.Value(0)).current,
    }))
  ).current;

  const logoScale = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // ARRAY para almacenar TODAS las animaciones
    const allAnimations: Animated.CompositeAnimation[] = [];
    
    // 1. Animación del logo (más rápida)
    const logoAnimation = Animated.spring(logoScale, {
      toValue: 1,
      tension: 100,
      friction: 7,
      useNativeDriver: true,
    });
    allAnimations.push(logoAnimation);

    // 2. Animación de partículas optimizada
    particles.forEach((particle, index) => {
      const angle = (index * 2 * Math.PI) / particles.length;
      const distance = 150 + Math.random() * 100;
      
      // Crear la animación COMPLETA de cada partícula
      const particleAnimation = Animated.sequence([
        // Retraso escalonado
        Animated.delay(index * 15), // REDUCIDO de 20 a 15
        // Explosión
        Animated.parallel([
          Animated.timing(particle.x, {
            toValue: Math.cos(angle) * distance,
            duration: 600, // Ajustado para sincronización
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: Math.sin(angle) * distance,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(particle.opacity, {
            toValue: 1,
            duration: 150, // Más rápido
            useNativeDriver: true,
          }),
          Animated.timing(particle.rotation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        // Mantener visible
        Animated.delay(800), // REDUCIDO de 1000 a 800
        // Desvanecer
        Animated.parallel([
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]);
      
      allAnimations.push(particleAnimation);
    });

    // 3. Animación del texto optimizada
    const textAnimation = Animated.sequence([
      // Aparece más rápido
      Animated.delay(600), // REDUCIDO de 800 a 600
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 300, // REDUCIDO de 500 a 300
        useNativeDriver: true,
      }),
      // Mantener visible
      Animated.delay(1000), // Tiempo que el texto permanece visible
      // Desvanecer
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]);
    allAnimations.push(textAnimation);

    // 4. Fade out del contenedor al final
    const fadeOutAnimation = Animated.sequence([
      Animated.delay(2200), // Comienza a desaparecer después de 2.2 segundos
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]);
    allAnimations.push(fadeOutAnimation);

    // EJECUTAR TODAS las animaciones en paralelo
    // Cuando TODAS terminen, llamar a onFinish INMEDIATAMENTE
    Animated.parallel(allAnimations).start(({ finished }) => {
      if (finished && onFinish) {
        onFinish(); // Se llama INMEDIATAMENTE al terminar
      }
    });

    // Limpieza
    return () => {
      particles.forEach(particle => {
        particle.x.stopAnimation();
        particle.y.stopAnimation();
        particle.scale.stopAnimation();
        particle.opacity.stopAnimation();
        particle.rotation.stopAnimation();
      });
      logoScale.stopAnimation();
      textOpacity.stopAnimation();
      containerOpacity.stopAnimation();
    };
  }, [onFinish]); // Añadido onFinish como dependencia

  const getParticleStyle = (index: number) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2'];
    const shapes = ['circle', 'square', 'triangle', 'diamond'];
    const color = colors[index % colors.length];
    const shape = shapes[index % shapes.length];

    return {
      backgroundColor: color,
      borderRadius: shape === 'circle' ? 10 : shape === 'diamond' ? 2 : 0,
      transform: shape === 'diamond' ? [{ rotate: '45deg' }] : [],
    };
  };

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      {/* Logo central CON IMAGEN */}
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
        <View style={styles.logoImageContainer}>
          {/* Usamos Image en lugar del logo de tijeras */}
          <Image 
            source={currentLogo}
            style={styles.logoImage}
            resizeMode="contain"
          />
          
          {/* Efecto de brillo/anillo alrededor */}
          <Animated.View style={[styles.logoGlow, { 
            opacity: logoScale.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.6, 0.3]
            }),
            transform: [{ scale: logoScale.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1.2]
            })}]
          }]} />
        </View>
      </Animated.View>

      {/* Partículas */}
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            getParticleStyle(index),
            {
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
                { rotate: particle.rotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                })},
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}

      {/* Texto */}
      <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
        <Animated.Text style={styles.text}>Hasta pronto!</Animated.Text>
        <Animated.Text style={styles.subtext}>
          Lo hiciste excelente el día de hoy!
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  logoContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  logoImageContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoImage: {
    width: '80%',
    height: '80%',
    borderRadius: 20,
    zIndex: 2,
  },
  logoGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  particle: {
    position: 'absolute',
    width: 20,
    height: 20,
  },
  textContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  text: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtext: {
    color: '#CCC',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  sparkleContainer: {
    flexDirection: 'row',
  },
  sparkle: {
    fontSize: 24,
    marginHorizontal: 5,
  },
});

export default ParticleAnimation;