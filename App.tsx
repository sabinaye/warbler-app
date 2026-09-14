import { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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

SplashScreen.preventAutoHideAsync();

const TOUR_START_DELAY_MS = 700;

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

  useEffect(() => {
    hydrate();
  }, [hydrate]);

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

  if (!fontsLoaded || setupComplete === null) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        {setupComplete ? <RootTabs /> : <OnboardingFlow onComplete={handleOnboardingComplete} />}
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
