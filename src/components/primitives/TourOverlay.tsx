import { useEffect } from 'react';
import { AccessibilityRole, Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, Mask, Rect } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { WOBY } from '../../assets/woby';
import { ChevronBackIcon } from '../icons/icons';
import { color, radius } from '../../theme/tokens';
import { useTourStore } from '../../state/tourStore';
import { TOUR_STEPS } from '../../data/tour';
import { Spot } from '../../state/tourStore';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

function SpotlightRing({ spot, delayMs }: { spot: Spot; delayMs: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(delayMs, withRepeat(withTiming(1, { duration: 1700, easing: Easing.inOut(Easing.ease) }), -1, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ringProps = useAnimatedProps(() => ({
    strokeWidth: 2.5 + progress.value * 2,
    strokeOpacity: 1 - progress.value * 0.45,
  }));
  const haloProps = useAnimatedProps(() => ({
    opacity: 0.5 * (1 - progress.value),
    scale: 1 + progress.value * 0.06,
  }));

  const cx = spot.x + spot.width / 2;
  const cy = spot.y + spot.height / 2;

  return (
    <>
      <AnimatedRect
        x={spot.x - 5}
        y={spot.y - 5}
        width={spot.width + 10}
        height={spot.height + 10}
        rx={spot.radius + 5}
        fill="none"
        stroke={color.tintLight}
        strokeWidth={6}
        animatedProps={haloProps}
        origin={`${cx}, ${cy}`}
      />
      <AnimatedRect
        x={spot.x}
        y={spot.y}
        width={spot.width}
        height={spot.height}
        rx={spot.radius}
        fill="none"
        stroke={color.canvas}
        animatedProps={ringProps}
      />
    </>
  );
}

export function TourOverlay({ onAct }: { onAct: (act: string) => void }) {
  const stepIndex = useTourStore((s) => s.stepIndex);
  const spots = useTourStore((s) => s.spots);
  const cardOnTop = useTourStore((s) => s.cardOnTop);
  const next = useTourStore((s) => s.next);
  const back = useTourStore((s) => s.back);
  const skip = useTourStore((s) => s.skip);

  if (stepIndex === null) return null;

  const step = TOUR_STEPS[stepIndex];
  const { width, height } = Dimensions.get('window');
  const isLast = stepIndex === TOUR_STEPS.length - 1;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {spots && spots.length ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <Defs>
              <Mask id="tourMask">
                <Rect x={0} y={0} width={width} height={height} fill="#fff" />
                {spots.map((spot, i) => (
                  <Rect key={i} x={spot.x} y={spot.y} width={spot.width} height={spot.height} rx={spot.radius} fill="#000" />
                ))}
              </Mask>
            </Defs>
            <Rect x={0} y={0} width={width} height={height} fill="rgba(14,28,36,.62)" mask="url(#tourMask)" />
            {spots.map((spot, i) => (
              <SpotlightRing key={i} spot={spot} delayMs={i * 180} />
            ))}
          </Svg>
        </View>
      ) : null}

      <View style={[styles.card, cardOnTop ? styles.cardTop : styles.cardBottom]}>
        <View style={styles.headerRow}>
          <Image source={WOBY[step.face]} style={styles.face} />
          <View style={styles.headerTextColumn}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{step.label}</Text>
              <Text style={styles.count}>
                {stepIndex + 1} of {TOUR_STEPS.length}
              </Text>
            </View>
            <Text style={styles.body}>{step.body}</Text>
            <View style={styles.litUpRow}>
              <View style={styles.litUpDot} />
              <Text style={styles.litUpLabel}>Lit up: {step.spotNote}</Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => onAct(step.act)}
          accessibilityRole={'button' as AccessibilityRole}
          style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
        >
          <Text style={styles.ctaLabel}>{step.cta}</Text>
        </Pressable>

        <View style={styles.footerRow}>
          <Pressable onPress={skip} accessibilityRole={'button' as AccessibilityRole} style={styles.footerButton}>
            <Text style={styles.skipLabel}>Skip</Text>
          </Pressable>
          {stepIndex > 0 ? (
            <Pressable onPress={back} accessibilityRole={'button' as AccessibilityRole} style={[styles.footerButton, styles.backButton]}>
              <ChevronBackIcon color={color.accent} />
              <Text style={styles.backLabel}>Back</Text>
            </Pressable>
          ) : null}
          <View style={styles.dotsRow}>
            {TOUR_STEPS.map((_, i) => (
              <View key={i} style={[styles.dot, { backgroundColor: i === stepIndex ? color.accent : 'rgba(22,50,63,.2)' }]} />
            ))}
          </View>
          <Pressable onPress={next} accessibilityRole={'button' as AccessibilityRole} style={styles.nextButton}>
            <Text style={styles.nextLabel}>{isLast ? "That's it" : 'Next'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 12,
    right: 12,
    backgroundColor: color.canvas,
    borderRadius: radius.sheet,
    padding: 16,
    shadowColor: 'rgba(14,28,36,.55)',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  cardTop: {
    top: 72,
  },
  cardBottom: {
    bottom: 95,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  face: {
    width: 52,
    height: 52,
    resizeMode: 'contain',
  },
  headerTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  label: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
    lineHeight: 22,
    color: color.ink,
  },
  count: {
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
  body: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 20,
    color: color.ink,
  },
  litUpRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  litUpDot: {
    width: 9,
    height: 9,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: color.accent,
  },
  litUpLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: color.inkSecondary,
  },
  ctaButton: {
    marginTop: 12,
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(42,123,164,.12)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  ctaButtonPressed: {
    backgroundColor: 'rgba(42,123,164,.22)',
  },
  ctaLabel: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: color.accent,
    textAlign: 'center',
  },
  footerRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerButton: {
    minHeight: 44,
    justifyContent: 'center',
  },
  skipLabel: {
    fontSize: 15,
    color: color.inkSecondary,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backLabel: {
    fontSize: 15,
    color: color.accent,
  },
  dotsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  nextButton: {
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: color.surface,
  },
});
