import { ReactNode } from 'react';
import { AccessibilityRole, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { color, radius } from '../../theme/tokens';
import { shadowStyle } from '../../theme/shadow';

const REVEAL_WIDTH = 88;

type SwipeToRemoveRowProps = {
  children: ReactNode;
  onRemove: () => void;
};

// Swipe left reveals a fixed-width "Remove" action; committing requires an explicit tap on it
// (the design doesn't auto-delete past a drag threshold — swipe just opens the action).
export function SwipeToRemoveRow({ children, onRemove }: SwipeToRemoveRowProps) {
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((e) => {
      translateX.value = Math.min(0, Math.max(-REVEAL_WIDTH, startX.value + e.translationX));
    })
    .onEnd(() => {
      const shouldOpen = translateX.value < -REVEAL_WIDTH / 2;
      translateX.value = withTiming(shouldOpen ? -REVEAL_WIDTH : 0, { duration: 220 });
    });

  const tap = Gesture.Tap().onEnd(() => {
    if (translateX.value < -10) {
      translateX.value = withTiming(0, { duration: 220 });
    }
  });

  const composed = Gesture.Simultaneous(pan, tap);

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.wrap}>
      <View style={styles.actionUnderlay}>
        <Pressable
          onPress={onRemove}
          accessibilityRole={'button' as AccessibilityRole}
          accessibilityLabel="Remove"
          style={styles.removeButton}
        >
          <Text style={styles.removeLabel}>Remove</Text>
        </Pressable>
      </View>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.foreground, rowStyle]}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  actionUnderlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  removeButton: {
    width: REVEAL_WIDTH,
    backgroundColor: color.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: color.surface,
  },
  foreground: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    ...shadowStyle({ offsetX: 0, offsetY: 1, blur: 2, color: 'rgba(22,50,63,.07)' }),
  },
});
