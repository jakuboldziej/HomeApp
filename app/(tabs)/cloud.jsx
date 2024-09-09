import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import CustomFAB from '../../components/Custom/CustomFAB';

const Cloud = () => {
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
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full h-full flex items-center p-4">
          <Text className="text-white text-3xl font-psemibold pt-4">Cloud App</Text>

          <CustomFAB handleNew={handleNew} handleCreateFolder={handleCreateFolder} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Cloud