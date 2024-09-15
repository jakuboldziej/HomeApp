import { router, useLocalSearchParams } from 'expo-router';
import { Platform, Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import React, { useRef, useCallback } from 'react';
import FolderSheet from '../../components/Cloud/Sheets/FolderSheet';
import FileSheet from '../../components/Cloud/Sheets/FileSheet';
import FileScreen from '../../components/Cloud/Screens/FileScreen';
import FolderScreen from './folder';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export default function DocumentScreen() {
  const { _id, folder, file } = useLocalSearchParams();

  const parsedFile = file && JSON.parse(file);
  const parsedFolder = folder && JSON.parse(folder);

  const bottomSheetModalRef = useRef(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={parsedFile ? parsedFile.filename : parsedFolder.name} />
        <Appbar.Action icon={MORE_ICON} onPress={handlePresentModalPress} />
      </Appbar.Header>

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
    </>
  );
}
