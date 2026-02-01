import { createContext, useEffect, useState, useContext } from "react";
import { socket, ensureSocketConnection } from "../lib/socketio";
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
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const updateLiveGamePreviewClient = (data) => {
      const gameData = JSON.parse(data);
      const gameWithRecord = ensureGameRecord(gameData);
      setGame(gameWithRecord);
    }

    const handleReconnect = async () => {
      if (game && game.gameCode) {
        try {
          await ensureSocketConnection();
          
          const freshGame = await getDartsGame(game._id);
          const gameWithRecord = ensureGameRecord(freshGame);
          setGame(gameWithRecord);
          
          socket.emit("joinLiveGamePreview", JSON.stringify({
            gameCode: game.gameCode
          }));
        } catch (error) {
          console.error('Failed to restore game from database:', error);
          socket.emit("joinLiveGamePreview", JSON.stringify({
            gameCode: game.gameCode
          }));
        }
      }
    };

    const gameCreated = (data) => {
      const { game, userDisplayNames } = JSON.parse(data);

      if (user && userDisplayNames.includes(user?.displayName)) {
        const gameWithRecord = ensureGameRecord(game);
        router.replace({ pathname: '(darts)/dartsgame', params: { game: JSON.stringify(gameWithRecord) } });
      }
    };

    socket.on("gameCreated", gameCreated);
    socket.on('updateLiveGamePreviewClient', updateLiveGamePreviewClient);
    socket.on('reconnect', handleReconnect);

    return () => {
      socket.off('gameCreated', gameCreated);
      socket.off('updateLiveGamePreviewClient', updateLiveGamePreviewClient);
      socket.off('reconnect', handleReconnect);
    }
  }, [game]);

  return (
    <DartsGameContext.Provider value={{ game, setGame }}>
      {children}
    </DartsGameContext.Provider>
  )
}