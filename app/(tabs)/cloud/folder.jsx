import { View, Text, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import FolderNode from '../../../components/Cloud/Nodes/FolderNode';
import FileNode from '../../../components/Cloud/Nodes/FileNode';
import LoadingScreen from '../../../components/LoadingScreen';
import { AuthContext } from '../../../context/AuthContext';
import { handleDataShown } from '../../../lib/utils';

const FolderScreen = ({ folder }) => {
  const { user } = useContext(AuthContext);

  const [dataShown, setDataShown] = useState(null);

  const handleFolderData = async () => {
    const updatedDataShown = await handleDataShown(folder);
    if (!updatedDataShown) setDataShown([]);
    else setDataShown(updatedDataShown);
  }

  useEffect(() => {
    if (user) handleFolderData();
  }, [user]);

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }} className="mt-4">
      <View className="w-full flex-1 flex bg-black">
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
    </ScrollView>
  )
}

export default FolderScreen