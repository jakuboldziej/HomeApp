import React, { useContext } from 'react'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { Drawer } from 'react-native-paper'
import { DartsGameContext } from '../../context/DartsGameContext'
import { router } from 'expo-router'
import { socket } from '../../lib/socketio'
import { isInitialGameState } from '../../lib/recordUtils'

const DartsDrawerContent = (props) => {
  const { game, setGame } = useContext(DartsGameContext);

  const handleGameLeave = () => {
    if (game && socket.connected) {
      socket.emit('leaveLiveGamePreview', JSON.stringify({ gameCode: game.gameCode }));
    }
    setGame(null);
    router.replace("/darts");
  }

  const handleEndTraining = async () => {
    const updatedGame = { ...game };
    updatedGame.podium[1] = game.turn;
    updatedGame.active = false;

    socket.emit("game:end", JSON.stringify({ gameCode: game.gameCode, game: updatedGame }));
    setGame(updatedGame);
    props.navigation.closeDrawer();
  }

  const handleQuit = async () => {
    const updatedGame = { ...game };
    updatedGame.active = false;
    updatedGame.podium[1] = null;

    socket.emit("game:end", JSON.stringify({ gameCode: game.gameCode, game: updatedGame }));
    setGame(updatedGame);
    props.navigation.closeDrawer();
  }

  const showQuitBtn = () => {
    return isInitialGameState(game) || (game?.round === 1 && game?.users?.[0]?.turns?.[1] === null);
  }

  return (
    <DrawerContentScrollView {...props}>
      <Drawer.Section
        title="Game Actions"
        theme={{ colors: { onSurfaceVariant: 'white' } }}
      >
        <Drawer.Item
          label="Leave Game Preview"
          onPress={handleGameLeave}
          theme={{ colors: { onSurfaceVariant: '#E55555' } }}
        />
        {game?.training && (
          <Drawer.Item
            label="End Training"
            onPress={handleEndTraining}
            theme={{ colors: { onSurfaceVariant: '#E55555' } }}
          />
        )}
        {showQuitBtn() && (
          <Drawer.Item
            label="Quit Game"
            onPress={handleQuit}
            theme={{ colors: { onSurfaceVariant: '#E55555' } }}
          />
        )}
      </Drawer.Section>
    </DrawerContentScrollView>
  )
}

export default DartsDrawerContent
