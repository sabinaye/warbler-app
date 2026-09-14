import { ReactNode } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

import { color } from '../theme/tokens';

// Expo's static web export's index.html has no background set on <html>/<body> (react-native-web's
// own reset only sets height, not colour) — so any render delay or crash shows the browser's
// default white through the transparent page underneath, not Warbler's cream. Paint it once, as
// early as possible, independent of anything React renders.
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  document.documentElement.style.backgroundColor = color.canvas;
  document.body.style.backgroundColor = color.canvas;
}

const FRAME_MAX_WIDTH = 430;
const FRAME_MAX_HEIGHT = 900;
// Below this viewport width we're looking at an actual phone browser, not a desktop one — the
// app already fills the screen correctly there, so don't frame it.
const FRAME_THRESHOLD_WIDTH = 500;

type WebPhoneFrameProps = {
  children: ReactNode;
};

// Warbler is a phone-only layout. On native that's the only thing it ever runs on, but the web
// build (a dev convenience for previewing without a simulator, and the only way to share a link)
// stretches full-bleed across a desktop browser window with no constraint otherwise — the tab
// bar spreads across the whole monitor, the money ring sits in a sea of empty space, and none of
// it reads as intentional. This frames it the way the design prototype framed itself for review
// in a browser (a centred device silhouette), without touching native builds at all.
export function WebPhoneFrame({ children }: WebPhoneFrameProps) {
  const { width, height } = useWindowDimensions();

  if (Platform.OS !== 'web' || width < FRAME_THRESHOLD_WIDTH) {
    return <>{children}</>;
  }

  const frameWidth = Math.min(FRAME_MAX_WIDTH, width - 64);
  const frameHeight = Math.min(FRAME_MAX_HEIGHT, height - 64);

  return (
    <View style={styles.backdrop}>
      <View style={[styles.frame, { width: frameWidth, height: frameHeight }]}>{children}</View>
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
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: color.canvas,
    boxShadow: '0 30px 70px -20px rgba(22,50,63,.45)',
  },
});
