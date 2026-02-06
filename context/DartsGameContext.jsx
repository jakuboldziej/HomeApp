import { createContext, useEffect, useState, useContext, useRef } from "react";
import { socket, ensureSocketConnection, trackRoom, untrackRoom } from "../lib/socketio";
import { router } from 'expo-router'
import { AuthContext } from '../context/AuthContext';
import { getDartsGame } from '../lib/fetch';

export const DartsGameContext = createContext()

const ensureGameRecord = (gameData) => {
  if (!gameData) return gameData;

  if (!gameData.record || gameData.record.length === 0) {
    gameData.record = [{
      game: {
        round: gameData.round,
        turn: gameData.turn
      },
      users: gameData.users.map(user => ({ ...user }))
    }];
  }
  return gameData;
};

export const DartsGameProvider = ({ children }) => {
  const [game, setGame] = useState(null);
  const [overthrow, setOverthrow] = useState(false);
  const { user } = useContext(AuthContext);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const gameRef = useRef(null);

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    if (user && !socket.connected) {
      ensureSocketConnection()
        .then(() => {
          setIsSocketReady(true);
        })
        .catch((error) => {
          console.error('DartsGameContext: Failed to connect socket:', error);
          setTimeout(() => {
            if (user && !socket.connected) {
              socket.connect();
            }
          }, 2000);
        });
    } else if (socket.connected) {
      setIsSocketReady(true);
    }

    const handleConnect = () => {
      setIsSocketReady(true);

      const currentGame = gameRef.current;
      if (currentGame && currentGame.gameCode) {
        trackRoom(currentGame.gameCode);
        socket.emit("joinLiveGamePreview", JSON.stringify({
          gameCode: currentGame.gameCode
        }));

        getDartsGame(currentGame._id).then(freshGame => {
          const gameWithRecord = ensureGameRecord(freshGame);
          setGame(gameWithRecord);
        }).catch(error => {
          console.error('Failed to fetch fresh game state:', error);
        });
      }
    };

    const handleDisconnect = () => {
      setIsSocketReady(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [user]);

  useEffect(() => {
    if (!isSocketReady) {
      return;
    }

    const updateLiveGamePreviewClient = (data) => {
      const gameData = JSON.parse(data);
      const currentGame = gameRef.current;

      if (currentGame && currentGame.gameCode === gameData.gameCode) {
        if (JSON.stringify(currentGame) === JSON.stringify(gameData)) {
          return;
        }
        const gameWithRecord = ensureGameRecord(gameData);
        setGame(gameWithRecord);
      }
    }

    const playAgainButtonClient = async (data) => {
      const newGameData = JSON.parse(data);
      const currentGame = gameRef.current;

      await ensureSocketConnection();

      if (currentGame && currentGame.gameCode && currentGame.gameCode !== newGameData.gameCode) {
        untrackRoom(currentGame.gameCode);
        socket.emit("leaveLiveGamePreview", JSON.stringify({
          gameCode: currentGame.gameCode
        }));
      }

      const gameWithRecord = ensureGameRecord(newGameData);
      setGame(gameWithRecord);

      setTimeout(() => {
        trackRoom(newGameData.gameCode);
        socket.emit("joinLiveGamePreview", JSON.stringify({
          gameCode: newGameData.gameCode
        }));
      }, 100);
    }

    const handleReconnect = async () => {
      const currentGame = gameRef.current;
      if (currentGame && currentGame.gameCode) {
        try {
          await ensureSocketConnection();

          const freshGame = await getDartsGame(currentGame._id);
          const gameWithRecord = ensureGameRecord(freshGame);
          setGame(gameWithRecord);

          trackRoom(currentGame.gameCode);
          socket.emit("joinLiveGamePreview", JSON.stringify({
            gameCode: currentGame.gameCode
          }));
        } catch (error) {
          console.error('Failed to restore game from database:', error);
          trackRoom(currentGame.gameCode);
          socket.emit("joinLiveGamePreview", JSON.stringify({
            gameCode: currentGame.gameCode
          }));
        }
      }
    };

    const gameCreated = (data) => {
      const { game: newGame, userDisplayNames } = JSON.parse(data);

      if (user && userDisplayNames.includes(user?.displayName)) {
        const gameWithRecord = ensureGameRecord(newGame);
        const currentGame = gameRef.current;

        if (currentGame && currentGame.gameCode && currentGame.active !== false) {
          untrackRoom(currentGame.gameCode);
          socket.emit('leaveLiveGamePreview', JSON.stringify({ gameCode: currentGame.gameCode }));
        }

        setGame(gameWithRecord);

        trackRoom(newGame.gameCode);
        socket.emit("joinLiveGamePreview", JSON.stringify({
          gameCode: newGame.gameCode
        }));

        router.replace({ pathname: '(darts)/dartsgame', params: { game: JSON.stringify(gameWithRecord) } });
      }
    };

    const handleOverthrow = (userDisplayName) => {
      setOverthrow(userDisplayName);
      setTimeout(() => setOverthrow(false), 1000);
    };

    socket.on("gameCreated", gameCreated);
    socket.on('updateLiveGamePreviewClient', updateLiveGamePreviewClient);
    socket.on('playAgainButtonClient', playAgainButtonClient);
    socket.on('reconnect', handleReconnect);
    socket.on('userOverthrowClient', handleOverthrow);

    return () => {
      socket.off('gameCreated', gameCreated);
      socket.off('updateLiveGamePreviewClient', updateLiveGamePreviewClient);
      socket.off('playAgainButtonClient', playAgainButtonClient);
      socket.off('reconnect', handleReconnect);
      socket.off('userOverthrowClient', handleOverthrow);
    }
  }, [isSocketReady, user]);

  return (
    <DartsGameContext.Provider value={{ game, setGame, overthrow, setOverthrow }}>
      {children}
    </DartsGameContext.Provider>
  )
}