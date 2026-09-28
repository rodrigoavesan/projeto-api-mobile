// Imagem do personagem. Se não carregar, mostra um aviso no lugar.
import React, { useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function CharacterImage({ uri, style, fit = 'cover' }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <View style={[style, styles.placeholder]}>
        <Text style={{ color: '#FFE81F' }}>Imagem indisponível</Text>
      </View>
    );
  }
  return <Image source={{ uri }} style={style} resizeMode={fit} onError={() => setFailed(true)} />;
}

const styles = StyleSheet.create({
  placeholder: { backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
});
