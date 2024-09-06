import React from 'react'
import { AuthProvider } from './AuthContext'

function ContextProviders({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

export default ContextProviders