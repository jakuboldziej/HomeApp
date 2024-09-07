import { View, Text, ScrollView, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { getDartsGame } from '../../lib/fetch'

const Darts = () => {
  const [gameCode, setGameCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinDartsGame = async () => {
    setIsLoading(true);

    const gameResponse = await getDartsGame(gameCode);

    if (gameResponse) {
      router.replace({ pathname: '/dartsgame', params: { game: JSON.stringify(gameResponse) } });
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
              className="bg-lime w-24 text-center p-4 rounded-xl font-pregular"
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
