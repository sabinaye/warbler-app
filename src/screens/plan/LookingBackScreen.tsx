import { AccessibilityRole, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { PushedScreen } from '../../components/primitives/PushedScreen';
import { WOBY } from '../../assets/woby';
import { color, radius } from '../../theme/tokens';
import { useAppStore } from '../../state/store';
import { CITY_PACKS } from '../../data/cityPacks';
import { REFLECTION_QUESTIONS } from '../../data/reflection';
import { deriveMoney, formatMoney } from '../../domain/money';

type LookingBackScreenProps = {
  onBack: () => void;
};

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export function LookingBackScreen({ onBack }: LookingBackScreenProps) {
  const reflectStep = useAppStore((s) => s.reflectStep);
  const answerReflection = useAppStore((s) => s.answerReflection);
  const skipReflection = useAppStore((s) => s.skipReflection);
  const restartReflection = useAppStore((s) => s.restartReflection);
  const trip = useAppStore((s) => s.trip);
  const logged = useAppStore((s) => s.logged);
  const cityPackKey = useAppStore((s) => s.cityPackKey);
  const reflectPicks = useAppStore((s) => s.reflectPicks);
  const pack = CITY_PACKS[cityPackKey];

  const done = reflectStep >= REFLECTION_QUESTIONS.length;

  if (done) {
    const money = deriveMoney(trip, logged);
    const underBudget = money.wholeTripRemaining;
    const moneyLine =
      underBudget > 0
        ? `You came in ${formatMoney(underBudget, pack.currencySymbol)} under budget for the trip.`
        : "You spent right up to the edge of your budget — that's a plan well used.";

    return (
      <PushedScreen title="Looking back" backLabel="Plan" onBack={onBack}>
        <View style={styles.doneWrap}>
          <Image source={WOBY.love} style={styles.doneFace} />
          <Text style={styles.doneTitle}>You did it.</Text>
          <Text style={styles.doneSubtitle}>{money.tripDays} days, and you made it through on your own.</Text>

          <View style={styles.takeawaysCard}>
            <View style={styles.takeawayRow}>
              <Text style={styles.takeawayText}>{moneyLine}</Text>
            </View>
          </View>

          <Text style={styles.privacyNote}>Your answers stay on this phone. Nothing is published anywhere.</Text>

          <Pressable
            onPress={restartReflection}
            accessibilityRole={'button' as AccessibilityRole}
            style={({ pressed }) => [styles.restartButton, pressed && styles.restartButtonPressed]}
          >
            <Text style={styles.restartLabel}>Start again</Text>
          </Pressable>
        </View>
      </PushedScreen>
    );
  }

  const question = REFLECTION_QUESTIONS[reflectStep];

  return (
    <PushedScreen title="Looking back" backLabel="Plan" onBack={onBack}>
      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>
          Question {reflectStep + 1} of {REFLECTION_QUESTIONS.length}
        </Text>
        <Pressable onPress={skipReflection} accessibilityRole={'button' as AccessibilityRole} hitSlop={8}>
          <Text style={styles.skipLabel}>Skip</Text>
        </Pressable>
      </View>
      <Text style={styles.question}>{question.question}</Text>
      <View style={styles.optionList}>
        {question.answers.map((answer, index) => {
          const selected = reflectPicks[reflectStep] === index;
          return (
            <Pressable
              key={answer}
              onPress={() => answerReflection(reflectStep, index)}
              accessibilityRole={'radio' as AccessibilityRole}
              accessibilityState={{ selected }}
              style={({ pressed }) => [
                styles.optionRow,
                { borderColor: selected ? color.tint : 'transparent' },
                pressed && styles.optionRowPressed,
              ]}
            >
              <View style={styles.optionLetter}>
                <Text style={styles.optionLetterLabel}>{LETTERS[index]}</Text>
              </View>
              <Text style={styles.optionLabel}>{answer}</Text>
            </Pressable>
          );
        })}
      </View>
    </PushedScreen>
  );
}

const styles = StyleSheet.create({
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: color.inkSecondary,
  },
  skipLabel: {
    fontSize: 15,
    color: color.accent,
  },
  question: {
    marginTop: 0,
    marginBottom: 20,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.4,
    color: color.ink,
  },
  optionList: {
    gap: 8,
  },
  optionRow: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
  },
  optionRowPressed: {
    backgroundColor: color.tintWash30,
  },
  optionLetter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: color.tintWash45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: color.ink,
  },
  optionLabel: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    color: color.ink,
  },
  doneWrap: {
    alignItems: 'center',
  },
  doneFace: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  doneTitle: {
    marginTop: 16,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.4,
    color: color.ink,
  },
  doneSubtitle: {
    marginTop: 8,
    maxWidth: 280,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  takeawaysCard: {
    width: '100%',
    marginTop: 24,
    backgroundColor: color.surface,
    borderRadius: radius.row,
    overflow: 'hidden',
  },
  takeawayRow: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  takeawayText: {
    fontSize: 15,
    lineHeight: 20,
    color: color.ink,
  },
  privacyNote: {
    marginTop: 8,
    marginHorizontal: 4,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
  restartButton: {
    width: '100%',
    marginTop: 24,
    height: 50,
    borderRadius: radius.card,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restartButtonPressed: {
    opacity: 0.6,
  },
  restartLabel: {
    fontSize: 17,
    color: color.accent,
  },
});
