import { useState } from 'react';
import { AccessibilityRole, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { color, radius } from '../../theme/tokens';
import { ChevronBackIcon } from '../icons/icons';

// A real month calendar (correct weekday alignment, month navigation) replacing the prototype's
// fixed "March 2027, 31 bare cells" toy grid — the interaction pattern (tap start, then end;
// range band; confirm copy) is transcribed as-is, just generalized off real Date math instead of
// bare day-of-month integers.
const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

// Monday-first weekday index (0=Mon .. 6=Sun), matching the design's "M T W T F S S" header.
function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type CalendarSheetProps = {
  visible: boolean;
  initialStart?: string | null;
  initialEnd?: string | null;
  onClose: () => void;
  onConfirm: (startISO: string, endISO: string) => void;
};

export function CalendarSheet({ visible, initialStart, initialEnd, onClose, onConfirm }: CalendarSheetProps) {
  const seedMonth = initialStart ? fromISODate(initialStart) : new Date();
  const [monthCursor, setMonthCursor] = useState(new Date(seedMonth.getFullYear(), seedMonth.getMonth(), 1));
  const [draftStart, setDraftStart] = useState<Date | null>(initialStart ? fromISODate(initialStart) : null);
  const [draftEnd, setDraftEnd] = useState<Date | null>(initialEnd ? fromISODate(initialEnd) : null);

  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const leadingBlanks = mondayIndex(firstOfMonth);
  const totalDays = daysInMonth(year, month);

  const nights = draftStart && draftEnd ? Math.round((draftEnd.getTime() - draftStart.getTime()) / 86400000) : 0;

  const heading = draftStart
    ? draftEnd
      ? sameMonth(draftStart, draftEnd)
        ? `${draftStart.getDate()}–${draftEnd.getDate()} ${MONTH_NAMES[draftStart.getMonth()]}`
        : `${draftStart.getDate()} ${MONTH_NAMES[draftStart.getMonth()]} – ${draftEnd.getDate()} ${MONTH_NAMES[draftEnd.getMonth()]}`
      : `${draftStart.getDate()} ${MONTH_NAMES[draftStart.getMonth()]}`
    : 'Pick your dates';

  const hint = draftStart && !draftEnd ? 'Now pick the day you come home.' : 'Tap a start day, then the day you come home.';
  const cta = draftStart && draftEnd ? 'Use these dates' : 'Pick a return day';
  const canConfirm = !!(draftStart && draftEnd);

  const handleTapDay = (day: number) => {
    const tapped = new Date(year, month, day);
    if (!draftStart || draftEnd) {
      setDraftStart(tapped);
      setDraftEnd(null);
      return;
    }
    if (tapped.getTime() <= draftStart.getTime()) {
      setDraftStart(tapped);
      setDraftEnd(null);
      return;
    }
    setDraftEnd(tapped);
  };

  const handleConfirm = () => {
    if (!draftStart || !draftEnd) return;
    onConfirm(toISODate(draftStart), toISODate(draftEnd));
  };

  const cells: { day: number; isStart: boolean; isEnd: boolean; inRange: boolean; inBand: boolean }[] = [];
  for (let day = 1; day <= totalDays; day++) {
    const cellDate = startOfDay(new Date(year, month, day));
    const isStart = !!draftStart && cellDate.getTime() === startOfDay(draftStart).getTime();
    const isEnd = !!draftEnd && cellDate.getTime() === startOfDay(draftEnd).getTime();
    const inRange = !!(draftStart && draftEnd && cellDate.getTime() > startOfDay(draftStart).getTime() && cellDate.getTime() < startOfDay(draftEnd).getTime());
    const inBand = !!(draftStart && draftEnd && cellDate.getTime() >= startOfDay(draftStart).getTime() && cellDate.getTime() <= startOfDay(draftEnd).getTime() && !isStart && !isEnd);
    cells.push({ day, isStart, isEnd, inRange, inBand });
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityElementsHidden />
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <View style={styles.headerRow}>
            <Text style={styles.heading}>{heading}</Text>
            {nights > 0 ? <Text style={styles.nights}>{nights} nights</Text> : null}
          </View>

          <View style={styles.monthNavRow}>
            <Pressable
              onPress={() => setMonthCursor(new Date(year, month - 1, 1))}
              accessibilityRole={'button' as AccessibilityRole}
              accessibilityLabel="Previous month"
              hitSlop={8}
              style={styles.monthNavButton}
            >
              <ChevronBackIcon color={color.ink} />
            </Pressable>
            <Text style={styles.monthLabel}>
              {MONTH_NAMES[month]} {year}
            </Text>
            <Pressable
              onPress={() => setMonthCursor(new Date(year, month + 1, 1))}
              accessibilityRole={'button' as AccessibilityRole}
              accessibilityLabel="Next month"
              hitSlop={8}
              style={[styles.monthNavButton, styles.monthNavButtonNext]}
            >
              <ChevronBackIcon color={color.ink} />
            </Pressable>
          </View>

          <View style={styles.weekdayRow}>
            {WEEKDAY_LABELS.map((label, i) => (
              <View key={i} style={styles.weekdayCell}>
                <Text style={styles.weekdayLabel}>{label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.grid}>
            {Array.from({ length: leadingBlanks }).map((_, i) => (
              <View key={`blank-${i}`} style={styles.dayCellWrap} />
            ))}
            {cells.map((cell) => {
              const edge = cell.isStart || cell.isEnd;
              return (
                <Pressable
                  key={cell.day}
                  onPress={() => handleTapDay(cell.day)}
                  accessibilityRole={'button' as AccessibilityRole}
                  style={[styles.dayCellWrap, cell.inBand && styles.dayCellBand]}
                >
                  <View style={[styles.dayCircle, edge && styles.dayCircleEdge, cell.inRange && styles.dayCircleRange]}>
                    <Text style={[styles.dayLabel, edge && styles.dayLabelEdge, (edge || cell.inRange) && styles.dayLabelBold]}>
                      {cell.day}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.hint}>{hint}</Text>

          <Pressable
            onPress={handleConfirm}
            disabled={!canConfirm}
            accessibilityRole={'button' as AccessibilityRole}
            style={[styles.confirmButton, { backgroundColor: canConfirm ? color.accent : 'rgba(22,50,63,.22)' }]}
          >
            <Text style={styles.confirmLabel}>{cta}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function sameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(14,28,36,.4)',
  },
  sheet: {
    backgroundColor: color.canvas,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 34,
  },
  grabber: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(22,50,63,.22)',
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  heading: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -0.3,
    color: color.ink,
  },
  nights: {
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  monthNavRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthNavButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavButtonNext: {
    transform: [{ rotate: '180deg' }],
  },
  monthLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: color.inkSecondary,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  weekdayCell: {
    flex: 1,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: color.inkTertiary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  dayCellWrap: {
    width: '14.2857%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellBand: {
    backgroundColor: 'rgba(167,202,221,.25)',
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  dayCircleEdge: {
    backgroundColor: color.accent,
  },
  dayCircleRange: {
    backgroundColor: color.tintWash45,
  },
  dayLabel: {
    fontSize: 17,
    color: color.ink,
    fontVariant: ['tabular-nums'],
  },
  dayLabelEdge: {
    color: color.surface,
  },
  dayLabelBold: {
    fontWeight: '600',
  },
  hint: {
    marginTop: 12,
    marginHorizontal: 4,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
  confirmButton: {
    marginTop: 16,
    height: 50,
    borderRadius: radius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: color.surface,
  },
});
