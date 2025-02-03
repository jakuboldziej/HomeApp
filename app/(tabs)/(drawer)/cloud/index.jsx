import { View } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { CloudContext } from '../../../../context/CloudContext';
import FolderScreen from '../../../../components/Cloud/Screens/FolderScreen';

const Cloud = () => {
  const { folders } = useContext(CloudContext);

  const [mainFolder, setMainFolder] = useState(null);

  useEffect(() => {
    if (!folders) return;

    setMainFolder(folders.find((folder) => folder.name === "Cloud drive"));
  }, [folders]);

  return (
    <View className="w-full h-full flex items-center">
      {mainFolder && (
        <FolderScreen folder={mainFolder} />
      )}
    </View>
  )
}

export default Cloud