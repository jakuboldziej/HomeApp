import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import React, { useRef } from 'react';
import FolderSheet from '../../../../components/Cloud/Sheets/FolderSheet';
import FileSheet from '../../../../components/Cloud/Sheets/FileSheet';
import FolderScreen from '../../../../components/Cloud/Screens/FolderScreen';
import FileScreen from '../../../../components/Cloud/Screens/FileScreen';

export default function DocumentScreen() {
  const { name, folder, file } = useLocalSearchParams();

  const parsedFile = file && JSON.parse(file);
  const parsedFolder = folder && JSON.parse(folder);

  const bottomSheetModalRef = useRef(null);

  return (
    <View className="flex-1 bg-black mt-4">
      {parsedFile && (
        <>
          <FileScreen file={parsedFile} />
          <FileSheet file={parsedFile} ref={bottomSheetModalRef} />
        </>
      )}
      {parsedFolder && (
        <>
          <FolderScreen folder={parsedFolder} />
          <FolderSheet folder={parsedFolder} ref={bottomSheetModalRef} />
        </>
      )}
    </View>
  );
}
