import { ActivityIndicator, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect } from 'react'
import { socket } from '../../lib/socketio'
import { DartsGameContext } from '../../context/DartsGameContext'

const inputTailwind = "bg-creamy rounded-[25px] m-0.5"

const DartsKeyboard = () => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();

  const { game, setGame } = useContext(DartsGameContext);

  const [currentUser, setCurrentUser] = useState(null);

  const handleGameLeave = () => {
    router.push("/darts")
    setGame(null);
    socket.emit('hostDisconnectedFromGame', JSON.stringify({
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

    if (params.gameCode) socket.emit("joinLiveGamePreview", JSON.stringify({
      gameCode: JSON.parse(params.gameCode)
    }));
  }, []);

  useEffect(() => {
    if (!game) return;

    setCurrentUser(game.users.find((user) => user.displayName === game.turn));
  }, [game]);

  if (!currentUser || !game) return (
    <View className="bg-black h-full items-center justify-center">
      <ActivityIndicator
        animating={true}
        color="#fff"
        size="large"
      />
    </View>
  )

  const numbers = [];
  for (let i = 1; i <= 20; i++) numbers.push(<CustomButton key={i} title={i} textStyles='w-16' containerStyle={inputTailwind} onPress={() => console.log(i.toString())} />);

  return (
    <SafeAreaView className="h-full bg-black">
      <View className="w-full h-full flex flex-col items-center justify-between">
        <CustomButton title="Leave" textStyles="text-sm px-4" containerStyle="h-12 p-0 bg-red absolute top-2 right-2" onPress={() => handleGameLeave()} />
        <Text className="font-pregular text-white text-xl absolute top-2 left-2">Round: {game.round}</Text>
        <View className="flex flex-col items-center mt-6">
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
        <View className="flex flex-col h-2/3 w-full items-center justify-evenly">
          <View className="flex flex-row flex-wrap justify-center">
            {numbers}
            <CustomButton containerStyle={inputTailwind} textStyles='w-16' title="25" />
            <CustomButton containerStyle={inputTailwind} textStyles='w-16' title="0" />
          </View>
          <View className="flex flex-row flex-wrap justify-center">
            <CustomButton containerStyle={`${inputTailwind} bg-green`} textStyles='min-w-26' title="DOORS" />
            <CustomButton containerStyle={`${inputTailwind} bg-[#ffd100]`} textStyles='min-w-26' title="DOUBLE" />
            <CustomButton containerStyle={`${inputTailwind} bg-[#ff8a00]`} textStyles='min-w-26' title="TRIPLE" />
            <CustomButton containerStyle={`${inputTailwind} bg-red`} textStyles='min-w-26' title="BACK" />
            <CustomButton containerStyle={`${inputTailwind} bg-[#E55555]`} textStyles='min-w-26' title="END" />
            <CustomButton containerStyle={`${inputTailwind} bg-[#E55555]`} textStyles='min-w-26' title="QUIT" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default DartsKeyboard