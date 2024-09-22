import React, { useContext } from 'react';
import { Stack } from 'expo-router';
import CustomHeader from '../../../../components/Cloud/Header/CustomHeader';
import { setBackgroundColorAsync } from 'expo-system-ui';
import CustomHeaderRight from '../../../../components/Cloud/Header/CustomHeaderRight';
import { CloudContext, CloudProvider } from '../../../../context/CloudContext';
import CustomSnackBar from '../../../../components/Custom/CustomSnackBar';

const Cloud = () => {
  const { snackbarVisible, setSnackbarVisible, snackbarTitle } = useContext(CloudContext);

  return (
    <>
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
          name="[name]"
          options={({ route }) => {
            if (!route.params) return;
            const document = route.params?.folder ? JSON.parse(route.params.folder) : JSON.parse(route.params.file);
            const headerTitle = document.type === "file" ? document.filename : document.name;

            return {
              headerTitle: headerTitle,
              headerBackVisible: true,
              headerRight: () => <CustomHeaderRight document={document} />,
            }
          }}
        />
        <Stack.Screen
          name="search"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
      </Stack>

      <CustomSnackBar title={snackbarTitle} visible={snackbarVisible} setVisible={setSnackbarVisible} />
    </>
  )
}

export default CloudWrapper = () => {
  setBackgroundColorAsync("black");

  return (
    <CloudProvider>
      <Cloud />
    </CloudProvider>
  )
}