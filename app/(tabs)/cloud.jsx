import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { FileImage, FileUp } from 'lucide-react-native';
import { SegmentedButtons, TouchableRipple } from 'react-native-paper';

const Cloud = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [segmentedButtonsValue, setSegmentedButtonsValue] = useState('file')

  const handleSelectFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    console.log(result)
    if (!result.canceled) setSelectedDocument(result);
  }

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    console.log(result)
    if (!result.canceled) setSelectedDocument(result);

  }

  return (
    <SafeAreaView className="h-full bg-black">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full h-full flex items-center p-4">
          <Text className="text-white text-3xl font-psemibold pt-4">Cloud App</Text>
          <SegmentedButtons
            value={segmentedButtonsValue}
            onValueChange={setSegmentedButtonsValue}
            buttons={[
              { value: 'file', label: 'File' },
              { value: 'image', label: 'Image' }
            ]}
            className="bg-white rounded-full mt-6"
            theme={{
              colors: {
                secondaryContainer: '#475569',
                onSecondaryContainer: 'white',
                outline: 'transparent',
                primary: 'transparent'
              }
            }}
          />
          <TouchableRipple
            className="bg-[#475569] rounded-2xl mt-6 w-11/12 h-1/2 flex items-center justify-center"
            onPress={segmentedButtonsValue === 'file' ? handleSelectFile : handleSelectImage}
          >
            <>
              {segmentedButtonsValue === 'file' ? <FileUp color="white" size={150} /> : <FileImage color="white" size={150} />}
              <Text className="text-white text-2xl font-pregular mt-5">
                {segmentedButtonsValue === 'file' ? 'Upload file' : 'Upload image'}
              </Text>
            </>
          </TouchableRipple>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Cloud