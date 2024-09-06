import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'

const Darts = () => {

  return (
    <SafeAreaView className="h-full bg-black">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full h-full flex items-center p-4">
          <Text className="text-white text-3xl">Darts</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Darts