import { View, Text } from 'react-native'
import { Folder } from 'lucide-react-native'
import { IconButton, TouchableRipple } from 'react-native-paper'
import { router } from 'expo-router'
import { useRef, useCallback } from 'react';
import FolderSheet from '../Sheets/FolderSheet';

const FolderNode = ({ folder }) => {
  const redirectToFolder = () => {
    router.push({ pathname: `(cloud)/${folder._id}`, params: { folder: JSON.stringify(folder) } });
  }

  const bottomSheetModalRef = useRef(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <>
      <TouchableRipple onPress={() => redirectToFolder()} rippleColor="rgba(255, 255, 255, 0.3)">
        <View className="flex-row items-center w-full justify-between p-2">
          <View className="flex flex-row items-center">
            <Folder color="white" size={25} />
            <Text numberOfLines={1} className="text-white ml-2 font-pregular text-base max-w-10">{folder.name}</Text>
          </View>
          <IconButton onPress={handlePresentModalPress} icon="dots-vertical" iconColor='white' size={25} />
        </View>
      </TouchableRipple>

      <FolderSheet folder={folder} ref={bottomSheetModalRef} />
    </>
  )
}

export default FolderNode