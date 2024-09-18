import React from 'react';
import { Stack } from 'expo-router';
import CustomHeader from '../../../../components/Cloud/Header/CustomHeader';
import { setBackgroundColorAsync } from 'expo-system-ui';
import CustomHeaderRight from '../../../../components/Cloud/Header/CustomHeaderRight';

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
          header: () => <CustomHeader type="index" />,
        }}
      />
      <Stack.Screen
        name="[name]"
        options={({ route }) => {
          if (!route.params) return;
          const document = route.params?.folder ? JSON.parse(route.params.folder) : JSON.parse(route.params.file);
          const headerTitle = document.type === "file" ? document.filename : document.name;

          return {
            headerTitle: headerTitle,
            headerBackVisible: true,
            headerRight: () => <CustomHeaderRight document={document} />
          }
        }}
      />
    </Stack>
  )
}

export default Cloud