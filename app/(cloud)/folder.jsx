import { View, Text } from 'react-native';
import React from 'react';
import FolderNode from '../../components/Cloud/Nodes/FolderNode';
import FileNode from '../../components/Cloud/Nodes/FileNode';
import LoadingScreen from '../../components/LoadingScreen';

const FolderScreen = ({ folder }) => {
  return (
    <View className="w-full flex-1 flex">
      {folder === null ? (
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