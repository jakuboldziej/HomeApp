import { View, Text, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import CustomFAB from '../../components/Custom/CustomFAB';
import { getCloudUser, getFolder } from '../../lib/fetch';
import { AuthContext } from '../../context/AuthContext';
import { handleDataShown } from '../../lib/utils';
import FileNode from '../../components/Cloud/Nodes/FileNode';
import FolderNode from '../../components/Cloud/Nodes/FolderNode';
import LoadingScreen from '../../components/LoadingScreen'

const Cloud = () => {
  const { user } = useContext(AuthContext);

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [dataShown, setDataShown] = useState(null);

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

  const fetchCloudFiles = async () => {
    const cloudUser = await getCloudUser(user.displayName);
    const userMainFolder = await getFolder(cloudUser.main_folder);
    const updatedDataShown = await handleDataShown(userMainFolder);
    setDataShown(updatedDataShown);
  }

  useEffect(() => {
    if (user) fetchCloudFiles();
  }, [user]);

  return (
    <SafeAreaView className="h-full bg-black">
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View className="w-full h-full flex items-center">
          <Text className="text-white text-3xl font-psemibold pt-4">Cloud</Text>

          <CustomFAB handleNew={handleNew} handleCreateFolder={handleCreateFolder} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Cloud