import React from 'react';
import CustomHeader from '../../../components/Cloud/Header/CustomHeader';
import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '../../../components/Custom/CustomDrawerContent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IconButton } from 'react-native-paper';
import { router } from 'expo-router';

const DrawerLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName='cloud'
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerActiveTintColor: 'pink',
          drawerInactiveTintColor: 'white',
          drawerStyle: {
            backgroundColor: 'black',
          },
          contentStyle: { backgroundColor: 'black' },
        }}
      >
        <Drawer.Screen
          name="cloud"
          options={{
            title: "Home",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: "Settings",
            headerLeft: () => <IconButton icon="arrow-left" onPress={() => router.back()}></IconButton>
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}

export default DrawerLayout;