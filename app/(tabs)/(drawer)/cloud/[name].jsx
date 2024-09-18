import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import React, { useRef } from 'react';
import FolderSheet from '../../../../components/Cloud/Sheets/FolderSheet';
import FileSheet from '../../../../components/Cloud/Sheets/FileSheet';
import FileScreen from './file';
import FolderScreen from './folder';

export default function DocumentScreen() {
  const { name, folder, file } = useLocalSearchParams();

  const parsedFile = file && JSON.parse(file);
  const parsedFolder = folder && JSON.parse(folder);

  const bottomSheetModalRef = useRef(null);

  return (
    <View className="flex-1 bg-black">
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
