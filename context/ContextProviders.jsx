import React from 'react'
import { AuthProvider } from './AuthContext'
import { DartsGameProvider } from './DartsGameContext'
import { PaperProvider, useTheme } from 'react-native-paper'

function ContextProviders({ children }) {
  const theme = useTheme();

  const customTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      onSurfaceDisabled: '#b6b8ba',
      surfaceDisabled: 'gray',
    },
  };
  return (
    <AuthProvider>
      <PaperProvider theme={customTheme}>
        <DartsGameProvider>
          {children}
        </DartsGameProvider>
      </PaperProvider>
    </AuthProvider>
  )
}

export default ContextProviders