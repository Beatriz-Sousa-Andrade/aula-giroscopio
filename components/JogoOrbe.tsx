
import { Gyroscope } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

type OrbType = 'blue' | 'gold' | 'purple';

const PLAYER_SIZE = 48;
const ORB_SIZE = 28;
const HEADER_HEIGHT = 110;
const GAME_TIME = 60;

const generateRandomPosition = () => {
  const margin = 20;

  return {
    x:
      margin +
      Math.random() * (width - ORB_SIZE - margin * 2),

    y:
      HEADER_HEIGHT +
      margin +
      Math.random() *
        (height - HEADER_HEIGHT - ORB_SIZE - margin * 2),
  };
};

export default function App() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });

  const [playerPosition, setPlayerPosition] = useState({
    x: width / 2 - PLAYER_SIZE / 2,
    y: height / 2,
  });

  const [orbPosition, setOrbPosition] = useState(
    generateRandomPosition()
  );

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(GAME_TIME);
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [orbType, setOrbType] = useState('blue');

  const lastTime = useRef(Date.now());
  const playerRef = useRef(playerPosition);

  const moveSpeed = Math.min(20, 8 + score * 0.25);

  const createOrb = () => {
    setOrbPosition(generateRandomPosition());

    const random = Math.random();

    if (random < 0.1) {
      setOrbType('gold');
    } else if (random < 0.25) {
      setOrbType('purple');
    } else {
      setOrbType('blue');
    }
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setTime(GAME_TIME);
    setCombo(0);
    setGameOver(false);
    setStarted(true);

    const initialPosition = {
      x: width / 2 - PLAYER_SIZE / 2,
      y: height / 2,
    };

    setPlayerPosition(initialPosition);
    playerRef.current = initialPosition;

    createOrb();
  };

  useEffect(() => {
    Gyroscope.setUpdateInterval(16);

    const subscription = Gyroscope.addListener((gyroscopeData) => {
      setData(gyroscopeData);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;

    const now = Date.now();
    const delta = Math.min((now - lastTime.current) / 16, 3);

    lastTime.current = now;

    let newX =
      playerRef.current.x -
      data.y * moveSpeed * delta;

    let newY =
      playerRef.current.y -
      data.x * moveSpeed * delta;

    let hitWall = false;

    if (newX <= 0) {
      newX = 0;
      hitWall = true;
    }

    if (newX >= width - PLAYER_SIZE) {
      newX = width - PLAYER_SIZE;
      hitWall = true;
    }

    if (newY <= HEADER_HEIGHT) {
      newY = HEADER_HEIGHT;
      hitWall = true;
    }

    if (newY >= height - PLAYER_SIZE) {
      newY = height - PLAYER_SIZE;
      hitWall = true;
    }

    const newPosition = {
      x: newX,
      y: newY,
    };

    playerRef.current = newPosition;
    setPlayerPosition(newPosition);

    if (hitWall) {
      setLives((currentLives) => {
        if (currentLives <= 1) {
          setGameOver(true);
          return 0;
        }

        return currentLives - 1;
      });

      setCombo(0);
    }
  }, [data, started, gameOver, moveSpeed]);

  useEffect(() => {
    if (!started || gameOver) return;

    const timer = setInterval(() => {
      setTime((currentTime) => {
        if (currentTime <= 1) {
          setGameOver(true);
          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, gameOver]);

  useEffect(() => {
    if (!started || gameOver) return;

    const playerCenterX =
      playerPosition.x + PLAYER_SIZE / 2;

    const playerCenterY =
      playerPosition.y + PLAYER_SIZE / 2;

    const orbCenterX =
      orbPosition.x + ORB_SIZE / 2;

    const orbCenterY =
      orbPosition.y + ORB_SIZE / 2;

    const dx = playerCenterX - orbCenterX;
    const dy = playerCenterY - orbCenterY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (
      distance <
      PLAYER_SIZE / 2 + ORB_SIZE / 2
    ) {
      let points = 10;

      if (orbType === 'gold') {
        points = 50;
      }

      if (orbType === 'purple') {
        points = 25;
      }

      setCombo((currentCombo) => {
        const newCombo = currentCombo + 1;

        if (newCombo % 5 === 0) {
          setScore((currentScore) => currentScore + points * 2);
        } else {
          setScore((currentScore) => currentScore + points);
        }

        return newCombo;
      });

      createOrb();
    }
  }, [playerPosition, orbPosition, started, gameOver, orbType]);

  if (!started) {
    return (
      <View style={styles.menu}>
        <Text style={styles.gameTitle}>
          GYRO DASH
        </Text>

        <Text style={styles.subtitle}>
          Controle a bola usando o giroscópio
        </Text>

        <View style={styles.instructionsBox}>
          <Text style={styles.instruction}>
            📱 Incline o celular
          </Text>

          <Text style={styles.instruction}>
            🔵 Colete os orbes
          </Text>

          <Text style={styles.instruction}>
            💰 Orbes dourados valem mais
          </Text>

          <Text style={styles.instruction}>
            ❤️ Cuidado com as bordas
          </Text>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={startGame}
        >
          <Text style={styles.startButtonText}>
            JOGAR
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (gameOver) {
    return (
      <View style={styles.menu}>
        <Text style={styles.gameOverTitle}>
          FIM DE JOGO
        </Text>

        <Text style={styles.finalScore}>
          {score}
        </Text>

        <Text style={styles.finalScoreLabel}>
          PONTOS
        </Text>

        <Text style={styles.comboText}>
          🔥 Melhor sequência: {combo}
        </Text>

        <TouchableOpacity
          style={styles.startButton}
          onPress={startGame}
        >
          <Text style={styles.startButtonText}>
            JOGAR NOVAMENTE
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>

        <View>
          <Text style={styles.label}>
            PONTOS
          </Text>

          <Text style={styles.score}>
            {score}
          </Text>
        </View>

        <View>
          <Text style={styles.label}>
            TEMPO
          </Text>

          <Text
            style={[
              styles.timer,
              time <= 10 && styles.danger,
            ]}
          >
            {time}s
          </Text>
        </View>

        <View>
          <Text style={styles.label}>
            VIDAS
          </Text>

          <Text style={styles.lives}>
            {'❤️'.repeat(lives)}
          </Text>
        </View>

      </View>

      <Text style={styles.combo}>
        {combo > 1
          ? `🔥 COMBO x${combo}`
          : 'Colete os orbes!'}
      </Text>

      <View
        style={[
          styles.orb,
          orbType === 'blue' && styles.orb_blue,
          orbType === 'gold' && styles.orb_gold,
          orbType === 'purple' && styles.orb_purple,
          {
            left: orbPosition.x,
            top: orbPosition.y,
          },
        ]}
      >
        <View style={styles.orbGlow} />
      </View>

      <View
        style={[
          styles.player,
          {
            left: playerPosition.x,
            top: playerPosition.y,
          },
        ]}
      >
        <View style={styles.playerEyeLeft} />
        <View style={styles.playerEyeRight} />
        <View style={styles.playerMouth} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#07111f',
  },

  header: {
    height: HEADER_HEIGHT,
    paddingTop: 45,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0d1b2a',
    borderBottomWidth: 2,
    borderBottomColor: '#19344f',
    zIndex: 10,
  },

  label: {
    color: '#78909c',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  score: {
    color: '#ffffff',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  timer: {
    color: '#4fc3f7',
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  danger: {
    color: '#ff5252',
  },

  lives: {
    fontSize: 18,
    marginTop: 3,
  },

  combo: {
    position: 'absolute',
    top: HEADER_HEIGHT + 12,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#90caf9',
    fontSize: 14,
    fontWeight: 'bold',
    zIndex: 5,
  },

  player: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    borderRadius: PLAYER_SIZE / 2,
    backgroundColor: '#ff7043',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#ff5722',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  playerEyeLeft: {
    position: 'absolute',
    width: 7,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    left: 12,
    top: 12,
  },

  playerEyeRight: {
    position: 'absolute',
    width: 7,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    right: 12,
    top: 12,
  },

  playerMouth: {
    position: 'absolute',
    width: 18,
    height: 8,
    borderBottomWidth: 3,
    borderColor: '#ffffff',
    borderRadius: 10,
    bottom: 9,
  },

  orb: {
    position: 'absolute',
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },

  orb_blue: {
    backgroundColor: '#2196f3',
    borderColor: '#90caf9',
    shadowColor: '#2196f3',
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 12,
  },

  orb_gold: {
    backgroundColor: '#ffd600',
    borderColor: '#fff59d',
    shadowColor: '#ffd600',
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
  },

  orb_purple: {
    backgroundColor: '#ab47bc',
    borderColor: '#e1bee7',
    shadowColor: '#ab47bc',
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 14,
  },

  orbGlow: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    opacity: 0.9,
  },

  menu: {
    flex: 1,
    backgroundColor: '#07111f',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  gameTitle: {
    color: '#4fc3f7',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: '#0288d1',
    textShadowRadius: 15,
  },

  subtitle: {
    color: '#90a4ae',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },

  instructionsBox: {
    marginTop: 45,
    width: '100%',
    backgroundColor: '#0d1b2a',
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: '#19344f',
  },

  instruction: {
    color: '#ffffff',
    fontSize: 16,
    marginVertical: 8,
    textAlign: 'center',
  },

  startButton: {
    marginTop: 35,
    backgroundColor: '#2196f3',
    paddingHorizontal: 55,
    paddingVertical: 17,
    borderRadius: 30,
    elevation: 8,
  },

  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },

  gameOverTitle: {
    color: '#ff5252',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 2,
  },

  finalScore: {
    color: '#ffffff',
    fontSize: 80,
    fontWeight: '900',
    marginTop: 20,
  },

  finalScoreLabel: {
    color: '#78909c',
    fontSize: 14,
    letterSpacing: 3,
  },

  comboText: {
    color: '#ffca28',
    fontSize: 16,
    marginTop: 25,
  },

});

