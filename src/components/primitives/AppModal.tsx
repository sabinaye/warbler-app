import { ReactNode } from 'react';
import { Modal } from 'react-native';

export type AppModalProps = {
  visible: boolean;
  animationType?: 'fade' | 'slide' | 'none';
  onRequestClose: () => void;
  children: ReactNode;
};

// Native: react-native's own <Modal> is the right, fully-supported choice (focus handling,
// hardware back button, proper full-screen host) — see AppModal.web.tsx for why web needs a
// different approach entirely.
export function AppModal({ visible, animationType = 'fade', onRequestClose, children }: AppModalProps) {
  return (
    <Modal visible={visible} transparent animationType={animationType} onRequestClose={onRequestClose}>
      {children}
    </Modal>
  );
}
