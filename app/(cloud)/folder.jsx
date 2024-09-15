import { View, Text } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import FolderNode from '../../components/Cloud/Nodes/FolderNode';
import FileNode from '../../components/Cloud/Nodes/FileNode';
import LoadingScreen from '../../components/LoadingScreen';
import { AuthContext } from '../../context/AuthContext';
import { getFolder } from '../../lib/fetch';
import { handleDataShown } from '../../lib/utils';

const FolderScreen = ({ folderId }) => {
  const { user } = useContext(AuthContext);

  const [dataShown, setDataShown] = useState(null);

  const fetchFolderData = async () => {
    const userFolder = await getFolder(folderId);
    const updatedDataShown = await handleDataShown(userFolder);
    setDataShown(updatedDataShown);
  }

  useEffect(() => {
    if (user) fetchFolderData();
  }, [user]);

  return (
    <View className="w-full flex-1 flex">
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
    </View>
  )
}

export default FolderScreen