import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { TabBar, TabKey } from '../components/primitives/TabBar';
import { TourOverlay } from '../components/primitives/TourOverlay';
import { Toast } from '../components/primitives/Toast';
import { NowScreen } from '../screens/now/NowScreen';
import { PlanNavigator } from '../screens/plan/PlanNavigator';
import { NearbyNavigator } from '../screens/nearby/NearbyNavigator';
import { MoneyScreen } from '../screens/money/MoneyScreen';
import { SupportNavigator } from '../screens/support/SupportNavigator';
import { color } from '../theme/tokens';
import { useAppStore } from '../state/store';
import { useTourStore } from '../state/tourStore';
import { useToast } from '../hooks/useToast';
import { TOUR_STEPS, TourAction } from '../data/tour';
import { CITY_PACKS } from '../data/cityPacks';

export function RootTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>('now');
  const tourStepIndex = useTourStore((s) => s.stepIndex);
  const tourSkip = useTourStore((s) => s.skip);
  const markTourSeen = useAppStore((s) => s.markTourSeen);
  const sendMessage = useAppStore((s) => s.sendMessage);
  const setMoneySegment = useAppStore((s) => s.setMoneySegment);
  const requestNearbyAnswer = useAppStore((s) => s.requestNearbyAnswer);
  const requestSupportTriage = useAppStore((s) => s.requestSupportTriage);
  const cityPackKey = useAppStore((s) => s.cityPackKey);
  const toast = useToast();
  const wasTourRunning = useRef(false);

  // Keep the active tab in sync with whichever tab the running tour step points at.
  useEffect(() => {
    if (tourStepIndex !== null) {
      setActiveTab(TOUR_STEPS[tourStepIndex].tab);
    }
    if (wasTourRunning.current && tourStepIndex === null) {
      markTourSeen();
    }
    wasTourRunning.current = tourStepIndex !== null;
  }, [tourStepIndex, markTourSeen]);

  const handleTourAct = (act: string) => {
    switch (act as TourAction) {
      case 'ask':
        tourSkip();
        markTourSeen();
        sendMessage('I missed the last train');
        break;
      case 'plan':
        toast.show('Swipe any item to the left to drop it from tonight.');
        break;
      case 'money':
        setMoneySegment('trip');
        break;
      case 'nearby': {
        const firstAnswer = CITY_PACKS[cityPackKey].answers[0];
        if (firstAnswer) requestNearbyAnswer(firstAnswer.id);
        break;
      }
      case 'triage':
        requestSupportTriage();
        break;
    }
  };

  return (
    <View style={styles.root}>
      {/*
        All five tabs stay mounted and just toggle visibility, matching the source prototype
        (one monolithic component that shows/hides sections) — switching tabs never resets a
        tab's own pushed-screen stack, scroll position, or in-progress form state.
      */}
      <View style={styles.content}>
        <View style={activeTab === 'now' ? styles.visible : styles.hidden}>
          <NowScreen onOpenSupport={() => setActiveTab('support')} />
        </View>
        <View style={activeTab === 'plan' ? styles.visible : styles.hidden}>
          <PlanNavigator />
        </View>
        <View style={activeTab === 'nearby' ? styles.visible : styles.hidden}>
          <NearbyNavigator />
        </View>
        <View style={activeTab === 'money' ? styles.visible : styles.hidden}>
          <MoneyScreen onLogSpend={() => setActiveTab('now')} />
        </View>
        <View style={activeTab === 'support' ? styles.visible : styles.hidden}>
          <SupportNavigator />
        </View>
      </View>
      <TabBar activeKey={activeTab} onSelect={setActiveTab} />
      <TourOverlay onAct={handleTourAct} />
      <Toast message={toast.message} onDismiss={toast.hide} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.canvas,
  },
  content: {
    flex: 1,
  },
  visible: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
});
