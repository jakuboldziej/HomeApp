import { createContext, useEffect, useState } from "react";
import { socket } from "../lib/socketio";

export const DartsGameContext = createContext()

export const DartsGameProvider = ({ children }) => {
  const [game, setGame] = useState(null);

  useEffect(() => {
    const updateLiveGamePreviewClient = (data) => {
      const gameData = JSON.parse(data);
      setGame(gameData);
    }

    socket.on('updateLiveGamePreviewClient', updateLiveGamePreviewClient);

    return () => {
      socket.off('updateLiveGamePreviewClient', updateLiveGamePreviewClient);
    }
  }, []);

  return (
    <DartsGameContext.Provider value={{ game, setGame }}>
      {children}
    </DartsGameContext.Provider>
  )
}