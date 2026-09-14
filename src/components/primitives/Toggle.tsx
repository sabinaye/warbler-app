import { AccessibilityRole, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

import { color } from '../../theme/tokens';

const TRACK_WIDTH = 51;
const TRACK_HEIGHT = 31;
const KNOB_SIZE = 27;
const KNOB_INSET = 2;
const KNOB_ON_LEFT = TRACK_WIDTH - KNOB_SIZE - KNOB_INSET; // 22
const DURATION_MS = 250;

type ToggleProps = {
  on: boolean;
  onToggle: () => void;
  accessibilityLabel: string;
};

export function Toggle({ on, onToggle, accessibilityLabel }: ToggleProps) {
  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(on ? color.accent : color.hairline16, { duration: DURATION_MS }),
  }));
  const knobStyle = useAnimatedStyle(() => ({
    left: withTiming(on ? KNOB_ON_LEFT : KNOB_INSET, {
      duration: DURATION_MS,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    }),
  }));

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole={'switch' as AccessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: on }}
      hitSlop={8}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.knob, knobStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  knob: {
    position: 'absolute',
    top: KNOB_INSET,
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: color.surface,
    shadowColor: 'rgba(0,0,0,.18)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
});
