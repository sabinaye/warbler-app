import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withSequence, withTiming, Easing } from 'react-native-reanimated';

import { color } from '../../theme/tokens';
import { WOBY } from '../../assets/woby';

const TOTAL_MS = 3400;
const FADE_MS = Math.round(TOTAL_MS * 0.1);
const HOLD_MS = TOTAL_MS - FADE_MS * 2;

type ToastProps = {
  message: string | null;
  onDismiss: () => void;
};

// Top-anchored, auto-dismisses at 3.4s. For confirmations that don't need a decision —
// anything the user must decide instead goes through ConfirmAlert.
export function Toast({ message, onDismiss }: ToastProps) {
  const progress = useAnimatedStyle(() => ({
    opacity: withSequence(
      withTiming(1, { duration: FADE_MS, easing: Easing.ease }),
      withTiming(1, { duration: HOLD_MS }),
      withTiming(0, { duration: FADE_MS, easing: Easing.ease }),
    ),
    transform: [
      {
        translateY: withSequence(
          withTiming(0, { duration: FADE_MS, easing: Easing.ease }),
          withTiming(0, { duration: HOLD_MS }),
        ),
      },
    ],
  }));

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, TOTAL_MS);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.toast, progress]}>
        <Image source={WOBY.happy} style={styles.face} />
        <Text style={styles.text} numberOfLines={2}>
          {message}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 67,
    left: 16,
    right: 16,
    zIndex: 95,
    alignItems: 'center',
  },
  toast: {
    maxWidth: '100%',
    backgroundColor: color.ink,
    borderRadius: 20,
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: 'rgba(14,28,36,.6)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 4,
  },
  face: {
    width: 26,
    height: 26,
  },
  text: {
    flexShrink: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: color.surface,
  },
});
