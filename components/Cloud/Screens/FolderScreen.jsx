import { View, Text, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import FolderNode from '../Nodes/FolderNode';
import FileNode from '../Nodes/FileNode';
import LoadingScreen from '../../LoadingScreen';
import { AuthContext } from '../../../context/AuthContext';
import { handleDataShown } from '../../../lib/utils';
import { Portal } from 'react-native-paper';
import CustomFAB from '../../Custom/CustomFAB'

const FolderScreen = ({ folder }) => {
  const { user } = useContext(AuthContext);

  const [dataShown, setDataShown] = useState(null);
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

  const handleFolderData = async () => {
    const updatedDataShown = await handleDataShown(folder);
    if (!updatedDataShown) setDataShown([]);
    else setDataShown(updatedDataShown);
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
    if (user) handleFolderData();
  }, [user]);

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <Portal.Host>
        <View className="w-full flex-1 flex bg-black mt-4">
          {dataShown === null ? (
            <LoadingScreen text="Loading files..." />
          ) : dataShown.length > 0 ? (
            dataShown.map((data) => (
              <View key={data._id}>
                {data.type === "folder" ? <FolderNode folder={data} /> : <FileNode file={data} />}
              </View>
            ))
          ) : (
            <Text className="text-center text-2xl text-gray-500 mt-12">No files...</Text>
          )}

          <Portal>
            <CustomFAB handleNew={handleNew} handleCreateFolder={handleCreateFolder} />
          </Portal>
        </View>
      </Portal.Host>
    </ScrollView>
  )
}

export default FolderScreen