import { View, Text } from 'react-native'
import React from 'react'

const FolderScreen = ({ folder }) => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-white text-xl">{folder._id}</Text>
    </View>
  )
}

export default FolderScreen