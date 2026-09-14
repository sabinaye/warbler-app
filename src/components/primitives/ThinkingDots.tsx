import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { WOBY } from '../../assets/woby';
import { color } from '../../theme/tokens';
import { shadowStyle } from '../../theme/shadow';

function Dot({ delay }: { delay: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(1, { duration: 600 }), withTiming(0, { duration: 600 })), -1, false),
    );
  }, [delay, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.4 + progress.value * 0.6,
    transform: [{ translateY: -progress.value * 3 }],
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

export function ThinkingDots() {
  return (
    <View style={styles.row}>
      <Image source={WOBY.hero} style={styles.face} />
      <View style={styles.bubble}>
        <Dot delay={0} />
        <Dot delay={180} />
        <Dot delay={360} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  face: {
    width: 40,
    height: 46,
    resizeMode: 'contain',
  },
  bubble: {
    backgroundColor: color.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 6,
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 5,
    ...shadowStyle({ offsetX: 0, offsetY: 1, blur: 2, color: 'rgba(22,50,63,.07)' }),
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: color.tint,
  },
});
