import { View, Image } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native-paper'

const LoadingScreen = () => {
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
    </View>
  )
}

export default LoadingScreen