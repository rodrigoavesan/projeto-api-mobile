// Tela de MAIS DETALHES: busca na API os dados completos do personagem selecionado.
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, ActivityIndicator, Divider } from 'react-native-paper';
import { fetchCharacterDetails } from '../services/swapi';
import CharacterImage from '../components/CharacterImage';
import ScreenBackground from '../components/ScreenBackground';

// Bloco reutilizável que mostra um título e uma lista de itens
function Section({ title, items }) {
  return (
    <View style={styles.section}>
      <Text variant="titleMedium" style={styles.sectionTitle}>{title}</Text>
      {items.length === 0 ? <Text>Nenhum.</Text> : items.map((i, idx) => <Text key={idx}>• {i}</Text>)}
    </View>
  );
}

export default function DetailsScreen({ route }) {
  const { id } = route.params;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCharacterDetails(id).then(setData).catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <ScreenBackground>
        <Text style={[styles.center, { color: '#fff' }]}>{error}</Text>
      </ScreenBackground>
    );
  }
  if (!data) {
    return (
      <ScreenBackground>
        <ActivityIndicator style={styles.center} size="large" />
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <CharacterImage sources={data.imageSources} style={styles.image} fit="contain" />

        {/* Painel claro por cima do fundo escuro, para o texto continuar legível */}
        <View style={styles.panel}>
          <Text variant="headlineMedium" style={styles.name}>{data.name}</Text>
          <Divider style={{ marginVertical: 12 }} />
          <Text>Gênero: {data.gender}</Text>
          <Text>Nascimento: {data.birthYear}</Text>
          <Text>Planeta natal: {data.homeworld}</Text>
          <Text>Altura: {data.height} cm | Massa: {data.mass} kg</Text>
          <Text>Cabelo: {data.hairColor} | Pele: {data.skinColor} | Olhos: {data.eyeColor}</Text>
          <Section title="Filmes" items={data.filmList} />
          <Section title="Espécies" items={data.speciesList} />
          <Section title="Veículos" items={data.vehicleList} />
          <Section title="Naves" items={data.starshipList} />
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { marginTop: 40, textAlign: 'center' },
  image: { width: '100%', height: 380, marginBottom: 12, backgroundColor: '#111', borderRadius: 8 },
  panel: { backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 12, padding: 16 },
  name: { fontWeight: 'bold' },
  section: { marginTop: 16 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 4 },
});