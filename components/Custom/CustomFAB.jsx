import { useState, useEffect } from 'react';
import { Keyboard, ScrollView } from 'react-native';
import { Button, Dialog, FAB, TextInput } from 'react-native-paper';
import CustomDialog from './CustomDialog';

const CustomFAB = ({ handleNew, handleCreateFolder }) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [openedFAB, setOpenedFAB] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [folderName, setFolderName] = useState('');

  const onStateChange = ({ open }) => setOpenedFAB(open);

  const FABCreateFolder = async () => {
    setVisibleDialog(false);
    setIsLoading(true);
    await handleCreateFolder(folderName);
    setIsLoading(false);
    setFolderName('');
  }

  const handleCloseDialog = () => {
    setVisibleDialog(false);
    setFolderName('');
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <>
      <FAB.Group
        open={openedFAB}
        visible={!keyboardVisible}
        backdropColor='rgba(0, 0, 0, 0.74)'
        icon={openedFAB ? 'close' : 'plus'}
        label={openedFAB ? '' : 'New'}
        style={{ position: 'absolute', bottom: 65, zIndex: 1000 }}
        actions={[
          {
            icon: 'file',
            label: 'File',
            onPress: () => handleNew('file'),
            labelTextColor: 'white',
          },
          {
            icon: 'image',
            label: 'Image',
            onPress: () => handleNew('image'),
            labelTextColor: 'white'
          },
          {
            icon: 'folder',
            label: 'Folder',
            onPress: () => setVisibleDialog('folder'),
            labelTextColor: 'white'
          }
        ]}
        onStateChange={onStateChange}
      />

      <CustomDialog visibleDialog={visibleDialog} setVisibleDialog={setVisibleDialog}>
        <Dialog.Title>Create new folder</Dialog.Title>
        <Dialog.Content>
          <ScrollView keyboardShouldPersistTaps='handled'>
            <TextInput
              label='Folder name'
              autoFocus
              onChangeText={(e) => setFolderName(e)}
              onSubmitEditing={() => FABCreateFolder()}
              activeUnderlineColor='green'
              className="bg-white"
            />
          </ScrollView>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => handleCloseDialog()}>Cancel</Button>
          <Button loading={isLoading} disabled={folderName.trim() === ''} onPress={() => FABCreateFolder()}>Create</Button>
        </Dialog.Actions>
      </CustomDialog>
    </>
  );
};

export default CustomFAB;