import { useState } from 'react';
import { AccessibilityRole, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CalendarSheet } from '../../../components/primitives/CalendarSheet';
import { DisclosureIcon } from '../../../components/icons/icons';
import { color, radius, touchTarget } from '../../../theme/tokens';
import { useOnboardingStore } from '../../../state/onboardingStore';
import { CITY_OPTIONS } from '../../../data/cityPacks';
import { formatTripDateRange } from '../../../domain/dates';

export function TripStep() {
  const destinationText = useOnboardingStore((s) => s.destinationText);
  const setDestinationText = useOnboardingStore((s) => s.setDestinationText);
  const solo = useOnboardingStore((s) => s.solo);
  const toggleSolo = useOnboardingStore((s) => s.toggleSolo);
  const dateStart = useOnboardingStore((s) => s.dateStart);
  const dateEnd = useOnboardingStore((s) => s.dateEnd);
  const setDates = useOnboardingStore((s) => s.setDates);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const datesLabel = dateStart && dateEnd ? formatTripDateRange(dateStart, dateEnd) : 'Choose';

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Where are you going?</Text>
      <Text style={styles.subtitle}>So I know the trains, the money and the time zone.</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Destination</Text>
          <TextInput
            style={styles.destinationInput}
            value={destinationText}
            onChangeText={setDestinationText}
            placeholder="Where to?"
            placeholderTextColor={color.inkTertiary}
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
            <Text style={[styles.rowValue, { color: dateStart ? color.inkSecondary : color.accent }]}>{datesLabel}</Text>
            <DisclosureIcon />
          </View>
        </Pressable>
        <View style={styles.separator} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Travelling</Text>
          <View style={styles.soloTrack}>
            <Pressable onPress={toggleSolo} style={[styles.soloOption, solo && styles.soloOptionActive]}>
              <Text style={styles.soloLabel}>Solo</Text>
            </Pressable>
            <Pressable onPress={toggleSolo} style={[styles.soloOption, !solo && styles.soloOptionActive]}>
              <Text style={styles.soloLabel}>With others</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Text style={styles.groupHeader}>Popular with solo travellers</Text>
      <View style={styles.chipRow}>
        {CITY_OPTIONS.map((label) => (
          <Pressable
            key={label}
            onPress={() => setDestinationText(label)}
            accessibilityRole={'button' as AccessibilityRole}
            style={[styles.chip, { borderColor: destinationText === label ? color.tint : 'rgba(113,171,203,.5)' }]}
          >
            <Text style={styles.chipLabel}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <CalendarSheet
        visible={calendarOpen}
        initialStart={dateStart}
        initialEnd={dateEnd}
        onClose={() => setCalendarOpen(false)}
        onConfirm={(start, end) => {
          setDates(start, end);
          setCalendarOpen(false);
        }}
      />
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
    marginBottom: 20,
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
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
    minHeight: touchTarget.min,
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
  },
  soloTrack: {
    flex: 1,
    maxWidth: 180,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(22,50,63,.07)',
    padding: 2,
    flexDirection: 'row',
    gap: 2,
  },
  soloOption: {
    flex: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soloOptionActive: {
    backgroundColor: color.surface,
  },
  soloLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: color.ink,
  },
  groupHeader: {
    marginTop: 24,
    marginBottom: 8,
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
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 19,
    backgroundColor: color.surface,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: color.accent,
  },
});
