import { AccessibilityRole, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { SwipeToRemoveRow } from '../../components/primitives/SwipeToRemoveRow';
import { TabScreen } from '../../components/primitives/TabScreen';
import { DisclosureIcon } from '../../components/icons/icons';
import { WOBY } from '../../assets/woby';
import { color, radius } from '../../theme/tokens';
import { textStyle, tabularNums } from '../../theme/typography';
import { useAppStore } from '../../state/store';
import { CITY_PACKS } from '../../data/cityPacks';
import { formatMoney } from '../../domain/money';
import { formatTripDateRange, formatLongDate } from '../../domain/dates';
import { PLAN_STATUS, PlanItem } from '../../domain/plan';
import { ALL_PREP_ITEMS } from '../../data/planPrep';
import { useTourTarget } from '../../hooks/useTourTarget';

type PlanScreenProps = {
  onOpenTripDetails: () => void;
  onOpenPrep: () => void;
  onOpenReflection: () => void;
};

export function PlanScreen({ onOpenTripDetails, onOpenPrep, onOpenReflection }: PlanScreenProps) {
  const trip = useAppStore((s) => s.trip);
  const cityPackKey = useAppStore((s) => s.cityPackKey);
  const extraPlanItems = useAppStore((s) => s.extraPlanItems);
  const removedPlanItemIds = useAppStore((s) => s.removedPlanItemIds);
  const removePlanItem = useAppStore((s) => s.removePlanItem);
  const firstItemTargetRef = useTourTarget('plan-first-item');
  const prepChecked = useAppStore((s) => s.prepChecked);
  const pack = CITY_PACKS[cityPackKey];

  const baselineItem: PlanItem = {
    id: 'hostel',
    time: pack.backTime,
    duration: '—',
    title: `Back at ${pack.stay}`,
    subtitle: 'Front desk is open all night, charger behind the counter.',
    byWoby: false,
    status: 'open',
  };

  const items = [baselineItem, ...extraPlanItems].filter((item) => !removedPlanItemIds.includes(item.id));

  const doneCount = ALL_PREP_ITEMS.filter((item) => prepChecked[item.id]).length;
  const prepSummary =
    doneCount === ALL_PREP_ITEMS.length
      ? 'All done. Nothing left to think about.'
      : `${ALL_PREP_ITEMS.length - doneCount} left, and none of them are urgent`;
  const prepPct = Math.round((doneCount / ALL_PREP_ITEMS.length) * 100);

  const tripSummary = `${pack.city}, ${pack.country} · ${formatTripDateRange(trip.startDate, trip.endDate)} · ${formatMoney(trip.budget, pack.currencySymbol)}`;

  return (
    <TabScreen title="Plan">
      <Text style={textStyle.largeTitle}>Plan</Text>
      <Pressable onPress={onOpenTripDetails} accessibilityRole={'button' as AccessibilityRole} style={styles.tripSummaryRow}>
        <Text style={styles.tripSummary}>{tripSummary}</Text>
        <DisclosureIcon color={color.accent} />
      </Pressable>

      <Pressable
        onPress={onOpenPrep}
        accessibilityRole={'button' as AccessibilityRole}
        style={({ pressed }) => [styles.prepCard, pressed && styles.prepCardPressed]}
      >
        <View style={styles.prepHeaderRow}>
          <View style={styles.prepTextColumn}>
            <Text style={styles.prepTitle}>Trip prep</Text>
            <Text style={styles.prepSubtitle}>{prepSummary}</Text>
          </View>
          <DisclosureIcon />
        </View>
        <View style={styles.prepTrack}>
          <View style={[styles.prepFill, { width: `${prepPct}%` }]} />
        </View>
      </Pressable>

      <View style={styles.section}>
        <Text style={styles.groupHeader}>Tonight</Text>
        <View style={styles.itemList}>
          {items.map((item, index) => {
            const status = PLAN_STATUS[item.status];
            return (
              <View key={item.id} ref={index === 0 ? firstItemTargetRef : undefined}>
              <SwipeToRemoveRow onRemove={() => removePlanItem(item.id)}>
                <View style={styles.itemRow}>
                  <View style={styles.itemTimeColumn}>
                    <Text style={[styles.itemTime, { color: status.ink }, tabularNums]}>{item.time}</Text>
                    <Text style={styles.itemDuration}>{item.duration}</Text>
                  </View>
                  <View style={styles.itemTextColumn}>
                    <View style={styles.itemTitleRow}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <View style={[styles.statusPill, { backgroundColor: status.background }]}>
                        <View style={[styles.statusDot, { backgroundColor: status.ink }]} />
                        <Text style={[styles.statusLabel, { color: status.ink }]}>{status.label}</Text>
                      </View>
                    </View>
                    <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                    {item.byWoby ? (
                      <View style={styles.byWobyBadge}>
                        <Image source={WOBY.happy} style={styles.byWobyFace} />
                        <Text style={styles.byWobyLabel}>Woby added this</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </SwipeToRemoveRow>
              </View>
            );
          })}
        </View>
        <Text style={styles.caption}>Swipe a row to remove it.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.groupHeader}>When you're home</Text>
        <Pressable
          onPress={onOpenReflection}
          accessibilityRole={'button' as AccessibilityRole}
          style={({ pressed }) => [styles.reflectRow, pressed && styles.reflectRowPressed]}
        >
          <Image source={WOBY.love} style={styles.reflectFace} />
          <View style={styles.reflectTextColumn}>
            <Text style={styles.reflectTitle}>Look back on the trip</Text>
            <Text style={styles.reflectSubtitle}>
              Five questions, about a minute. Opens on the {formatLongDate(trip.endDate)} — have a look now if you
              like.
            </Text>
          </View>
          <DisclosureIcon />
        </Pressable>
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  tripSummaryRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tripSummary: {
    fontSize: 15,
    lineHeight: 20,
    color: color.accent,
    flexShrink: 1,
  },
  prepCard: {
    marginTop: 24,
    backgroundColor: color.surface,
    borderRadius: radius.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  prepCardPressed: {
    backgroundColor: color.tintWash30,
  },
  prepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prepTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  prepTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: color.ink,
  },
  prepSubtitle: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  prepTrack: {
    marginTop: 12,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(22,50,63,.08)',
    overflow: 'hidden',
  },
  prepFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: color.accent,
  },
  section: {
    marginTop: 24,
  },
  groupHeader: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: color.inkSecondary,
    marginBottom: 8,
  },
  itemList: {
    gap: 8,
  },
  itemRow: {
    padding: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 12,
  },
  itemTimeColumn: {
    width: 52,
  },
  itemTime: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
  itemDuration: {
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
  itemTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  itemTitle: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: color.ink,
    letterSpacing: -0.2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 22,
    paddingLeft: 7,
    paddingRight: 9,
    borderRadius: 11,
    marginTop: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  itemSubtitle: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  byWobyBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 26,
    paddingLeft: 4,
    paddingRight: 10,
    borderRadius: 13,
    backgroundColor: color.tintWash45,
  },
  byWobyFace: {
    width: 20,
    height: 20,
  },
  byWobyLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: color.ink,
  },
  caption: {
    marginTop: 8,
    marginHorizontal: 4,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
  reflectRow: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reflectRowPressed: {
    backgroundColor: color.tintWash30,
  },
  reflectFace: {
    width: 36,
    height: 36,
  },
  reflectTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  reflectTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: color.ink,
  },
  reflectSubtitle: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
});
