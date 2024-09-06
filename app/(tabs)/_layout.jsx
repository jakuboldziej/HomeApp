import { View, Text, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { House, Target, User } from 'lucide-react-native'

const TabIcon = ({ icon, name, focused }) => {
  return (
    <View className="flex items-center justify-center">
      <View>{icon}</View>
      <Text className={focused ? "font-psemibold text-green" : "font-pregular"}>
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<House color={focused ? 'green' : 'black'} size={22} />}
              name="Home"
              focused={focused}
            />
          )
        }}
      />
      <Tabs.Screen
        name='darts'
        options={{
          title: 'Darts',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<Target color={focused ? 'green' : 'black'} size={22} />}
              name="Darts"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='user'
        options={{
          title: 'User',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<User color={focused ? 'green' : 'black'} size={22} />}
              name="User"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  )
}

export default TabsLayout