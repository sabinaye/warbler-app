import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming, Easing } from 'react-native-reanimated';

import { color } from '../../theme/tokens';
import { tabularNums } from '../../theme/typography';

const SIZE = 180;
const VIEWBOX = 120;
const RADIUS = 54;
const STROKE_WIDTH = 11;
const CIRCUMFERENCE = 339; // matches the prototype's literal stroke-dasharray, not 2*pi*r

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type MoneyRingProps = {
  /** 0–1. 1 = ring fully filled (all of the budget remaining). */
  fraction: number;
  amountLabel: string;
  caption: string;
  statusLabel: string;
  statusColor: string;
  statusBackground: string;
};

export function MoneyRing({ fraction, amountLabel, caption, statusLabel, statusColor, statusBackground }: MoneyRingProps) {
  const progress = useSharedValue(fraction);

  useEffect(() => {
    progress.value = withTiming(fraction, { duration: 600, easing: Easing.bezier(0.2, 0.8, 0.2, 1) });
  }, [fraction, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE - CIRCUMFERENCE * progress.value,
  }));

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}>
        <Circle cx={60} cy={60} r={RADIUS} fill="none" stroke={color.tintWash45} strokeWidth={STROKE_WIDTH} />
        <AnimatedCircle
          cx={60}
          cy={60}
          r={RADIUS}
          fill="none"
          stroke={statusColor}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
          rotation={-90}
          origin="60, 60"
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.amount}>{amountLabel}</Text>
        <Text style={styles.caption}>{caption}</Text>
        <View style={[styles.pill, { backgroundColor: statusBackground }]}>
          <View style={[styles.pillDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.pillLabel, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 34,
    letterSpacing: -1,
    color: color.ink,
    ...tabularNums,
  },
  caption: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkSecondary,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 22,
    paddingLeft: 7,
    paddingRight: 9,
    borderRadius: 11,
    marginTop: 8,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
});
