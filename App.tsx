import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { RootTabs } from './src/navigation/RootTabs';
import { OnboardingFlow } from './src/screens/onboarding/OnboardingFlow';
import { useAppStore } from './src/state/store';
import { useTourStore } from './src/state/tourStore';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { WebPhoneFrame } from './src/components/WebPhoneFrame';
import { SplashView } from './src/components/SplashView';

SplashScreen.preventAutoHideAsync();

const TOUR_START_DELAY_MS = 700;

// expo-splash-screen's native launch splash has no web equivalent (see SplashView.tsx) — on web,
// fonts + hydration usually resolve fast enough that the JS-rendered splash below would otherwise
// flash for a frame or two, easy to miss entirely. Holding it for a minimum stretch makes it an
// actual, perceptible screen there, matching what a native launch splash looks like.
const WEB_SPLASH_MIN_MS = 4000;

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const setupComplete = useAppStore((s) => s.setupComplete);
  const hydrate = useAppStore((s) => s.hydrate);
  const seedAmbientNudge = useAppStore((s) => s.seedAmbientNudge);
  const tourSeen = useAppStore((s) => s.tourSeen);
  const startTour = useTourStore((s) => s.start);
  const [webSplashElapsed, setWebSplashElapsed] = useState(Platform.OS !== 'web');

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const timer = setTimeout(() => setWebSplashElapsed(true), WEB_SPLASH_MIN_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    seedAmbientNudge();
    if (!tourSeen) {
      setTimeout(startTour, TOUR_START_DELAY_MS);
    }
  }, [seedAmbientNudge, tourSeen, startTour]);

  const onLayout = useCallback(async () => {
    if (fontsLoaded && setupComplete !== null) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, setupComplete]);

  useEffect(() => {
    onLayout();
  }, [onLayout]);

  const showSplash = !fontsLoaded || setupComplete === null || !webSplashElapsed;

  return (
    <GestureHandlerRootView style={styles.root}>
      <WebPhoneFrame>
        {showSplash ? (
          <SplashView />
        ) : (
          <ErrorBoundary>
            {setupComplete ? <RootTabs /> : <OnboardingFlow onComplete={handleOnboardingComplete} />}
          </ErrorBoundary>
        )}
        <StatusBar style="dark" />
      </WebPhoneFrame>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
