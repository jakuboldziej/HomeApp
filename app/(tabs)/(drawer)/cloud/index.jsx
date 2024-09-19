import { ScrollView, View } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import CustomFAB from '../../../../components/Custom/CustomFAB';
import { CloudContext, CloudProvider } from '../../../../context/CloudContext';
import FolderScreen from '../../../../components/Cloud/Screens/FolderScreen';
import { Portal } from 'react-native-paper';

const Cloud = () => {
  const { folders } = useContext(CloudContext);

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [mainFolder, setMainFolder] = useState(null);

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

  useEffect(() => {
    if (!folders) return;

    setMainFolder(folders.find((folder) => folder.name === "Cloud drive"));
  }, [folders]);

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <Portal.Host>
        <View className="w-full h-full bg-black flex items-center mt-4">
          {mainFolder && (
            <FolderScreen folder={mainFolder} />
          )}
          <Portal>
            <CustomFAB handleNew={handleNew} handleCreateFolder={handleCreateFolder} />
          </Portal>
        </View>
      </Portal.Host>
    </ScrollView>
  )
}

export default Cloud