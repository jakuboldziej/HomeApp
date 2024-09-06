import { View, Text, ScrollView, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import { socket } from '../../lib/socketio'
import { joinLiveGamePreview } from '../../lib/fetch'
import { router } from 'expo-router'

const Darts = () => {
  const [gameCode, setGameCode] = useState('1988');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinDartsGame = async () => {
    setIsLoading(true);

    const response = await joinLiveGamePreview(gameCode);

    if (response.ok) {
      router.push({ pathname: '/dartskeyboard', params: { gameCode: JSON.stringify(response.game.gameCode) } });
    } else {
      Alert.alert("Game code is wrong.")
    }

    setIsLoading(false);
  }

  return (
    <SafeAreaView className="h-full bg-black">
      <ScrollView contentContainerStyle={{ height: '100%' }} keyboardShouldPersistTaps='handled'>
        <View className="w-full h-full flex items-center p-4">
          <Text className="text-white text-3xl font-psemibold">Darts</Text>
          <View className="font-pbold border border-white rounded-xl h-64 p-4 mt-20 flex items-center justify-between">
            <Text className="text-white text-xl font-psemibold">Control darts game with phone</Text>
            <Text className="text-white text-lg font-pregular">Enter game code</Text>
            <TextInput
              className="bg-lime w-full p-4 rounded-xl font-pregular"
              keyboardType='numeric'
              placeholder='1234'
              onChangeText={(e) => setGameCode(e)}
              returnKeyType='done'
              onSubmitEditing={handleJoinDartsGame}
            />
            <CustomButton title="Join game" onPress={handleJoinDartsGame} isLoading={isLoading} isDisabled={gameCode === ''} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Darts
