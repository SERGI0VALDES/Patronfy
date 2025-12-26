// components/ExitAnimation/ParticleAnimation.tsx
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
interface ParticleAnimationProps {
  onFinish?: () => void;
}

const ParticleAnimation: React.FC<ParticleAnimationProps> = ({ onFinish }) => {

  const particles = useRef(
    Array.from({ length: 50 }, () => ({
      x: useRef(new Animated.Value(0)).current,
      y: useRef(new Animated.Value(0)).current,
      scale: useRef(new Animated.Value(0)).current,
      opacity: useRef(new Animated.Value(0)).current,
      rotation: useRef(new Animated.Value(0)).current,
    }))
  ).current;

  const logoScale = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación del logo
    Animated.spring(logoScale, {
      toValue: 1,
      tension: 100,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Explosión de partículas
    const particleAnimations = particles.map((particle, index) => {
      const angle = (index * 2 * Math.PI) / particles.length;
      const distance = 150 + Math.random() * 100;
      
      return Animated.sequence([
        Animated.delay(index * 20),
        Animated.parallel([
          Animated.timing(particle.x, {
            toValue: Math.cos(angle) * distance,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: Math.sin(angle) * distance,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(particle.opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(particle.rotation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1000),
        Animated.parallel([
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    // Texto
    Animated.sequence([
      Animated.delay(800),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Ejecutar todas las animaciones
    Animated.parallel([
      Animated.stagger(20, particleAnimations),
    ]).start(() => {
      // Esperamos un segundo extra para que se vea el texto "Hasta luego"
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 2000); 
    });
  }, []);

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
    <View style={styles.container}>
      {/* Logo central */}
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
        <View style={styles.logo}>
          <View style={styles.logoScissors} />
          <View style={styles.logoNeedle} />
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
        <Animated.Text style={styles.text}>Hasta luego</Animated.Text>
        <Animated.Text style={styles.subtext}>
          Tu creatividad te espera
        </Animated.Text>
        <View style={styles.sparkleContainer}>
          {[...Array(3)].map((_, i) => (
            <Animated.Text 
              key={i} 
              style={[
                styles.sparkle,
                { 
                  opacity: textOpacity,
                  transform: [{
                    rotate: textOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', `${i * 120}deg`],
                    }),
                  }],
                },
              ]}
            >
              ✨
            </Animated.Text>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: '#FFF',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoScissors: {
    width: 40,
    height: 40,
    borderLeftWidth: 15,
    borderLeftColor: '#FF6B6B',
    borderRightWidth: 15,
    borderRightColor: '#4ECDC4',
    borderTopWidth: 2,
    borderTopColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  logoNeedle: {
    position: 'absolute',
    width: 30,
    height: 2,
    backgroundColor: '#FFD700',
    transform: [{ rotate: '-45deg' }],
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
  },
  subtext: {
    color: '#CCC',
    fontSize: 18,
    marginBottom: 20,
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