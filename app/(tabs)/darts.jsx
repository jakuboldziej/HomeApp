import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/Custom/CustomButton'
import { router } from 'expo-router'
import { getDartsGame } from '../../lib/fetch'
import { TextInput } from 'react-native-paper'
import CustomSnackBar from '../../components/Custom/CustomSnackBar'

const Darts = () => {
  const [gameCode, setGameCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [visibleSnack, setVisibleSnack] = useState(false);

  const handleJoinDartsGame = async () => {
    setIsLoading(true);

    const gameResponse = await getDartsGame(gameCode);

    if (!gameResponse.message) {
      router.replace({ pathname: '(darts)/dartsgame', params: { game: JSON.stringify(gameResponse) } });
    } else {
      setVisibleSnack(true);
    }

    setIsLoading(false);
  }

  return (
    <SafeAreaView className="h-full bg-black">
      <ScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps='handled'>
        <View className="w-full h-full flex items-center p-4">
          <Text className="text-white text-3xl font-psemibold pt-4">Darts</Text>
          <View className="font-pbold border border-white rounded-xl h-64 p-4 mt-20 flex items-center justify-between">
            <Text className="text-white text-xl font-psemibold">Control darts game with phone</Text>
            <Text className="text-white text-lg font-pregular">Enter game code</Text>
            <TextInput
              className="bg-creamy w-24 h-16 text-center font-pregular rounded-xl"
              keyboardType='numeric'
              placeholder='1234'
              onChangeText={(e) => setGameCode(e)}
              returnKeyType='done'
              enablesReturnKeyAutomatically={true}
              onSubmitEditing={gameCode.length !== 0 && handleJoinDartsGame}
              maxLength={4}
              underlineColor='transparent'
              activeUnderlineColor='transparent'
              cursorColor='black'
            />
            <CustomButton title="Join game" onPress={handleJoinDartsGame} isLoading={isLoading} isDisabled={gameCode === ''} />
          </View>

          <CustomSnackBar title="Game code is wrong" visible={visibleSnack} setVisible={setVisibleSnack} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Darts
