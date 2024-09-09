import { View, Text } from 'react-native'
import { Modal, Portal } from 'react-native-paper';
import { useEffect, useState } from 'react'
import { router, useNavigation } from 'expo-router';
import { socket } from '../../lib/socketio';
import { useContext } from 'react';
import { DartsGameContext } from '../../context/DartsGameContext';
import CustomButton from '../../components/Custom/CustomButton';

const GameSummary = ({ visibleModal, hideModal }) => {
  const { game, setGame } = useContext(DartsGameContext);
  const navigation = useNavigation();

  const [isPlayAgainDisabled, setIsPlayAgainDisabled] = useState(false);

  const handleGameLeave = () => {
    router.replace("/darts")
    socket.emit('leaveLiveGamePreview', JSON.stringify({ gameCode: game.gameCode }));
    setGame(null);
  }

  const handlePlayAgain = () => {
    socket.emit("externalKeyboardPlayAgain", JSON.stringify({
      gameCode: game.gameCode
    }));
  }

  useEffect(() => {
    // Prevent back button
    navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type === "GO_BACK") {
        e.preventDefault();
      }
    });
  }, []);

  useEffect(() => {
    const playAgainButtonClient = (data) => {
      const gameData = JSON.parse(data);

      setGame(gameData);

      socket.emit("joinLiveGamePreview", JSON.stringify({
        gameCode: gameData.gameCode
      }));

      hideModal();
    }

    const hostDisconnectedFromGameClient = () => {
      setIsPlayAgainDisabled(true);
    }

    socket.on('playAgainButtonClient', playAgainButtonClient);
    socket.on('hostDisconnectedFromGameClient', hostDisconnectedFromGameClient);

    return () => {
      socket.off('playAgainButtonClient', playAgainButtonClient);
      socket.off('hostDisconnectedFromGameClient', hostDisconnectedFromGameClient);
    }
  }, []);

  return (
    <Portal>
      <Modal
        dismissable={false}
        visible={visibleModal}
        contentContainerStyle={{ backgroundColor: 'black', padding: 20, margin: 10, height: '90%', borderRadius: 20 }}
      >
        <View className="w-full h-full flex flex-col items-center justify-center">
          <CustomButton title="Leave" textStyles="text-sm px-4" containerStyle="h-12 p-0 bg-red absolute top-2 right-2" onPress={() => handleGameLeave()} />
          <Text className="text-white font-pregular text-2xl">Game Summary</Text>
          {game.podium[1] !== null ? (
            <Text className='text-white font-pregular text-xl pt-5'>Results</Text>
          ) : (
            <Text className='text-red font-pregular text-xl pt-5'>This game was abandoned</Text>
          )}
          <View className='flex flex-col items-center mt-5 absolute bottom-2'>
            <Text className='font-pregular text-sm text-slate-400'>
              {!isPlayAgainDisabled ? "Wait until host clicks play again button or" : "Host disconnected from the game"}
            </Text>
            <CustomButton containerStyle="mt-5 bg-white" onPress={() => handlePlayAgain()} isDisabled={isPlayAgainDisabled} title="Play again" />
          </View>
        </View>
      </Modal>
    </Portal>
  )
}

export default GameSummary