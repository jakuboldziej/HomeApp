import { createContext, useEffect, useState, useContext } from "react";
import { socket, ensureSocketConnection } from "../lib/socketio";
import { router } from 'expo-router'
import { AuthContext } from '../context/AuthContext';

export const DartsGameContext = createContext()

export const DartsGameProvider = ({ children }) => {
  const [game, setGame] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const updateLiveGamePreviewClient = (data) => {
      const gameData = JSON.parse(data);
      setGame(gameData);
    }

    const handleReconnect = async () => {
      if (game && game.gameCode) {
        try {
          await ensureSocketConnection();
          socket.emit("joinLiveGamePreview", JSON.stringify({
            gameCode: game.gameCode
          }));
        } catch (error) {
          console.error('Failed to rejoin game after reconnect:', error);
        }
      }
    };

    const gameCreated = (data) => {
      const { game, userDisplayNames } = JSON.parse(data);

      if (user && userDisplayNames.includes(user?.displayName)) {
        router.replace({ pathname: '(darts)/dartsgame', params: { game: JSON.stringify(game) } });
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