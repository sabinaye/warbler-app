import { AccessibilityRole, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';

import { color } from '../../theme/tokens';
import { AppModal } from './AppModal';

export type ConfirmAlertConfig = {
  title: string;
  body: string;
  confirmLabel: string;
  /** True for a destructive action (delete, start over, call emergency services) — renders the confirm label in danger red. */
  destructive?: boolean;
  onConfirm: () => void;
};

type ConfirmAlertProps = {
  config: ConfirmAlertConfig | null;
  onCancel: () => void;
};

// Every destructive or irreversible action in the app routes through this before it happens —
// never fire the side effect directly from a row/button tap.
export function ConfirmAlert({ config, onCancel }: ConfirmAlertProps) {
  return (
    <AppModal visible={!!config} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityElementsHidden />
        {config ? (
          <View style={styles.card}>
            <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, styles.tint]} />
            <View style={styles.textBlock}>
              <Text style={styles.title}>{config.title}</Text>
              <Text style={styles.body}>{config.body}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.buttonRow}>
              <Pressable
                onPress={onCancel}
                accessibilityRole={'button' as AccessibilityRole}
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              >
                <Text style={styles.cancelLabel}>Cancel</Text>
              </Pressable>
              <View style={styles.verticalDivider} />
              <Pressable
                onPress={config.onConfirm}
                accessibilityRole={'button' as AccessibilityRole}
                style={({ pressed }) => [styles.button, pressed && styles.confirmPressed]}
              >
                <Text style={[styles.confirmLabel, { color: config.destructive ? color.danger : color.accent }]}>
                  {config.confirmLabel}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    backgroundColor: 'rgba(14,28,36,.3)',
  },
  card: {
    width: 270,
    borderRadius: 14,
    overflow: 'hidden',
  },
  tint: {
    backgroundColor: color.canvasTranslucent86,
  },
  textBlock: {
    paddingTop: 19,
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    color: color.ink,
    textAlign: 'center',
  },
  body: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: color.ink,
    textAlign: 'center',
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(22,50,63,.2)',
  },
  buttonRow: {
    flexDirection: 'row',
  },
  verticalDivider: {
    width: 0.5,
    backgroundColor: 'rgba(22,50,63,.2)',
  },
  button: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: 'rgba(22,50,63,.06)',
  },
  confirmPressed: {
    backgroundColor: 'rgba(217,43,31,.08)',
  },
  cancelLabel: {
    fontSize: 17,
    color: color.accent,
  },
  confirmLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
});
