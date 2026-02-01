import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Modal, Card } from '@ui-kitten/components';
import { customTheme } from '../theme/custom.theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const AppModal = ({ visible, onClose, children }: Props) => {
  if (Platform.OS === 'web') {
    if (!visible) return null;

    return (
      <View style={styles.webBackdrop}>
        <View style={styles.webModal}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <Modal visible={visible} backdropStyle={styles.backdrop} onBackdropPress={onClose}>
      <Card disabled>{children}</Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  webBackdrop: {
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    position: 'absolute'
  },
  webModal: {
    backgroundColor: customTheme['background-alternative-color-2'],
    padding: 16,
    borderRadius: 12,
    minWidth: 320,
    maxWidth: '90%',
  },
});
