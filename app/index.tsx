import { Gyroscope } from "expo-sensors";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const PLAYER_SIZE = 50;
const ORB_SIZE = 30;
const GAME_TIME = 30; // Tempo de partida em segundos
const TOTAL_ORBS = 3; // Quantidade de orbes simultâneos na tela (pode aumentar aqui!)

// Função para gerar múltiplos orbes iniciais
const generateInitialOrbs = (count: number) => {
  const orbs = [];
  for (let i = 0; i < count; i++) {
    orbs.push({
      id: i,
      x: Math.random() * (width - ORB_SIZE),
      y: Math.random() * (height - ORB_SIZE),
    });
  }
  return orbs;
};

export default function App() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [playerPosition, setPlayerPosition] = useState({
    x: width / 2 - PLAYER_SIZE / 2,
    y: height / 2 - PLAYER_SIZE / 2,
  });

  // Agora usamos uma lista (array) de orbes em vez de apenas um
  const [orbs, setOrbs] = useState(generateInitialOrbs(TOTAL_ORBS));

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [isPlaying, setIsPlaying] = useState(true);

  // Configuração do Giroscópio
  useEffect(() => {
    Gyroscope.setUpdateInterval(16);
    const subscription = Gyroscope.addListener((gyroscopeData) => {
      setData(gyroscopeData);
    });
    return () => subscription.remove();
  }, []);

  // Timer do Jogo
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Movimentação do Jogador
  useEffect(() => {
    if (!isPlaying) return;

    let newX = playerPosition.x - data.y * 12;
    let newY = playerPosition.y - data.x * 12;

    if (newX < 0) newX = 0;
    if (newX > width - PLAYER_SIZE) newX = width - PLAYER_SIZE;
    if (newY < 0) newY = 0;
    if (newY > height - PLAYER_SIZE) newY = height - PLAYER_SIZE;

    setPlayerPosition({ x: newX, y: newY });
  }, [data, isPlaying]);

  // Detecção de Colisão com múltiplos orbes
  useEffect(() => {
    if (!isPlaying) return;

    const playerCenterX = playerPosition.x + PLAYER_SIZE / 2;
    const playerCenterY = playerPosition.y + PLAYER_SIZE / 2;

    // Filtramos os orbes para ver se o jogador encostou em algum deles
    setOrbs((prevOrbs) => {
      let collectedCount = 0;

      const remainingOrbs = prevOrbs.filter((orb) => {
        const orbCenterX = orb.x + ORB_SIZE / 2;
        const orbCenterY = orb.y + ORB_SIZE / 2;

        const dx = playerCenterX - orbCenterX;
        const dy = playerCenterY - orbCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Se encostou, coletou!
        if (distance < PLAYER_SIZE / 2 + ORB_SIZE / 2) {
          collectedCount++;
          return false; // Remove este orbe da lista atual
        }
        return true; // Mantém o orbe na tela
      });

      // Se coletou algum orbe, soma pontos e gera um novo em lugar aleatório
      if (collectedCount > 0) {
        setScore((prevScore) => prevScore + collectedCount);

        // Adiciona novos orbes para substituir os que foram coletados
        const newOrbsList = [...remainingOrbs];
        for (let i = 0; i < collectedCount; i++) {
          newOrbsList.push({
            id: Date.now() + Math.random(),
            x: Math.random() * (width - ORB_SIZE),
            y: Math.random() * (height - ORB_SIZE),
          });
        }
        return newOrbsList;
      }

      return prevOrbs;
    });
  }, [playerPosition, isPlaying]);

  // Função para reiniciar o jogo
  const restartGame = () => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setPlayerPosition({
      x: width / 2 - PLAYER_SIZE / 2,
      y: height / 2 - PLAYER_SIZE / 2,
    });
    setOrbs(generateInitialOrbs(TOTAL_ORBS));
    setIsPlaying(true);
  };

  return (
    <View style={styles.container}>
      {/* Placar e Tempo */}
      <View style={styles.header}>
        <Text style={styles.statsText}>Pontos: {score}</Text>
        <Text style={styles.statsText}>Tempo: {timeLeft}s</Text>
      </View>

      {isPlaying ? (
        <>
          {/* Renderiza todos os orbes presentes no array */}
          {orbs.map((orb) => (
            <View
              key={orb.id}
              style={[
                styles.orb,
                {
                  left: orb.x,
                  top: orb.y,
                },
              ]}
            />
          ))}

          {/* Renderiza o Jogador */}
          <View
            style={[
              styles.player,
              {
                left: playerPosition.x,
                top: playerPosition.y,
              },
            ]}
          />
        </>
      ) : (
        /* Tela de Fim de Jogo */
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverTitle}>Fim de Jogo!</Text>
          <Text style={styles.finalScore}>Você fez {score} pontos!</Text>
          <TouchableOpacity style={styles.button} onPress={restartGame}>
            <Text style={styles.buttonText}>Jogar Novamente</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c3e50",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  statsText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  player: {
    position: "absolute",
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    borderRadius: PLAYER_SIZE / 2,
    backgroundColor: "#e74c3c",
    borderWidth: 3,
    borderColor: "#fff",
  },
  orb: {
    position: "absolute",
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    backgroundColor: "#3498db",
    borderWidth: 2,
    borderColor: "#fff",
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: 10,
  },
  finalScore: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#27ae60",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
