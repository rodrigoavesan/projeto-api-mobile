// Tela de LOGIN: valida usuário/senha contra o cadastro salvo no AsyncStorage.
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { getUser } from '../storage';

export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  async function handleLogin() {
    const saved = await getUser();
    if (!saved) {
      Alert.alert('Atenção', 'Nenhum usuário cadastrado. Clique em "Cadastrar usuário".');
      return;
    }
    // O "usuário" pode ser o e-mail ou o nome cadastrado
    const u = usuario.trim().toLowerCase();
    const okUser = u === saved.email.toLowerCase() || u === saved.nome.toLowerCase();
    if (okUser && senha === saved.senha) {
      navigation.replace('Cards');
    } else {
      Alert.alert('Erro', 'Usuário ou senha incorretos.');
    }
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Projeto Star Wars</Text>
      <TextInput label="Usuário (nome ou e-mail)" mode="outlined" value={usuario}
        onChangeText={setUsuario} autoCapitalize="none" style={styles.input} />
      <TextInput label="Senha" mode="outlined" value={senha}
        onChangeText={setSenha} secureTextEntry style={styles.input} />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>ENTRAR</Button>
      <Button mode="outlined" onPress={() => navigation.navigate('Register')} style={styles.button}>
        CADASTRAR USUÁRIO
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { textAlign: 'center', marginBottom: 24, fontWeight: 'bold', color: '#111' },
  input: { marginBottom: 12 },
  button: { marginTop: 8 },
});
