import { View, Text } from 'react-native';
import { File } from 'lucide-react-native';
import { IconButton, Tooltip, TouchableRipple } from 'react-native-paper';
import { router } from 'expo-router';
import { useRef, useCallback } from 'react';
import FileSheet from '../Sheets/FileSheet';

const FileNode = ({ file }) => {
  const redirectToFolder = () => {
    router.push({ pathname: `/cloud/${file.filename}`, params: { file: JSON.stringify(file) } });
  }

  const bottomSheetModalRef = useRef(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <>
      <Tooltip title={file.filename}>
        <TouchableRipple onPress={() => redirectToFolder()} rippleColor="rgba(255, 255, 255, 0.3)">
          <View className="flex-row items-center w-full justify-between p-2 pl-4">
            <View className="flex flex-row items-center max-w-[83%]">
              <File color="white" size={25} />
              <View className="flex-col">
                <Text numberOfLines={1} className="text-white ml-2 font-pregular text-base">{file.filename}</Text>
                <Text numberOfLines={1} className="text-slate-400 ml-2 font-pregular text-sm max-w-10">{new Date(file.uploadDate).toLocaleString()}</Text>

              </View>
            </View>
            <IconButton onPress={handlePresentModalPress} icon="dots-vertical" iconColor='white' size={25} />
          </View>
        </TouchableRipple>
      </Tooltip>

      <FileSheet file={file} ref={bottomSheetModalRef} />
    </>
  )
}

export default FileNode