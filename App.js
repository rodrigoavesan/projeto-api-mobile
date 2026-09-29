// App.js - ponto de entrada. Configura o tema (Material Design) e a navegação entre telas.
import React from 'react';
import { Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, MD3LightTheme, IconButton } from 'react-native-paper';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CardsScreen from './src/screens/CardsScreen';
import DetailsScreen from './src/screens/DetailsScreen';

const Stack = createNativeStackNavigator();

// Tema baseado no Material Design 3: preto e amarelo (Star Wars)
const theme = {
  ...MD3LightTheme,
  colors: { ...MD3LightTheme.colors, primary: '#111111', onPrimary: '#FFE81F', secondary: '#FFE81F' },
};

// Alert.alert com botões não funciona no navegador (Expo web), então usamos window.confirm lá.
// No celular (Android/iOS), usamos o Alert.alert nativo normalmente.
function confirmLogout(onConfirm) {
  if (Platform.OS === 'web') {
    if (window.confirm('Deseja sair da sua conta?')) onConfirm();
    return;
  }
  Alert.alert('Sair', 'Deseja sair da sua conta?', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Sair', style: 'destructive', onPress: onConfirm },
  ]);
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: '#000' },
            headerTintColor: '#FFE81F',
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastrar Usuário' }} />
          <Stack.Screen
            name="Cards"
            component={CardsScreen}
            options={({ navigation }) => ({
              title: 'Personagens Star Wars',
              headerBackVisible: false, // nunca mostra a seta de voltar aqui
              headerLeft: () => null, // garante que nenhuma seta apareça, em qualquer plataforma
              headerRight: () => (
                <IconButton
                  icon="logout"
                  iconColor="#FFE81F"
                  onPress={() =>
                    // reset() limpa todo o histórico de navegação, então o botão "voltar"
                    // do celular também não consegue retornar para a tela de Cards depois do logout
                    confirmLogout(() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }))
                  }
                />
              ),
            })}
          />
          <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Detalhes' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}