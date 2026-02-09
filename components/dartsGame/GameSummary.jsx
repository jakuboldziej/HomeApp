import { View, Text, ScrollView } from 'react-native'
import CustomModal from '../Custom/CustomModal';
import { useEffect, useState } from 'react'
import { router, useNavigation } from 'expo-router';
import { socket, ensureSocketConnection } from '../../lib/socketio';
import { useContext } from 'react';
import { DartsGameContext } from '../../context/DartsGameContext';
import CustomButton from '../../components/Custom/CustomButton';

const GameSummary = ({ visibleModal, hideModal }) => {
  const { game, setGame } = useContext(DartsGameContext);
  const navigation = useNavigation();

  const [isPlayAgainDisabled, setIsPlayAgainDisabled] = useState(false);

  useEffect(() => {
    if (visibleModal) {
      setIsPlayAgainDisabled(false);
    }
  }, [visibleModal]);

  const handleGameLeave = () => {
    if (game && socket.connected) {
      socket.emit('leaveLiveGamePreview', JSON.stringify({ gameCode: game.gameCode }));
    }
    setGame(null);
    router.replace("/darts");
  }

  const handlePlayAgain = async () => {
    try {
      await ensureSocketConnection();
      socket.emit("externalKeyboardPlayAgain", JSON.stringify({
        gameData: game
      }));
    } catch (error) {
      console.error('Failed to send play again:', error);
    }
  }

  const totalThrows = (user) => {
    if (!user?.currentThrows) return 0;
    return Object.values(user.currentThrows).reduce((acc, val) => acc + val, 0) - (user.currentThrows["overthrows"] || 0);
  }

  const UserResultsTable = () => {
    return (
      <View className="w-full mt-4 mb-4">
        <View className="flex-row bg-gray-800 border-b border-gray-600">
          <Text className="flex-1 text-white font-psemibold text-xs py-2 px-2 text-center">Player</Text>
          <Text className="flex-1 text-white font-psemibold text-xs py-2 px-2 text-center">Points</Text>
          <Text className="flex-1 text-white font-psemibold text-xs py-2 px-2 text-center">Throws</Text>
          <Text className="flex-1 text-white font-psemibold text-xs py-2 px-2 text-center">HRP</Text>
          <Text className="flex-1 text-white font-psemibold text-xs py-2 px-2 text-center">HAVG</Text>
        </View>

        <ScrollView className="max-h-64">
          {game.users.map((user, index) => (
            <View
              key={user._id || index}
              className={`flex-row border-b border-gray-700 ${game.userWon === user.displayName ? 'bg-yellow-900/30' : ''}`}
            >
              <Text className={`flex-1 font-pregular text-xs py-3 px-2 text-center ${game.userWon === user.displayName ? 'text-yellow-400' : 'text-white'}`}>
                {user.displayName}
              </Text>
              <Text className={`flex-1 font-pregular text-xs py-3 px-2 text-center ${game.userWon === user.displayName ? 'text-yellow-400' : 'text-white'}`}>
                {game.startPoints - user.points}
              </Text>
              <Text className={`flex-1 font-pregular text-xs py-3 px-2 text-center ${game.userWon === user.displayName ? 'text-yellow-400' : 'text-white'}`}>
                {totalThrows(user)}
              </Text>
              <Text className={`flex-1 font-pregular text-xs py-3 px-2 text-center ${game.userWon === user.displayName ? 'text-yellow-400' : 'text-white'}`}>
                {user.highestGameTurnPoints}
              </Text>
              <Text className={`flex-1 font-pregular text-xs py-3 px-2 text-center ${game.userWon === user.displayName ? 'text-yellow-400' : 'text-white'}`}>
                {user.highestGameAvg}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
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
    if (game?.active && visibleModal) {
      hideModal();
    }
  }, [game?.active, visibleModal, hideModal]);

  useEffect(() => {
    const hostDisconnectedFromGameClient = () => {
      setIsPlayAgainDisabled(true);
    }

    const gameEndClient = (data) => {
      const endedGame = JSON.parse(data);
      setGame(endedGame);
    }

    socket.on("gameEndClient", gameEndClient);
    socket.on('hostDisconnectedFromGameClient', hostDisconnectedFromGameClient);

    return () => {
      socket.off("gameEndClient", gameEndClient);
      socket.off('hostDisconnectedFromGameClient', hostDisconnectedFromGameClient);
    }
  }, []);

  return (
    <CustomModal
      dismissable={false}
      visible={visibleModal}
      contentContainerStyle={{ backgroundColor: 'black', padding: 20, margin: 10, width: "85%", height: '95%', borderRadius: 20 }}
    >
      <ScrollView className="w-full h-full" contentContainerStyle={{ flex: 1 }}>
        <View className="w-full h-full flex flex-col items-center">
          <CustomButton title="Leave" textStyles="text-sm px-4" containerStyle="h-12 p-0 bg-red absolute top-2 right-2 z-10" onPress={() => handleGameLeave()} />
          <Text className="text-white font-pregular text-2xl mt-16">Game Summary</Text>

          {game.podium[1] !== null ? (
            <View className="w-full flex flex-col items-center">
              <Text className='text-white font-pregular text-xl pt-5'>Results</Text>

              <View className="flex-row items-end justify-center gap-4 mt-6 mb-4">
                {game.podium[2] && (
                  <View className="flex flex-col items-center">
                    <Text className="text-white font-psemibold text-sm mb-2">{game.podium[2]}</Text>
                    <View className="bg-gray-600 w-16 h-20 rounded-t-lg flex items-center justify-center">
                      <Text className="text-white font-pbold text-2xl">2</Text>
                    </View>
                  </View>
                )}

                {game.podium[1] && (
                  <View className="flex flex-col items-center">
                    <Text className="text-yellow-400 font-pbold text-base mb-2">{game.podium[1]}</Text>
                    <View className="bg-yellow-600 w-16 h-28 rounded-t-lg flex items-center justify-center">
                      <Text className="text-white font-pbold text-3xl">1</Text>
                    </View>
                  </View>
                )}

                {game.podium[3] && (
                  <View className="flex flex-col items-center">
                    <Text className="text-white font-psemibold text-sm mb-2">{game.podium[3]}</Text>
                    <View className="bg-orange-700 w-16 h-16 rounded-t-lg flex items-center justify-center">
                      <Text className="text-white font-pbold text-xl">3</Text>
                    </View>
                  </View>
                )}
              </View>

              <View className="flex flex-col items-center gap-2 mt-4">
                <Text className="text-white font-pregular text-sm">Start Points: {game.startPoints}</Text>
                <Text className="text-white font-pregular text-sm">
                  Gamemode: {game.gameMode}
                  {game.gameMode === "X01" && ` | Legs: ${game.legs} | Sets: ${game.sets}`}
                </Text>
              </View>

              <UserResultsTable />
            </View>
          ) : (
            <Text className='text-red font-pregular text-xl pt-5'>This game was abandoned</Text>
          )}

          <View className='flex flex-col items-center mt-5 mb-4'>
            <Text className='font-pregular text-sm text-slate-400 text-center'>
              {!isPlayAgainDisabled ? "Wait until host clicks play again button or" : "Host disconnected from the game"}
            </Text>
            <CustomButton containerStyle="mt-5 bg-white" onPress={() => handlePlayAgain()} isDisabled={isPlayAgainDisabled} title="Play again" />
          </View>
        </View>
      </ScrollView>
    </CustomModal>
  )
}

export default GameSummary