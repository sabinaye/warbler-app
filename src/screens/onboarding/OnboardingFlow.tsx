import { AccessibilityRole, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChevronBackIcon } from '../../components/icons/icons';
import { color, radius } from '../../theme/tokens';
import { useOnboardingStore, ONBOARDING_STEPS } from '../../state/onboardingStore';
import { useAppStore } from '../../state/store';
import { INTERVIEW_QUESTIONS } from '../../data/interview';
import { CityPackKey, matchCityPack } from '../../data/cityPacks';

import { HelloStep } from './steps/HelloStep';
import { TripStep } from './steps/TripStep';
import { InterviewStep } from './steps/InterviewStep';
import { BudgetStep } from './steps/BudgetStep';
import { DraftingStep } from './steps/DraftingStep';
import { ContactStep } from './steps/ContactStep';
import { ReadyStep } from './steps/ReadyStep';
import { DoneStep } from './steps/DoneStep';

const DEFAULT_TRIP_LENGTH_DAYS = 9;

type OnboardingFlowProps = {
  onComplete: () => void;
};

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const insets = useSafeAreaInsets();
  const step = useOnboardingStore((s) => s.step);
  const interviewIdx = useOnboardingStore((s) => s.interviewIdx);
  const interviewPicks = useOnboardingStore((s) => s.interviewPicks);
  const destinationText = useOnboardingStore((s) => s.destinationText);
  const dateStart = useOnboardingStore((s) => s.dateStart);
  const dateEnd = useOnboardingStore((s) => s.dateEnd);
  const budget = useOnboardingStore((s) => s.budget);
  const draftLoading = useOnboardingStore((s) => s.draftLoading);
  const goNext = useOnboardingStore((s) => s.goNext);
  const goBack = useOnboardingStore((s) => s.goBack);
  const skip = useOnboardingStore((s) => s.skip);
  const restartOfflineDownload = useAppStore((s) => s.restartOfflineDownload);
  const offlineEnabled = useAppStore((s) => s.offlineEnabled);
  const completeSetup = useAppStore((s) => s.completeSetup);
  const contactId = useAppStore((s) => s.contactId);

  const stepName = ONBOARDING_STEPS[step];
  const question = INTERVIEW_QUESTIONS[interviewIdx];
  const currentPick = question ? interviewPicks[question.id] : undefined;
  const answered = question ? (question.multi ? Array.isArray(currentPick) && currentPick.length > 0 : !!currentPick) : false;

  const canGoBack = step > 0;
  const canSkip = ['interview', 'budget', 'contact', 'ready'].includes(stepName);

  const blocked =
    (stepName === 'trip' && !destinationText.trim()) ||
    (stepName === 'interview' && !answered) ||
    (stepName === 'drafting' && draftLoading);

  const ctaLabel = (() => {
    switch (stepName) {
      case 'welcome':
        return 'Get started';
      case 'trip':
        return destinationText.trim() ? 'Next' : 'Pick a destination';
      case 'interview':
        return answered ? 'Next' : question.multi ? 'Choose any that apply' : 'Choose one';
      case 'budget':
        return 'Draft me a plan';
      case 'drafting':
        return draftLoading ? 'Drafting…' : 'Looks good';
      case 'contact':
        return 'Next';
      case 'ready':
        return 'Almost there';
      default:
        return 'Open Warbler';
    }
  })();

  const handleNext = () => {
    if (blocked) return;

    if (stepName === 'contact') {
      goNext();
      if (offlineEnabled) restartOfflineDownload();
      return;
    }

    if (stepName === 'done') {
      const pack = matchCityPack(destinationText);
      const today = new Date();
      const fallbackEnd = new Date(today.getTime() + DEFAULT_TRIP_LENGTH_DAYS * 86400000);
      const toISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      completeSetup({
        cityPackKey: pack.key as CityPackKey,
        trip: {
          startDate: dateStart ?? toISO(today),
          endDate: dateEnd ?? toISO(fallbackEnd),
          budget,
        },
        contactId,
      });
      onComplete();
      return;
    }

    goNext();
  };

  return (
    <View style={styles.root}>
      <View style={[styles.headerRow, { marginTop: insets.top }]}>
        <Pressable
          onPress={goBack}
          disabled={!canGoBack}
          accessibilityRole={'button' as AccessibilityRole}
          accessibilityLabel="Back"
          style={styles.iconButton}
        >
          {canGoBack ? <ChevronBackIcon /> : null}
        </Pressable>
        <View style={styles.dotsRow}>
          {ONBOARDING_STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { width: i === step ? 20 : 6, backgroundColor: i <= step ? color.accent : 'rgba(22,50,63,.16)' },
              ]}
            />
          ))}
        </View>
        <Pressable
          onPress={skip}
          disabled={!canSkip}
          accessibilityRole={'button' as AccessibilityRole}
          style={styles.skipButton}
        >
          {canSkip ? <Text style={styles.skipLabel}>Skip</Text> : null}
        </Pressable>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {stepName === 'welcome' ? <HelloStep /> : null}
        {stepName === 'trip' ? <TripStep /> : null}
        {stepName === 'interview' ? <InterviewStep /> : null}
        {stepName === 'budget' ? <BudgetStep /> : null}
        {stepName === 'drafting' ? <DraftingStep /> : null}
        {stepName === 'contact' ? <ContactStep /> : null}
        {stepName === 'ready' ? <ReadyStep /> : null}
        {stepName === 'done' ? <DoneStep /> : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(20, insets.bottom + 8) }]}>
        <Pressable
          onPress={handleNext}
          accessibilityRole={'button' as AccessibilityRole}
          style={[styles.cta, { backgroundColor: blocked ? 'rgba(22,50,63,.22)' : color.accent }]}
        >
          <Text style={styles.ctaLabel}>{ctaLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.canvas,
  },
  headerRow: {
    height: 44,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  skipButton: {
    minWidth: 44,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 8,
  },
  skipLabel: {
    fontSize: 15,
    color: color.accent,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  cta: {
    height: 50,
    borderRadius: radius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: color.surface,
  },
});
