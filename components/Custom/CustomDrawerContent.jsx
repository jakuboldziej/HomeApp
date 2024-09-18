import React from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { View } from 'react-native'
import { Drawer } from 'react-native-paper'

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <Drawer.Section
        title="My Cloud"
        theme={{ colors: { onSurfaceVariant: 'white' } }}
      >
        <DrawerItemList {...props} />
      </Drawer.Section>
    </DrawerContentScrollView>
  )
}

export default CustomDrawerContent