import React from 'react'
import { AuthProvider } from './AuthContext'
import { DartsGameProvider } from './DartsGameContext'

function ContextProviders({ children }) {
  return (
    <AuthProvider>
      <DartsGameProvider>
        {children}
      </DartsGameProvider>
    </AuthProvider>
  )
}

export default ContextProviders