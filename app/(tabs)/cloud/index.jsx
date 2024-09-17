import { ScrollView, View } from 'react-native';
import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import CustomFAB from '../../../components/Custom/CustomFAB';
import { CloudContext, CloudProvider } from '../../../context/CloudContext';
import FolderScreen from './folder';
import { StatusBar } from 'expo-status-bar';

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
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <View className="w-full h-full bg-black flex items-center">
        {folder && (
          <FolderScreen folder={folder} />
        )}
        <CustomFAB handleNew={handleNew} handleCreateFolder={handleCreateFolder} />
      </View>
    </ScrollView>
  )
}

export default CloudWrapper = () => {
  return (
    <CloudProvider>
      <Cloud />
    </CloudProvider>
  )
}