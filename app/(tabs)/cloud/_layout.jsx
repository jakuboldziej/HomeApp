import React from 'react';
import { Stack } from 'expo-router';
import { CloudProvider } from '../../../context/CloudContext';
import CustomHeader from '../../../components/Cloud/CustomHeader';

const Cloud = () => {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        animation: 'default',
        contentStyle: { backgroundColor: 'black' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          header: () => <CustomHeader />,
        }}
      />
      <Stack.Screen
        name="[_id]"
      />
    </Stack>
  )
}

export default CloudWrapper = () => {
  return (
    <CloudProvider>
      <Cloud />
    </CloudProvider>
  )
}