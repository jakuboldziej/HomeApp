import { View, Text } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native-paper'
import { Image } from 'expo-image'

const LoadingScreen = ({ text }) => {
  return (
    <View className="bg-black h-full items-center justify-center">
      <Image
        source={require("../assets/images/icon.png")}
        style={{ height: 350, width: 350 }}
      />
      <ActivityIndicator
        animating={true}
        color="#fff"
        size="large"
      />
      <Text className="text-white font-pregular text-xl pt-10">{text}</Text>
    </View>
  )
}

export default LoadingScreen