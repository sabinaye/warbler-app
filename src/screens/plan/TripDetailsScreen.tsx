import { useState } from 'react';
import { AccessibilityRole, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CalendarSheet } from '../../components/primitives/CalendarSheet';
import { PushedScreen } from '../../components/primitives/PushedScreen';
import { DisclosureIcon } from '../../components/icons/icons';
import { color, radius } from '../../theme/tokens';
import { useAppStore } from '../../state/store';
import { CITY_PACKS, CityPackKey } from '../../data/cityPacks';
import { BUDGET_TIERS } from '../../data/budgets';
import { formatMoney } from '../../domain/money';
import { formatTripDateRange } from '../../domain/dates';

type TripDetailsScreenProps = {
  onBack: () => void;
};

export function TripDetailsScreen({ onBack }: TripDetailsScreenProps) {
  const trip = useAppStore((s) => s.trip);
  const cityPackKey = useAppStore((s) => s.cityPackKey);
  const setDestinationFromText = useAppStore((s) => s.setDestinationFromText);
  const setTrip = useAppStore((s) => s.setTrip);
  const pack = CITY_PACKS[cityPackKey];

  const [destinationText, setDestinationText] = useState(`${pack.city}, ${pack.country}`);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const tripDays = Math.max(
    1,
    Math.round((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 86400000) + 1,
  );
  const budgetPerDay = `about ${formatMoney(Math.round(trip.budget / tripDays), pack.currencySymbol)} a day over ${tripDays} days`;

  return (
    <PushedScreen title="Trip details" backLabel="Plan" onBack={onBack}>
      <Text style={styles.intro}>Change any of this and I'll re-key the trains, the money and the local numbers to match.</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Destination</Text>
          <TextInput
            style={styles.destinationInput}
            value={destinationText}
            onChangeText={setDestinationText}
            onSubmitEditing={() => setDestinationFromText(destinationText)}
            onBlur={() => setDestinationFromText(destinationText)}
            returnKeyType="done"
            textAlign="right"
          />
        </View>
        <View style={styles.separator} />
        <Pressable
          onPress={() => setCalendarOpen(true)}
          accessibilityRole={'button' as AccessibilityRole}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        >
          <Text style={styles.rowLabel}>Dates</Text>
          <View style={styles.rowValueGroup}>
            <Text style={styles.rowValue}>{formatTripDateRange(trip.startDate, trip.endDate)}</Text>
            <DisclosureIcon />
          </View>
        </Pressable>
      </View>

      <Text style={styles.groupHeader}>Or switch to somewhere I know well</Text>
      <View style={styles.chipRow}>
        {(Object.keys(CITY_PACKS) as CityPackKey[]).map((key) => {
          const candidate = CITY_PACKS[key];
          const label = `${candidate.city}, ${candidate.country}`;
          const active = key === cityPackKey;
          return (
            <Pressable
              key={key}
              onPress={() => {
                setDestinationText(label);
                setDestinationFromText(label);
              }}
              accessibilityRole={'button' as AccessibilityRole}
              style={[styles.chip, { backgroundColor: active ? color.tintWash45 : color.surface, borderColor: active ? color.tint : 'rgba(22,50,63,.14)' }]}
            >
              <Text style={styles.chipLabel}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.groupHeader}>Budget</Text>
      <View style={styles.budgetRow}>
        {BUDGET_TIERS.map((tier) => {
          const active = tier.amount === trip.budget;
          return (
            <Pressable
              key={tier.label}
              onPress={() => setTrip({ budget: tier.amount })}
              accessibilityRole={'button' as AccessibilityRole}
              style={[styles.budgetTile, { backgroundColor: active ? color.tintWash45 : color.surface, borderColor: active ? color.tint : 'rgba(22,50,63,.14)' }]}
            >
              <Text style={styles.budgetAmount}>{formatMoney(tier.amount, pack.currencySymbol)}</Text>
              <Text style={styles.budgetLabel}>{tier.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.caption}>{budgetPerDay}.</Text>

      <CalendarSheet
        visible={calendarOpen}
        initialStart={trip.startDate}
        initialEnd={trip.endDate}
        onClose={() => setCalendarOpen(false)}
        onConfirm={(start, end) => {
          setTrip({ startDate: start, endDate: end });
          setCalendarOpen(false);
        }}
      />
    </PushedScreen>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
    marginHorizontal: 4,
    marginBottom: 16,
  },
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.row,
    overflow: 'hidden',
  },
  separator: {
    height: 0.5,
    backgroundColor: color.hairline18,
    marginLeft: 16,
  },
  row: {
    minHeight: 44,
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowPressed: {
    backgroundColor: color.tintWash30,
  },
  rowLabel: {
    fontSize: 17,
    lineHeight: 22,
    color: color.ink,
  },
  destinationInput: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    color: color.accent,
    padding: 0,
  },
  rowValueGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  rowValue: {
    fontSize: 17,
    color: color.inkSecondary,
  },
  groupHeader: {
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: color.inkSecondary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: color.ink,
  },
  budgetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  budgetTile: {
    flex: 1,
    minHeight: 50,
    borderRadius: radius.card,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: color.ink,
  },
  budgetLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: color.inkSecondary,
  },
  caption: {
    marginTop: 12,
    marginHorizontal: 4,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
});
