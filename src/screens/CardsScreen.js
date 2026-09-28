// Tela de CARDS: lista personagens da Star Wars API, permite adicionar, excluir e ver detalhes.
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Button, Text, ActivityIndicator } from 'react-native-paper';
import { fetchRandomCharacter } from '../services/swapi';
import { getCards, saveCards } from '../storage';
import CharacterImage from '../components/CharacterImage';

export default function CardsScreen({ navigation }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ao abrir a tela, recupera os cards salvos anteriormente
  useEffect(() => {
    getCards().then(setCards);
  }, []);

  // Atualiza o estado e persiste no armazenamento local
  function updateCards(newCards) {
    setCards(newCards);
    saveCards(newCards);
  }

  // ADD: busca um personagem novo na API e coloca no topo da lista
  async function handleAdd() {
    try {
      setLoading(true);
      const novo = await fetchRandomCharacter(cards.map((c) => c.id));
      updateCards([novo, ...cards]);
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  }

  // EXCLUIR: remove o card da lista
  function handleDelete(id) {
    updateCards(cards.filter((c) => c.id !== id));
  }

  function renderCard({ item }) {
    return (
      <Card style={styles.card}>
        <CharacterImage uri={item.image} style={styles.image} />
        <Card.Title title={item.name} subtitle={`Nascimento: ${item.birthYear}`} />
        <Card.Content>
          <Text>Gênero: {item.gender} | Altura: {item.height} cm</Text>
          <Text style={styles.info}>
            Filmes: {item.films} | Naves: {item.starships} | Veículos: {item.vehicles}
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('Details', { id: item.id, name: item.name })}>
            VER MAIS DETALHES
          </Button>
          <Button textColor="#B00020" onPress={() => handleDelete(item.id)}>EXCLUIR</Button>
        </Card.Actions>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <Button mode="contained" icon="plus" onPress={handleAdd} disabled={loading} style={styles.add}>
        ADD
      </Button>
      {loading && <ActivityIndicator style={{ margin: 8 }} />}
      <FlatList
        data={cards}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderCard}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum card ainda. Clique em ADD!</Text>}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      <Text style={styles.attribution}>Dados: SWAPI (Star Wars API)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  add: { marginBottom: 8 },
  card: { marginBottom: 12, overflow: 'hidden' },
  image: { width: '100%', height: 260 },
  info: { marginTop: 8, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 32 },
  attribution: { textAlign: 'center', fontSize: 11, color: '#666', marginTop: 4 },
});
