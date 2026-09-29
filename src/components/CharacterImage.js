// Imagem do personagem. Tenta cada fonte da lista em ordem; se uma falhar, tenta a próxima.
// Se todas falharem, mostra um aviso no lugar da imagem.
import React, { useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function CharacterImage({ sources, style, fit = 'cover' }) {
  const [index, setIndex] = useState(0);

  if (index >= sources.length) {
    return (
      <View style={[style, styles.placeholder]}>
        <Text style={{ color: '#FFE81F' }}>Imagem indisponível</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: sources[index] }}
      style={style}
      resizeMode={fit}
      onError={() => setIndex((i) => i + 1)} // essa fonte falhou, tenta a próxima
    />
  );
}

const styles = StyleSheet.create({
  placeholder: { backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
});