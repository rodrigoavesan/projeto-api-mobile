// Tela de MAIS DETALHES: busca na API os dados completos do personagem selecionado.
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, ActivityIndicator, Divider } from 'react-native-paper';
import { fetchCharacterDetails } from '../services/swapi';
import CharacterImage from '../components/CharacterImage';

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

  if (error) return <Text style={styles.center}>{error}</Text>;
  if (!data) return <ActivityIndicator style={styles.center} size="large" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CharacterImage uri={data.image} style={styles.image} fit="contain" />
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { marginTop: 40, textAlign: 'center' },
  image: { width: '100%', height: 400, marginBottom: 12, backgroundColor: '#111' },
  name: { fontWeight: 'bold' },
  section: { marginTop: 16 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 4 },
});
