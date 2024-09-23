import { View, Text, ScrollView, RefreshControl } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import FolderNode from '../Nodes/FolderNode';
import FileNode from '../Nodes/FileNode';
import LoadingScreen from '../../LoadingScreen';
import { AuthContext } from '../../../context/AuthContext';
import { handleDataShown } from '../../../lib/utils';
import { Portal } from 'react-native-paper';
import CustomFAB from '../../Custom/CustomFAB'
import { CloudContext } from '../../../context/CloudContext';

const FolderScreen = ({ folder }) => {
  const { user } = useContext(AuthContext);
  const { setSnackbarVisible, setSnackbarTitle } = useContext(CloudContext);

  const [dataShown, setDataShown] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [refreshing, setRefreshing] = useState(false);


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
    setSnackbarTitle(`Created new folder: ${folderName}`)
    setSnackbarVisible(true);
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setDataShown(null);
    await handleFolderData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (user) handleFolderData();
  }, [user]);

  return (
    <Portal.Host>
      <View style={{ flex: 1, backgroundColor: 'black', marginTop: 4 }}>
        {dataShown === null ? (
          <LoadingScreen text="Loading files..." />
        ) : dataShown.length > 0 ? (
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {dataShown.map((data) => (
              <View key={data._id}>
                {data.type === "folder" ? <FolderNode folder={data} /> : <FileNode file={data} />}
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={{ textAlign: 'center', fontSize: 24, color: 'gray', marginTop: 12 }}>No files...</Text>
        )}

        <Portal>
          <CustomFAB handleNew={handleNew} handleCreateFolder={handleCreateFolder} />
        </Portal>
      </View>
    </Portal.Host >
  )
}

export default FolderScreen