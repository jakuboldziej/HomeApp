import React from 'react'
import { AuthProvider } from '../context/AuthContext'
import { DartsGameProvider } from '../context/DartsGameContext'
import { PaperProvider, useTheme } from 'react-native-paper'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function ContextProviders({ children }) {
  const theme = useTheme();

  const customTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      onSurfaceDisabled: '#b6b8ba',
      surfaceDisabled: 'gray',
      primaryContainer: 'pink',
    },
  };
  return (
    <AuthProvider>
      <PaperProvider theme={customTheme}>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <DartsGameProvider>
              {children}
            </DartsGameProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </AuthProvider>
  )
}

export default ContextProviders