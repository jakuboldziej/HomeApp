import { useNavigation } from 'expo-router';
import React from 'react';
import { Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions } from '@react-navigation/native';

const CustomHeader = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="bg-black">
      <Searchbar
        theme={{ colors: { elevation: { level3: 'pink' } } }}
        placeholder="Search disk"
        icon="menu"
        onIconPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
    </SafeAreaView>
  )
}

export default CustomHeader;