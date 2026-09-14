import { AccessibilityRole, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { WOBY } from '../../../assets/woby';
import { color } from '../../../theme/tokens';
import { useOnboardingStore } from '../../../state/onboardingStore';
import { matchCityPack } from '../../../data/cityPacks';
import { BUDGET_TIERS } from '../../../data/budgets';
import { formatMoney } from '../../../domain/money';
import { fillTemplate } from '../../../domain/template';

const TRIP_DAYS_ASSUMED = 9;

export function BudgetStep() {
  const budget = useOnboardingStore((s) => s.budget);
  const setBudget = useOnboardingStore((s) => s.setBudget);
  const destinationText = useOnboardingStore((s) => s.destinationText);
  const pack = matchCityPack(destinationText);

  const perDay = Math.max(1, Math.round(budget / TRIP_DAYS_ASSUMED));
  const note =
    budget <= 380
      ? fillTemplate("Tight but very doable here. I'll lean towards %shop% nights and free things.", { pack })
      : budget >= 1400
        ? "Plenty of room. I'll stop mentioning money unless something looks off."
        : "Comfortable for this trip. I'll flag it early if you drift, not after.";

  return (
    <View style={styles.root}>
      <Text style={styles.title}>What's the budget?</Text>
      <Text style={styles.subtitle}>A rough number is fine. I'll track against it, not police it.</Text>

      <View style={styles.amountBlock}>
        <Text style={styles.amount}>{formatMoney(budget, pack.currencySymbol)}</Text>
        <Text style={styles.perDay}>about {formatMoney(perDay, pack.currencySymbol)} a day over {TRIP_DAYS_ASSUMED} days</Text>
      </View>

      <View style={styles.tierRow}>
        {BUDGET_TIERS.map((tier) => {
          const active = tier.amount === budget;
          return (
            <Pressable
              key={tier.label}
              onPress={() => setBudget(tier.amount)}
              accessibilityRole={'button' as AccessibilityRole}
              style={[styles.tile, { backgroundColor: active ? color.tintWash45 : color.surface, borderColor: active ? color.tint : 'transparent' }]}
            >
              <Text style={styles.tileAmount}>{formatMoney(tier.amount, pack.currencySymbol)}</Text>
              <Text style={styles.tileLabel}>{tier.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.notePanel}>
        <Image source={WOBY.happy} style={styles.noteFace} />
        <Text style={styles.noteText}>{note}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 12,
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.4,
    color: color.ink,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  amountBlock: {
    alignItems: 'center',
  },
  amount: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 56,
    lineHeight: 62,
    letterSpacing: -1.5,
    color: color.ink,
  },
  perDay: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  tierRow: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 8,
  },
  tile: {
    flex: 1,
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: color.ink,
  },
  tileLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: color.inkSecondary,
  },
  notePanel: {
    marginTop: 24,
    backgroundColor: color.tintWash35,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  noteFace: {
    width: 40,
    height: 40,
    alignSelf: 'flex-start',
    resizeMode: 'contain',
  },
  noteText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: color.ink,
  },
});
