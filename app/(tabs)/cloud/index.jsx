import { Platform, ScrollView, Text, View } from 'react-native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import CustomFAB from '../../../components/Custom/CustomFAB';
import { Appbar, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';
import LoadingScreen from '../../../components/LoadingScreen';
import { CloudContext, CloudProvider } from '../../../context/CloudContext';
import FolderScreen from './folder';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const Cloud = () => {
  const { folder, cloudLoading } = useContext(CloudContext);

  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleSelectFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({});

    if (!result.canceled) {
      setSelectedDocument(result);
      console.log(result)
    }
  }

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedDocument(result);
      console.log(result)
    }
  }

  const handleCreateFolder = async (folderName) => {
    console.log(folderName)
  }

  const handleNew = async (type) => {
    if (type === "file") {
      handleSelectFile()
    } else if (type === "folder") {
      handleCreateFolder();
    } else if (type === "image") {
      handleSelectImage()
    }
  }

  return (
    <SafeAreaView className="h-full bg-black">
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View className="w-full h-full flex items-center">
          {cloudLoading === true ? (
            <LoadingScreen text="Loading files..." />
          ) : (
            <FolderScreen folder={folder} />
          )}
          <CustomFAB handleNew={handleNew} handleCreateFolder={handleCreateFolder} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CloudWrapper = () => {
  return (
    <CloudProvider>
      <Cloud />
    </CloudProvider>
  )
}