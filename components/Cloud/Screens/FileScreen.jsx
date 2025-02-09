import { Linking, View } from 'react-native';
import { apiUrl } from '../../../lib/fetch';
import { Image } from 'expo-image';
import { Zoomable } from '@likashefqet/react-native-image-zoom';
import React, { useRef } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import CustomButton from '../../Custom/CustomButton';
import { useLocalSearchParams } from 'expo-router';
import FileSheet from '../Sheets/FileSheet';

const FileScreen = () => {
  const { file: fileParam } = useLocalSearchParams();
  const file = JSON.parse(fileParam);

  const fileSource = `${apiUrl}/ftp/files/render/${file.filename}`;

  const ref = useRef(null);
  const scale = useSharedValue(1);
  const minScale = 1;
  const maxScale = 5;

  const bottomSheetModalRef = useRef(null);

  const handleRenderFileType = () => {
    if (file.contentType.split("/")[0] === "image") {
      return (
        <Zoomable
          ref={ref}
          minScale={minScale}
          maxScale={maxScale}
          scale={scale}
          doubleTapScale={3}
          minPanPointers={1}
          isSingleTapEnabled
          isDoubleTapEnabled
          style={{ flex: 1, width: '100%' }}
        >
          <Image
            style={{ flex: 1, width: '100%' }}
            source={{ uri: fileSource }}
            contentFit='contain'
            transition={600}
          />
        </Zoomable>
      )
    } else if (file.contentType.split("/")[1] === "pdf") {
      return (
        <View className="flex-1 items-center justify-center">
          <CustomButton onPress={() => Linking.openURL(fileSource)} title="Download File" />
        </View>
      )
    } else {
      return (
        <View className="flex-1 items-center justify-center">
          <CustomButton onPress={() => Linking.openURL(fileSource)} title="Download File" />
        </View>
      )
    }
  }

  return (
    <>
      <View className="flex-1">
        {handleRenderFileType()}
      </View>

      <FileSheet file={file} ref={bottomSheetModalRef} />
    </>
  );
};

export default FileScreen;
