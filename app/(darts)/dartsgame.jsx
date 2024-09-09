import { ActivityIndicator, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import CustomButton from '../../components/Custom/CustomButton'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect } from 'react'
import { socket } from '../../lib/socketio'
import { DartsGameContext } from '../../context/DartsGameContext'
import GameKeyboard from '../../components/dartsGame/GameKeyboard'
import GameSummary from '../../components/dartsGame/GameSummary'
import { useKeepAwake } from 'expo-keep-awake'
import LoadingScreen from '../../components/LoadingScreen'

const DartsGame = () => {
  useKeepAwake();
  const params = useLocalSearchParams();
  const navigation = useNavigation();

  const { game, setGame } = useContext(DartsGameContext);

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [visibleModal, setVisibleModal] = useState(false);

  const showModal = () => setVisibleModal(true);
  const hideModal = () => setVisibleModal(false);

  const handleGameLeave = () => {
    router.replace("/darts")
    socket.emit('leaveLiveGamePreview', JSON.stringify({ gameCode: game.gameCode }));
    setGame(null);
  }

  useEffect(() => {
    // Prevent back button
    navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type === "GO_BACK") {
        e.preventDefault();
      }
    });

    const parsedGame = JSON.parse(params.game);
    socket.emit("joinLiveGamePreview", JSON.stringify({
      gameCode: parsedGame.gameCode
    }));

    setGame(parsedGame);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!game || isLoading) return;

    if (game.active === false) {
      // router.replace('dartsgamemodal');
      showModal();
    } else hideModal();

    setCurrentUser(game.users.find((user) => user.displayName === game.turn));
  }, [game]);

  if (!currentUser) return <LoadingScreen />

  return (
    <SafeAreaView className="h-full bg-black">
      <View className="w-full h-full flex flex-col items-center justify-evenly">
        <CustomButton
          title="Leave"
          textStyles="text-sm px-4"
          containerStyle={`h-12 p-0 bg-red absolute top-2 right-2 ${visibleModal && 'hidden'}`}
          onPress={() => handleGameLeave()}
        />
        <Text className="font-pregular text-white text-xl absolute top-2 left-2">Round: {game.round}</Text>
        <View className="flex flex-col items-center">
          <Text className="font-pregular text-white text-3xl">{currentUser.displayName}</Text>
          <Text className="font-pbold text-white text-2xl mt-2">{currentUser.points}</Text>
          <View className="flex flex-row w-44 justify-between mt-2">
            <View className="flex flex-col items-center">
              <Text className="font-psemibold text-white text-xl">T1</Text>
              <Text className="font-psemibold text-white text-xl">{currentUser.turns[1]}</Text>
            </View>
            <View className="flex flex-col items-center">
              <Text className="font-psemibold text-white text-xl">T2</Text>
              <Text className="font-psemibold text-white text-xl">{currentUser.turns[2]}</Text>
            </View>
            <View className="flex flex-col items-center">
              <Text className="font-psemibold text-white text-xl">T3</Text>
              <Text className="font-psemibold text-white text-xl">{currentUser.turns[3]}</Text>
            </View>
          </View>
        </View>
        <View>
          <GameKeyboard />
        </View>
        <GameSummary visibleModal={visibleModal} hideModal={hideModal} />
      </View>
    </SafeAreaView>
  )
}

export default DartsGame