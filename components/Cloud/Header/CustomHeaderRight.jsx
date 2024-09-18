import { IconButton } from 'react-native-paper'
import { useRef, useCallback } from 'react'
import FolderSheet from '../Sheets/FolderSheet'
import FileSheet from '../Sheets/FileSheet';

const CustomHeaderRight = ({ document }) => {
  const bottomSheetModalRef = useRef(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <>
      <IconButton onPress={handlePresentModalPress} className="-mr-0.5" icon="dots-vertical" iconColor='black' size={25} />
      {document.type === "file" ? (
        <FileSheet file={document} ref={bottomSheetModalRef} />
      ) : (
        <FolderSheet folder={document} ref={bottomSheetModalRef} />
      )}
    </>
  )
}

export default CustomHeaderRight