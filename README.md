#  GYRO DASH

> Jogo mobile desenvolvido como atividade acadêmica no curso Técnico em Desenvolvimento de Sistemas do SENAI.

---

##  Autora

**Beatriz Sousa de Andrade**

Aluna do curso Técnico em Desenvolvimento de Sistemas — SENAI.

---

##  Descrição

O **GYRO DASH** é um jogo mobile desenvolvido em **React Native**, no qual o jogador controla uma esfera utilizando o **giroscópio do celular**.

O objetivo é movimentar o personagem inclinando o dispositivo e coletar o máximo possível de orbes durante o tempo disponível. O jogo possui diferentes tipos de orbes, sistema de pontuação, combos, vidas e aumento progressivo da velocidade.

O projeto foi desenvolvido com o objetivo de aplicar conceitos de desenvolvimento mobile, utilização de sensores do dispositivo e criação de uma interface interativa e gamificada.

---

##  Objetivo do projeto

O principal objetivo do projeto é desenvolver um jogo mobile utilizando o sensor de movimento do smartphone, colocando em prática conceitos de:

- Desenvolvimento de aplicações mobile;
- React Native;
- TypeScript;
- Utilização de sensores;
- Manipulação de estados;
- Eventos e interações;
- Interface gráfica;
- Lógica de jogos;
- Sistema de pontuação;
- Sistema de vidas.

---

##  Como jogar

O funcionamento do jogo é simples:

1. Pressione o botão **JOGAR**;
2. Incline o celular para movimentar o personagem;
3. Colete os orbes que aparecem pela tela;
4. Evite bater nas bordas da tela;
5. Faça combos para aumentar sua pontuação;
6. Tente conseguir a maior pontuação possível antes que o tempo termine.

###  Controles

O personagem é controlado através do **giroscópio do smartphone**.

📱 **Incline o celular para movimentar a esfera.**

---

##  Sistema de pontuação

O jogo possui três tipos de orbes:

| Orbe | Pontuação |
|------|-----------|
| 🔵 Azul | 10 pontos |
| 🟣 Roxo | 25 pontos |
| 🟡 Dourado | 50 pontos |

Além disso, o jogo possui um sistema de **combo**.

A cada 5 itens coletados consecutivamente, o jogador recebe uma pontuação multiplicada, aumentando suas chances de alcançar uma pontuação maior.

---

##  Sistema de vidas

O jogador começa cada partida com **3 vidas**.

Ao atingir uma das bordas da tela, uma vida é perdida e o combo é reiniciado.

Quando todas as vidas são perdidas, a partida termina.

---

##  Sistema de tempo

Cada partida possui duração de **60 segundos**.

Quando o tempo chega a zero, o jogo é encerrado e a pontuação final é apresentada ao jogador.

---

##  Aumento de dificuldade

A velocidade de movimentação do personagem aumenta conforme a pontuação do jogador cresce.

Isso faz com que a partida fique progressivamente mais desafiadora.

---

##  Tecnologias utilizadas

### Front-End / Mobile

- **React Native**
- **TypeScript**
- **Expo**
- **Expo Sensors**
- **React**

### Ferramentas

- **Visual Studio Code**
- **Node.js**
- **npm**
- **Git**
- **GitHub**

---

##  Estrutura do projeto

```text
aula-giroscopio/
│
├── 📁 .claude/
├── 📁 .expo/
├── 📁 .vscode/
│
├── 📁 app/
│   ├── _layout.tsx
│   └── index.tsx
│
├── 📁 assets/
│   └── 📁 images/
│
├── 📁 components/
│   ├── JogoOrbe.tsx
│   ├── LeituraGiroscopio.js
│   └── Orbe.tsx
│
├── 📁 constants/
├── 📁 hooks/
├── 📁 node_modules/
├── 📁 scripts/
│
├── .gitignore
├── AGENTS.md
├── app.json
├── CLAUDE.md
├── eslint.config.js
├── expo-env.d.ts
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

---

##  Principais arquivos

### `app/`

Contém a estrutura principal das telas e da navegação da aplicação.

### `components/`

Contém os componentes utilizados no projeto.

- `JogoOrbe.tsx` — componente relacionado à lógica do jogo;
- `LeituraGiroscopio.js` — responsável pela leitura do giroscópio;
- `Orbe.tsx` — componente relacionado aos orbes.

### `assets/images/`

Pasta destinada aos recursos visuais utilizados pela aplicação.

### `app.json`

Arquivo de configuração da aplicação Expo.

### `package.json`

Contém as dependências e configurações utilizadas no projeto.

---

##  Como instalar o projeto

Para executar o projeto localmente, é necessário possuir o **Node.js** e o **Expo** instalados.

### 1. Clone o repositório

```bash
git clone URL_DO_REPOSITORIO
```

### 2. Entre na pasta do projeto

```bash
cd aula-giroscopio
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o projeto

```bash
npx expo start
```

Depois disso, o Expo exibirá as opções para executar a aplicação em um dispositivo ou emulador compatível.

---

## Execução no celular

Como o jogo utiliza o **giroscópio**, recomenda-se executar a aplicação em um smartphone físico que possua esse sensor.

Após iniciar o Expo:

1. Instale o **Expo Go** no celular;
2. Certifique-se de que o computador e o celular estejam na mesma rede;
3. Escaneie o QR Code exibido pelo Expo;
4. Abra o aplicativo;
5. Inicie o jogo;
6. Incline o celular para controlar o personagem.

---

##  Funcionamento do giroscópio

O jogo utiliza o sensor de giroscópio através do **`expo-sensors`**.

O sensor realiza leituras dos movimentos do dispositivo e essas informações são utilizadas para alterar a posição do personagem na tela.

A aplicação configura o intervalo de atualização do sensor e utiliza os valores dos eixos para determinar a direção do movimento.

---

## Interface

O jogo possui uma interface simples e voltada para uma experiência arcade.

### Tela inicial

A tela inicial apresenta:

- Nome do jogo;
- Instruções;
- Objetivo da partida;
- Botão para iniciar o jogo.

### Tela de jogo

Durante a partida são apresentados:

- Pontuação;
- Tempo restante;
- Vidas;
- Combo;
- Personagem;
- Orbe atual.

### Tela de fim de jogo

Ao terminar a partida são apresentados:

- Pontuação final;
- Melhor sequência de combo;
- Botão para iniciar uma nova partida.

---

##  Funcionalidades

- [x] Controle através do giroscópio
- [x] Sistema de pontuação
- [x] Sistema de vidas
- [x] Cronômetro de 60 segundos
- [x] Sistema de combos
- [x] Orbes com diferentes pontuações
- [x] Orbes gerados em posições aleatórias
- [x] Aumento progressivo da velocidade
- [x] Detecção de colisão com os orbes
- [x] Detecção de colisão com as bordas
- [x] Tela inicial
- [x] Tela de jogo
- [x] Tela de fim de jogo
- [x] Possibilidade de jogar novamente

---

##  Melhorias futuras

Algumas funcionalidades que podem ser adicionadas futuramente:

- [ ] Ranking de melhores pontuações
- [ ] Sistema de recorde pessoal
- [ ] Efeitos sonoros
- [ ] Música de fundo
- [ ] Mais tipos de orbes
- [ ] Diferentes níveis de dificuldade
- [ ] Mais personagens
- [ ] Sistema de conquistas
- [ ] Animações durante a coleta dos orbes
- [ ] Tela de configurações
- [ ] Melhor adaptação para diferentes tamanhos de tela

---

## Status do projeto

 **Concluído — versão acadêmica**

O projeto foi desenvolvido como atividade prática para aplicação dos conhecimentos adquiridos durante o curso Técnico em Desenvolvimento de Sistemas.

---

##  Contexto acadêmico

| Informação | Detalhes |
|---|---|
| **Instituição** | SENAI |
| **Curso** | Técnico em Desenvolvimento de Sistemas |
| **Aluna** | Beatriz Sousa de Andrade |
| **Projeto** | GYRO DASH |
| **Tecnologia principal** | React Native + TypeScript + Expo |

---

##  Desenvolvedora

**Beatriz Sousa de Andrade**

Projeto desenvolvido para fins **educacionais e acadêmicos** no SENAI.

---

##  Licença

Este projeto foi desenvolvido para fins **educacionais e acadêmicos**.