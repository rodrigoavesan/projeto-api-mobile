// App.js - ponto de entrada. Configura o tema (Material Design) e a navegação entre telas.
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';

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
          <Stack.Screen name="Cards" component={CardsScreen} options={{ title: 'Personagens Star Wars', headerBackVisible: false }} />
          <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Detalhes' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
