import { AccessibilityRole, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, touchTarget } from '../../theme/tokens';
import { ChevronBackIcon } from '../icons/icons';

// 103px in the design_handoff_warbler prototype = a fixed 44px control row sitting on top of
// that device's 59px safe-area top inset. We reproduce it as insets.top + 44 so the same header
// row height holds across real devices with different safe-area insets.
export const CONTROL_ROW_HEIGHT = 44;
// The prototype's content starts 24px below the header's bottom edge (127 - 103).
export const HEADER_TO_CONTENT_GAP = 24;

export function usePushedHeaderHeight() {
  const insets = useSafeAreaInsets();
  return insets.top + CONTROL_ROW_HEIGHT;
}

type PushedScreenHeaderProps = {
  title: string;
  backLabel: string;
  onBack: () => void;
};

export function PushedScreenHeader({ title, backLabel, onBack }: PushedScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const height = insets.top + CONTROL_ROW_HEIGHT;

  return (
    <View style={[styles.container, { height }]}>
      <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.tint]} />
      <View style={styles.row}>
        <Pressable
          onPress={onBack}
          accessibilityRole={'button' as AccessibilityRole}
          accessibilityLabel="Back"
          hitSlop={8}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        >
          <ChevronBackIcon />
          <Text style={styles.backLabel}>{backLabel}</Text>
        </Pressable>
        <View style={styles.titleWrap} pointerEvents="none">
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: color.hairline18,
    overflow: 'hidden',
  },
  tint: {
    backgroundColor: color.canvasTranslucent86,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    // Bottom-aligned, not centered: with a real safe-area top inset the container is taller
    // than the 44px control row, and the control row sits at the bottom of it (matching the
    // source design's `align-items:flex-end`) — centering only looked right by coincidence
    // while insets were stuck at 0 and the container height equalled the row height exactly.
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  backButton: {
    minWidth: touchTarget.min,
    height: touchTarget.min,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  backButtonPressed: {
    opacity: 0.4,
  },
  backLabel: {
    fontSize: 17,
    color: color.accent,
  },
  // Centred on the full row width, not the space remaining after the back button —
  // matches the prototype's `margin-left:-88px` trick (2x the back button's ~44px reach).
  titleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 4,
    height: touchTarget.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: color.ink,
  },
});
