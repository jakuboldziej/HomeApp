import React from 'react';
import CustomHeader from '../../../components/Cloud/Header/CustomHeader';
import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '../../../components/Custom/CustomDrawerContent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default DrawerLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName='cloud'
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerActiveTintColor: 'pink',
          drawerInActiveTintColor: 'white',
          drawerStyle: {
            backgroundColor: 'black',
          }
        }}
      >
        <Drawer.Screen
          name="cloud"
          options={{
            title: "Cloud",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: "Settings",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}