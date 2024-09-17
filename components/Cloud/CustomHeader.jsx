import React from 'react'
import { Searchbar } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

const CustomHeader = () => {
  return (
    <SafeAreaView>
      <Searchbar placeholder="Search disk" icon="menu" onIconPress={() => { }} />
    </SafeAreaView>
  )
}

export default CustomHeader