import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DartsDrawerContent from '../../components/dartsGame/DartsDrawerContent';

const DartsDrawerLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName='dartsgame'
        drawerContent={DartsDrawerContent}
        screenOptions={{
          drawerActiveTintColor: 'pink',
          drawerInactiveTintColor: 'white',
          drawerStyle: {
            backgroundColor: 'black',
          },
          contentStyle: { backgroundColor: 'black' },
          headerShown: false,
          swipeEnabled: true,
        }}
      >
        <Drawer.Screen
          name="dartsgame"
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}

export default DartsDrawerLayout;
