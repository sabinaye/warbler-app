import { ReactNode, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { color, spacing } from '../../theme/tokens';
import { CONTROL_ROW_HEIGHT } from './PushedScreenHeader';
import { TAB_CONTROL_ROW_HEIGHT } from './TabBar';

// The collapsed small-title bar that crossfades in once the large title has scrolled past —
// a binary threshold in the prototype (scrollTop > 34), not a continuous scroll-linked fade.
const SOLID_THRESHOLD = 34;
const FADE_DURATION_MS = 200;

function TabScreenHeader({ title, solid }: { title: string; solid: boolean }) {
  const insets = useSafeAreaInsets();
  const height = insets.top + CONTROL_ROW_HEIGHT;
  const style = useAnimatedStyle(() => ({ opacity: withTiming(solid ? 1 : 0, { duration: FADE_DURATION_MS }) }));

  return (
    <Animated.View pointerEvents="none" style={[styles.header, { height }, style]}>
      <BlurView intensity={35} tint="light" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.headerTint]} />
      <View style={styles.headerTitleWrap}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </Animated.View>
  );
}

type TabScreenProps = {
  /** Shown in the collapsed header once scrolled — usually the same text as the large title. */
  title: string;
  children: ReactNode;
};

// Chrome shared by all five tabs: scrollable content starting 66px down (the large title lives
// in `children`, not here), with a tab-bar-height allowance at the bottom and the collapsing
// small-title bar overlaid on top.
export function TabScreen({ title, children }: TabScreenProps) {
  const insets = useSafeAreaInsets();
  const [solid, setSolid] = useState(false);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const isSolid = event.nativeEvent.contentOffset.y > SOLID_THRESHOLD;
    if (isSolid !== solid) setSolid(isSolid);
  };

  const bottomPadding = insets.bottom + TAB_CONTROL_ROW_HEIGHT + 16;
  // 66px in the prototype = its fixed device mockup's 59px status-bar inset + 7px breathing
  // room (see PushedScreenHeader, which reproduces the same 59+44 relationship for its own
  // header row). insets.top + 7 generalizes that to whatever a given device actually reports —
  // a hardcoded 66 only looked right on the desktop web preview, which fakes a 59px inset to
  // match that same mockup; on a real phone (a different inset, often smaller) it stacked on
  // top of space the browser already reserves for the notch/Dynamic Island itself, pushing the
  // title further down than intended.
  const topPadding = insets.top + 7;

  return (
    <View style={styles.root}>
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={32}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPadding, paddingBottom: bottomPadding },
        ]}
      >
        {children}
      </ScrollView>
      <TabScreenHeader title={title} solid={solid} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.canvas,
  },
  content: {
    paddingHorizontal: spacing.screenGutter,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: color.hairline18,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 11,
  },
  headerTint: {
    backgroundColor: color.canvasTranslucent82,
  },
  headerTitleWrap: {
    height: 22,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: color.ink,
  },
});
