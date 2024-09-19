import React from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { Drawer } from 'react-native-paper'

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <Drawer.Section
        title="Cloud"
        theme={{ colors: { onSurfaceVariant: 'white' } }}
      >
        <DrawerItemList {...props} />
      </Drawer.Section>
    </DrawerContentScrollView>
  )
}

export default CustomDrawerContent