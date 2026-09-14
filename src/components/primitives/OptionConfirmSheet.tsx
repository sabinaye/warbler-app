import { AccessibilityRole, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { WOBY } from '../../assets/woby';
import { MessageOption } from '../../domain/conversation';
import { color, radius } from '../../theme/tokens';
import { AppModal } from './AppModal';

type OptionConfirmSheetProps = {
  option: MessageOption | null;
  onCancel: () => void;
  onConfirm: () => void;
};

// A simplified version of the prototype's sheet (which also bundles a "let my contact know when
// I'm back" toggle) — that cross-feature is left for when Support's contact-notification flow
// and this are wired together explicitly, rather than folding it in silently here.
export function OptionConfirmSheet({ option, onCancel, onConfirm }: OptionConfirmSheetProps) {
  const cta = option && /taxi|bus|capsule/i.test(option.title) ? 'Do it' : 'Yes, that one';

  return (
    <AppModal visible={!!option} animationType="slide" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityElementsHidden />
        {option ? (
          <View style={styles.sheet}>
            <View style={styles.grabber} />
            <View style={styles.headerRow}>
              <Image source={WOBY.hero} style={styles.face} />
              <View style={styles.headerTextColumn}>
                <Text style={styles.title}>{option.title}</Text>
                <Text style={styles.body}>{option.why}</Text>
              </View>
            </View>
            <View style={styles.rowsCard}>
              <View style={styles.row}>
                <Text style={styles.rowKey}>Cost</Text>
                <Text style={styles.rowValue}>{option.price}</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.row}>
                <Text style={styles.rowKey}>Detail</Text>
                <Text style={styles.rowValue}>{option.meta}</Text>
              </View>
            </View>
            <Pressable
              onPress={onConfirm}
              accessibilityRole={'button' as AccessibilityRole}
              style={({ pressed }) => [styles.confirmButton, pressed && styles.confirmButtonPressed]}
            >
              <Text style={styles.confirmLabel}>{cta}</Text>
            </Pressable>
            <Pressable onPress={onCancel} accessibilityRole={'button' as AccessibilityRole} style={styles.cancelButton}>
              <Text style={styles.cancelLabel}>Not this one</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(14,28,36,.4)',
  },
  sheet: {
    backgroundColor: color.canvas,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 34,
  },
  grabber: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(22,50,63,.22)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  face: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
  headerTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -0.3,
    color: color.ink,
  },
  body: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  rowsCard: {
    marginTop: 16,
    backgroundColor: color.surface,
    borderRadius: radius.row,
    overflow: 'hidden',
  },
  separator: {
    height: 0.5,
    backgroundColor: color.hairline18,
    marginLeft: 16,
  },
  row: {
    minHeight: 44,
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowKey: {
    fontSize: 17,
    color: color.inkSecondary,
  },
  rowValue: {
    fontSize: 17,
    fontWeight: '600',
    color: color.ink,
    textAlign: 'right',
  },
  confirmButton: {
    marginTop: 16,
    height: 50,
    borderRadius: radius.card,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonPressed: {
    backgroundColor: color.accentPressed,
  },
  confirmLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: color.surface,
  },
  cancelButton: {
    marginTop: 4,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLabel: {
    fontSize: 17,
    color: color.accent,
  },
});
