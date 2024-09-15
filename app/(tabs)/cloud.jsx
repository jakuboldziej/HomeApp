import { ScrollView, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import CustomFAB from '../../components/Custom/CustomFAB';
import { getCloudUser, getFolder } from '../../lib/fetch';
import { AuthContext } from '../../context/AuthContext';
import { handleDataShown } from '../../lib/utils';
import FolderScreen from '../(cloud)/folder';

const Cloud = () => {
  const { user } = useContext(AuthContext);

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [cloudUserMainFolderId, setCloudUserMainFolderId] = useState(null);

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
    setCloudUserMainFolderId(cloudUser.main_folder);
  }

  useEffect(() => {
    if (user) fetchCloudFiles();
  }, [user]);

  return (
    <SafeAreaView className="h-full bg-black">
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View className="w-full h-full flex items-center">
          <Text className="text-white text-3xl font-psemibold pt-8">Cloud</Text>

          {cloudUserMainFolderId && <FolderScreen folderId={cloudUserMainFolderId} />}

          <CustomFAB handleNew={handleNew} handleCreateFolder={handleCreateFolder} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Cloud