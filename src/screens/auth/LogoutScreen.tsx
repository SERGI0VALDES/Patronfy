import React from 'react';
import { View, StyleSheet } from 'react-native';
import ParticleAnimation from '../../components/animations/ParticleAnimation';
import { useAuth } from '../../context/AuthContext';

const LogoutScreen = () => {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <ParticleAnimation onFinish={() => logout()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' }
});

export default LogoutScreen;