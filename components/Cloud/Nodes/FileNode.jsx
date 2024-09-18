import { View, Text } from 'react-native'
import { File } from 'lucide-react-native'
import { IconButton, TouchableRipple } from 'react-native-paper'
import { router, useNavigation } from 'expo-router'
import { useRef, useCallback } from 'react';
import FileSheet from '../Sheets/FileSheet';

const FileNode = ({ file }) => {
  const navigation = useNavigation();

  const redirectToFolder = () => {
    router.push({ pathname: `/cloud/${file.filename}`, params: { file: JSON.stringify(file) } });
    // navigation.navigate('CloudHome')
  }

  const bottomSheetModalRef = useRef(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <>
      <TouchableRipple onPress={() => redirectToFolder()} rippleColor="rgba(255, 255, 255, 0.3)">
        <View className="flex-row items-center w-full justify-between p-2 pl-4">
          <View className="flex flex-row items-center max-w-[83%]">
            <File color="white" size={25} />
            <Text numberOfLines={1} className="text-white ml-2 font-pregular text-base">{file.filename}</Text>
          </View>
          <IconButton onPress={handlePresentModalPress} icon="dots-vertical" iconColor='white' size={25} />
        </View>
      </TouchableRipple>
      <FileSheet file={file} ref={bottomSheetModalRef} />
    </>
  )
}

export default FileNode