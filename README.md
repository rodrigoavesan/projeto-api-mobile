# Star Wars Cards (React Native + Expo)

Rodrigo Avelar Santos - Projeto Mobile API

App mobile com login, cadastro de usuário, cards de personagens da **Star Wars API (SWAPI)** e tela de detalhes.

## Tecnologias
- React Native (Expo)
- React Navigation (navegação entre telas)
- React Native Paper (Material Design)
- AsyncStorage (armazenamento local, equivalente ao LocalStorage)
- SWAPI – Star Wars API (não precisa de chave)
- Star Wars Visual Guide (imagens dos personagens)

## Como executar

1. Instale as dependências:
   ```bash
   npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage react-native-paper @expo/vector-icons
   ```
2. Rode o projeto:
   ```bash
   npx expo start
   ```
3. Escaneie o QR Code com o app **Expo Go** no celular (ou aperte `w` para abrir no navegador).

Na primeira vez, toque em **CADASTRAR USUÁRIO**, preencha os dados e depois faça login.

## Estrutura
```
App.js                        navegação e tema
src/storage.js                AsyncStorage (usuário e cards)
src/services/swapi.js         chamadas à Star Wars API
src/components/CharacterImage.js
src/screens/LoginScreen.js
src/screens/RegisterScreen.js
src/screens/CardsScreen.js
src/screens/DetailsScreen.js
```

## Uso da API
- `GET /people/{id}` → dados do personagem (o botão ADD sorteia um id de 1 a 83).
- Os campos planeta, filmes, espécies, veículos e naves vêm como URLs; a tela de detalhes busca cada uma para exibir o nome.
- Endereços usados: `https://swapi.info/api` (principal) e `https://swapi.dev/api` (reserva).
- Imagens: `https://starwars-visualguide.com/assets/img/characters/{id}.jpg`
