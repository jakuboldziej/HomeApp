import React from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const CustomModal = ({ visible, onDismiss, dismissable = true, contentContainerStyle, children }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={dismissable ? onDismiss : undefined}
    >
      <TouchableWithoutFeedback onPress={dismissable ? onDismiss : undefined}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.content, contentContainerStyle]}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    minWidth: 200,
  },
});

export default CustomModal;
