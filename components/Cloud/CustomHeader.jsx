import { View, Text } from 'react-native'
import React from 'react'
import { Searchbar } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

const CustomHeader = () => {
  return (
    <SafeAreaView className="bg-black">
      <Searchbar placeholder="Search disk" icon="menu" onIconPress={() => { }} />
    </SafeAreaView>
  )
}

export default CustomHeader