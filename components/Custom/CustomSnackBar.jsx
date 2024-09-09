import { Portal, Snackbar } from 'react-native-paper';

const CustomSnackBar = ({ visible, setVisible, title }) => {
  const onDismissSnackBar = () => setVisible(false);

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismissSnackBar}
      duration={3000}
      action={{ label: 'Hide' }}>
      {title}
    </Snackbar>
  )
}

export default CustomSnackBar