import { Image, StyleSheet, View } from 'react-native';

import { WOBY } from '../assets/woby';
import { color } from '../theme/tokens';

// Mirrors the native launch splash (see app.json's expo-splash-screen config): Woby on the
// app's canvas cream, nothing else. expo-splash-screen has no web implementation at all (its
// non-native module is a no-op), so on web this is the only place that branding ever renders —
// App.tsx renders it in place of the real screen for a moment on every load.
export function SplashView() {
  return (
    <View style={styles.root}>
      <Image source={WOBY.hero} style={styles.logo} accessibilityElementsHidden importantForAccessibility="no" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.canvas,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
});
