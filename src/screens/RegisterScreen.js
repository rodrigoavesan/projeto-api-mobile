// Tela de CADASTRAR USUÁRIO: salva os dados localmente (AsyncStorage) e volta para o Login.
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { saveUser } from '../storage';
import ScreenBackground from '../components/ScreenBackground';

// Campos do formulário (label, chave no objeto, tipo de teclado)
const FIELDS = [
  { key: 'nome', label: 'Nome', keyboard: 'default' },
  { key: 'telefone', label: 'Telefone', keyboard: 'phone-pad' },
  { key: 'cpf', label: 'CPF', keyboard: 'numeric' },
  { key: 'email', label: 'E-mail', keyboard: 'email-address' },
  { key: 'curso', label: 'Curso', keyboard: 'default' },
  { key: 'senha', label: 'Senha', keyboard: 'default', secure: true },
];

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ nome: '', telefone: '', cpf: '', email: '', curso: '', senha: '' });

  async function handleSave() {
    // Validação simples: todos os campos são obrigatórios
    if (Object.values(form).some((v) => v.trim() === '')) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    // Validação de e-mail: precisa ter o formato texto@dominio.com
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!emailValido) {
      Alert.alert('Atenção', 'Digite um e-mail válido (ex: nome@email.com).');
      return;
    }

    await saveUser({ ...form, nome: form.nome.trim(), email: form.email.trim() });
    Alert.alert('Sucesso', 'Usuário cadastrado!');
    navigation.navigate('Login');
  }

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {FIELDS.map((f) => (
          <TextInput
            key={f.key}
            label={f.label}
            mode="outlined"
            value={form[f.key]}
            keyboardType={f.keyboard}
            secureTextEntry={!!f.secure}
            autoCapitalize={f.key === 'email' ? 'none' : 'sentences'}
            onChangeText={(text) => setForm({ ...form, [f.key]: text })}
            style={styles.input}
          />
        ))}
        <Button mode="contained" onPress={handleSave} style={styles.button}>SALVAR</Button>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  input: { marginBottom: 12 },
  button: { marginTop: 8 },
});