// Tela de CARDS: adiciona personagens da Star Wars API buscando pelo nome, permite excluir e ver detalhes.
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert, Pressable } from 'react-native';
import { Card, Button, Text, ActivityIndicator, Modal, Portal, TextInput } from 'react-native-paper';
import { searchCharacters } from '../services/swapi';
import { getCards, saveCards } from '../storage';
import CharacterImage from '../components/CharacterImage';
import ScreenBackground from '../components/ScreenBackground';

export default function CardsScreen({ navigation }) {
  const [cards, setCards] = useState([]);

  // estado do modal de busca
  const [modalVisible, setModalVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  // Ao abrir a tela, recupera os cards salvos anteriormente
  useEffect(() => {
    getCards().then(setCards);
  }, []);

  // Atualiza o estado e persiste no armazenamento local
  function updateCards(newCards) {
    setCards(newCards);
    saveCards(newCards);
  }

  function openModal() {
    setQuery('');
    setResults([]);
    setSearched(false);
    setModalVisible(true);
  }

  // Busca na API os personagens que batem com o nome digitado
  async function handleSearch() {
    if (!query.trim()) return;
    try {
      setSearching(true);
      const encontrados = await searchCharacters(query);
      setResults(encontrados);
      setSearched(true);
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setSearching(false);
    }
  }

  // Adiciona o personagem escolhido no topo da lista de cards
  function handlePick(personagem) {
    if (cards.some((c) => c.id === personagem.id)) {
      Alert.alert('Atenção', 'Esse personagem já está na sua lista.');
      return;
    }
    updateCards([personagem, ...cards]);
    setModalVisible(false);
  }

  // EXCLUIR: remove o card da lista
  function handleDelete(id) {
    updateCards(cards.filter((c) => c.id !== id));
  }

  function renderCard({ item }) {
    return (
      <Card style={styles.card}>
        <CharacterImage sources={item.imageSources} style={styles.image} />
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

  function renderResult({ item }) {
    const jaAdicionado = cards.some((c) => c.id === item.id);
    return (
      <Pressable onPress={() => !jaAdicionado && handlePick(item)} disabled={jaAdicionado}>
        <View style={[styles.resultRow, jaAdicionado && styles.resultRowDisabled]}>
          <Text style={styles.resultName}>{item.name}</Text>
          <Text style={styles.resultInfo}>{jaAdicionado ? 'Já adicionado' : 'Toque para adicionar'}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <ScreenBackground dim={0.65}>
      <View style={styles.container}>
        <Button mode="contained" icon="plus" onPress={openModal} style={styles.add}>
          ADD
        </Button>

        <FlatList
          data={cards}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderCard}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum card ainda. Clique em ADD e busque um nome!</Text>}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
        <Text style={styles.attribution}>Dados: SWAPI (Star Wars API)</Text>

        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
            <Text variant="titleMedium" style={{ marginBottom: 12 }}>Buscar personagem</Text>
            <TextInput
              label="Nome (ex: Luke, Vader, Leia)"
              mode="outlined"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              autoFocus
              style={{ marginBottom: 8 }}
            />
            <Button mode="contained" onPress={handleSearch} disabled={searching} loading={searching}>
              BUSCAR
            </Button>

            {searching && <ActivityIndicator style={{ marginTop: 16 }} />}

            {!searching && searched && results.length === 0 && (
              <Text style={{ marginTop: 16 }}>Nenhum personagem encontrado com esse nome.</Text>
            )}

            <FlatList
              data={results}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderResult}
              style={{ marginTop: 12, maxHeight: 300 }}
            />
          </Modal>
        </Portal>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  add: { marginBottom: 8 },
  card: { marginBottom: 12, overflow: 'hidden' },
  image: { width: '100%', height: 260 },
  info: { marginTop: 8, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 32, color: '#fff' },
  attribution: { textAlign: 'center', fontSize: 11, color: '#ccc', marginTop: 4 },
  modal: { backgroundColor: 'white', margin: 24, padding: 20, borderRadius: 8 },
  resultRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  resultRowDisabled: { opacity: 0.4 },
  resultName: { fontSize: 16 },
  resultInfo: { fontSize: 12, color: '#666' },
});