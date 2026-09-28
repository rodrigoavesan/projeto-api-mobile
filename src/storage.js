// Persistência local. No React Native o "LocalStorage" é o AsyncStorage.
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@starwars_app:user';
const CARDS_KEY = '@starwars_app:cards';

export async function saveUser(user) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser() {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveCards(cards) {
  await AsyncStorage.setItem(CARDS_KEY, JSON.stringify(cards));
}

export async function getCards() {
  const raw = await AsyncStorage.getItem(CARDS_KEY);
  return raw ? JSON.parse(raw) : [];
}
