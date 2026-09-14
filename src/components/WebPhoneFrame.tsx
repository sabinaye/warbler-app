import { ReactNode, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { color } from '../theme/tokens';
import { useBatteryLevel } from '../hooks/useBatteryLevel';

// Expo's static web export's index.html has no background set on <html>/<body> (react-native-web's
// own reset only sets height, not colour) — so any render delay or crash shows the browser's
// default white through the transparent page underneath, not Warbler's cream. Paint it once, as
// early as possible, independent of anything React renders.
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  document.documentElement.style.backgroundColor = color.canvas;
  document.body.style.backgroundColor = color.canvas;
}

// iPhone 14 Pro logical size and safe-area insets — same point dimensions as the 15/16 base
// (identical 6.1" screen class, same Dynamic Island), which is also the README's own reference
// device ("designed at 393 × 852").
const FRAME_WIDTH = 393;
const FRAME_HEIGHT = 852;
const STATUS_BAR_HEIGHT = 59;
const HOME_INDICATOR_HEIGHT = 34;
const SAFE_AREA_INSETS = { top: STATUS_BAR_HEIGHT, bottom: HOME_INDICATOR_HEIGHT, left: 0, right: 0 };
const DEVICE_CORNER_RADIUS = 55;

// Below this viewport width we're looking at an actual phone browser, not a desktop one — the
// app already fills the screen correctly there, so don't frame it.
const FRAME_THRESHOLD_WIDTH = 500;

type WebPhoneFrameProps = {
  children: ReactNode;
};

function useClock(): string {
  const [label, setLabel] = useState(() => formatClock(new Date()));
  useEffect(() => {
    const id = setInterval(() => setLabel(formatClock(new Date())), 15000);
    return () => clearInterval(id);
  }, []);
  return label;
}

function formatClock(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const hour12 = ((hours + 11) % 12) + 1;
  return `${hour12}:${String(minutes).padStart(2, '0')}`;
}

function SignalIcon() {
  return (
    <Svg width={17} height={11} viewBox="0 0 17 11" fill={color.ink}>
      <Rect x={0} y={7.5} width={3} height={3.5} rx={1} />
      <Rect x={4.6} y={5.4} width={3} height={5.6} rx={1} />
      <Rect x={9.2} y={3} width={3} height={8} rx={1} />
      <Rect x={13.8} y={0} width={3} height={11} rx={1} opacity={0.3} />
    </Svg>
  );
}

function BatteryGlyph({ level }: { level: number | null }) {
  const pct = level ?? 80;
  const fillColor = pct < 20 ? color.warningInk : color.ink;
  return (
    <View style={styles.batteryRow}>
      <View style={styles.batteryOutline}>
        <View style={[styles.batteryFill, { width: `${pct}%`, backgroundColor: fillColor }]} />
      </View>
      <View style={styles.batteryNub} />
    </View>
  );
}

// Warbler is a phone-only layout. On native that's the only thing it ever runs on, but the web
// build (a dev convenience for previewing without a simulator, and the only way to share a link)
// stretches full-bleed across a desktop browser window otherwise — the tab bar spreads across the
// whole monitor, the money ring sits in a sea of empty space, and none of it reads as intentional.
// This frames it the way the design prototype framed itself for review in a browser: a real
// status bar (clock, signal, battery) and Dynamic Island up top, a home indicator at the bottom —
// the safe-area insets fed to the app below are exactly what those reserve, so the app's own
// headers and tab bar land in the same place they would on the real device.
export function WebPhoneFrame({ children }: WebPhoneFrameProps) {
  const { width, height } = useWindowDimensions();
  const clock = useClock();
  const batteryLevel = useBatteryLevel();

  const isFramed = Platform.OS === 'web' && width >= FRAME_THRESHOLD_WIDTH;

  if (!isFramed) {
    return <SafeAreaProvider>{children}</SafeAreaProvider>;
  }

  // Real 1:1 size whenever the window has room for it; only shrinks (as a visual scale, not a
  // layout resize, so the app inside still measures itself at true 393×852) when the browser
  // window itself is smaller than that.
  const scale = Math.min(1, (width - 64) / FRAME_WIDTH, (height - 64) / FRAME_HEIGHT);

  return (
    <View style={styles.backdrop}>
      <View style={[styles.frame, { width: FRAME_WIDTH, height: FRAME_HEIGHT, transform: [{ scale }] }]}>
        <SafeAreaProvider
          initialMetrics={{
            insets: SAFE_AREA_INSETS,
            frame: { x: 0, y: 0, width: FRAME_WIDTH, height: FRAME_HEIGHT },
          }}
        >
          {children}
        </SafeAreaProvider>

        <View style={styles.statusBar} pointerEvents="none">
          <Text style={styles.clockText}>{clock}</Text>
          <View style={styles.dynamicIsland} />
          <View style={styles.statusIconsRow}>
            <SignalIcon />
            <BatteryGlyph level={batteryLevel} />
          </View>
        </View>

        <View style={styles.homeIndicatorArea} pointerEvents="none">
          <View style={styles.homeIndicator} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E7E3D6',
  },
  frame: {
    borderRadius: DEVICE_CORNER_RADIUS,
    overflow: 'hidden',
    backgroundColor: color.canvas,
    boxShadow: '0 30px 70px -20px rgba(22,50,63,.45)',
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: STATUS_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  clockText: {
    width: 54,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: color.ink,
    fontVariant: ['tabular-nums'],
  },
  dynamicIsland: {
    width: 126,
    height: 37,
    borderRadius: 19,
    backgroundColor: '#000',
    marginTop: 2,
  },
  statusIconsRow: {
    width: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
  },
  batteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  batteryOutline: {
    width: 22,
    height: 11,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(22,50,63,.4)',
    padding: 1.5,
  },
  batteryFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  batteryNub: {
    width: 1.5,
    height: 4,
    borderRadius: 1,
    backgroundColor: 'rgba(22,50,63,.4)',
  },
  homeIndicatorArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: HOME_INDICATOR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    width: 140,
    height: 5,
    borderRadius: 3,
    backgroundColor: color.ink,
    opacity: 0.85,
  },
});
