import { createContext, useEffect, useState } from "react";
import { socket } from "../lib/socketio";

export const DartsGameContext = createContext()

export const DartsGameProvider = ({ children }) => {
  const [game, setGame] = useState(null);

  useEffect(() => {

    const updateLiveGameClient = (data) => {
      const gameData = JSON.parse(data);
      console.log(gameData);
      setGame(gameData);
    }

    socket.on('updateLiveGameClient', updateLiveGameClient);

    return () => {
      socket.off('updateLiveGameClient', updateLiveGameClient);
    }
  }, []);

  return (
    <DartsGameContext.Provider value={{ game, setGame }}>
      {children}
    </DartsGameContext.Provider>
  )
}