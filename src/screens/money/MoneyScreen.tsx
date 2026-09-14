import { AccessibilityRole, Pressable, StyleSheet, Text, View } from 'react-native';

import { MoneyRing } from '../../components/primitives/MoneyRing';
import { SegmentedControl } from '../../components/primitives/SegmentedControl';
import { TabScreen } from '../../components/primitives/TabScreen';
import { PlusIcon } from '../../components/icons/icons';
import { color, radius } from '../../theme/tokens';
import { textStyle, tabularNums } from '../../theme/typography';
import { useAppStore } from '../../state/store';
import { useTourTarget } from '../../hooks/useTourTarget';
import { CITY_PACKS } from '../../data/cityPacks';
import { deriveMoney, formatMoney } from '../../domain/money';

type MoneyScreenProps = {
  onLogSpend: () => void;
};

export function MoneyScreen({ onLogSpend }: MoneyScreenProps) {
  const trip = useAppStore((s) => s.trip);
  const logged = useAppStore((s) => s.logged);
  const cityPackKey = useAppStore((s) => s.cityPackKey);
  const setDraftMessage = useAppStore((s) => s.setDraftMessage);
  const segment = useAppStore((s) => s.moneySegment);
  const setSegment = useAppStore((s) => s.setMoneySegment);
  const segmentTargetRef = useTourTarget('money-segment');
  const pack = CITY_PACKS[cityPackKey];

  const money = deriveMoney(trip, logged);
  const isTodaySegment = segment === 'today';

  const amount = isTodaySegment ? money.todayRemaining : money.wholeTripRemaining;
  const fraction = isTodaySegment
    ? money.dailyBudget > 0
      ? money.todayRemaining / money.dailyBudget
      : 0
    : trip.budget > 0
      ? money.wholeTripRemaining / trip.budget
      : 0;
  const caption = isTodaySegment
    ? `of ${formatMoney(money.dailyBudget, pack.currencySymbol)} left today`
    : `of ${formatMoney(trip.budget, pack.currencySymbol)} left`;
  const statusLabel = isTodaySegment ? (money.isTight ? 'Tight today' : 'Fine today') : 'On track';
  const isWarning = isTodaySegment && money.isTight;
  const statusColor = isWarning ? color.warningInk : color.success;
  const statusBackground = isWarning ? color.warningWash14 : color.successWash14;

  const breakdownEntries = isTodaySegment ? money.loggedToday : logged;

  const handleLogSpend = () => {
    setDraftMessage(`I spent ${pack.currencySymbol}`);
    onLogSpend();
  };

  return (
    <TabScreen title="Money">
      <Text style={textStyle.largeTitle}>Money</Text>
      <Text style={[textStyle.bodySecondary, styles.subhead]}>
        {money.daysLeft} days left of {money.tripDays}
      </Text>

      <View style={styles.section} ref={segmentTargetRef}>
        <SegmentedControl
          segments={[
            { key: 'today', label: 'Today' },
            { key: 'trip', label: 'Whole trip' },
          ]}
          value={segment}
          onChange={setSegment}
        />
      </View>

      <View style={styles.ringWrap}>
        <MoneyRing
          fraction={Math.max(0, Math.min(1, fraction))}
          amountLabel={formatMoney(amount, pack.currencySymbol)}
          caption={caption}
          statusLabel={statusLabel}
          statusColor={statusColor}
          statusBackground={statusBackground}
        />
      </View>

      <View style={styles.section}>
        <Pressable
          onPress={handleLogSpend}
          accessibilityRole={'button' as AccessibilityRole}
          style={({ pressed }) => [styles.logButton, pressed && styles.logButtonPressed]}
        >
          <PlusIcon color={color.surface} size={18} />
          <Text style={styles.logButtonLabel}>Log a spend</Text>
        </Pressable>
        <Text style={styles.caption}>
          Tell me in your own words — "I spent €18 on dinner" — and I'll put it here.
        </Text>
      </View>

      <View style={styles.section}>
        {breakdownEntries.length > 0 ? (
          <View style={styles.breakdownCard}>
            {breakdownEntries.map((entry, index) => (
              <View key={entry.id}>
                {index > 0 ? <View style={styles.separator} /> : null}
                <View style={styles.breakdownRow}>
                  <View style={styles.dot} />
                  <View style={styles.breakdownTextColumn}>
                    <Text style={styles.breakdownLabel}>{entry.label}</Text>
                    <Text style={styles.breakdownNote}>You told me</Text>
                  </View>
                  <Text style={[styles.breakdownAmount, tabularNums]}>
                    {formatMoney(entry.amount, pack.currencySymbol)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyState}>
            Nothing logged {isTodaySegment ? 'today' : 'this trip'} yet — tell me what you spend and it'll show up
            here.
          </Text>
        )}
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  subhead: {
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  ringWrap: {
    marginTop: 24,
    alignItems: 'center',
  },
  logButton: {
    minHeight: 50,
    borderRadius: radius.card,
    backgroundColor: color.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logButtonPressed: {
    backgroundColor: color.accentPressed,
  },
  logButtonLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: color.surface,
  },
  caption: {
    marginTop: 8,
    marginHorizontal: 4,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
  breakdownCard: {
    backgroundColor: color.surface,
    borderRadius: radius.row,
    overflow: 'hidden',
  },
  separator: {
    height: 0.5,
    backgroundColor: color.hairline18,
    marginLeft: 16,
  },
  breakdownRow: {
    minHeight: 44,
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color.accent,
  },
  breakdownTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  breakdownLabel: {
    fontSize: 17,
    lineHeight: 22,
    color: color.ink,
  },
  breakdownNote: {
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
  breakdownAmount: {
    fontSize: 17,
    fontWeight: '600',
    color: color.ink,
  },
  emptyState: {
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
    marginHorizontal: 4,
  },
});
