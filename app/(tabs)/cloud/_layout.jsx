import React from 'react';
import { Stack } from 'expo-router';
import CustomHeader from '../../../components/Cloud/CustomHeader';
import { setBackgroundColorAsync } from 'expo-system-ui';

const Cloud = () => {
  setBackgroundColorAsync("black");

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

export default Cloud