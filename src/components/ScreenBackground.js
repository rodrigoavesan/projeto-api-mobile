// Fundo de tela reutilizável: mostra a logo da Star Wars atrás do conteúdo,
// com uma camada escura por cima para os textos e campos continuarem legíveis.
import React from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';

export default function ScreenBackground({ children, dim = 0.55 }) {
  return (
    <ImageBackground
      source={require('../assets/star-wars-logo.webp')}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={[styles.overlay, { backgroundColor: `rgba(0,0,0,${dim})` }]}>
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1 },
});