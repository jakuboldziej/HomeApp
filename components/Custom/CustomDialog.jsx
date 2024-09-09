import React from 'react'
import { Dialog, Portal } from 'react-native-paper'

const CustomDialog = ({ children, visibleDialog }) => {
  return (
    <Portal>
      <Dialog visible={visibleDialog} dismissable={false}>
        {children}
      </Dialog>
    </Portal>
  )
}

export default CustomDialog