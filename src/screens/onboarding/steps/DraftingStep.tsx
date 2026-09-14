import { useEffect } from 'react';
import { AccessibilityRole, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { WOBY } from '../../../assets/woby';
import { RefreshIcon } from '../../../components/icons/icons';
import { color } from '../../../theme/tokens';
import { useOnboardingStore } from '../../../state/onboardingStore';
import { REDRAW_NOTES } from '../../../data/fallbackDraft';

export function DraftingStep() {
  const draftLoading = useOnboardingStore((s) => s.draftLoading);
  const draftPlan = useOnboardingStore((s) => s.draftPlan);
  const draftDegraded = useOnboardingStore((s) => s.draftDegraded);
  const droppedDays = useOnboardingStore((s) => s.droppedDays);
  const redraws = useOnboardingStore((s) => s.redraws);
  const startDrafting = useOnboardingStore((s) => s.startDrafting);
  const redraw = useOnboardingStore((s) => s.redraw);
  const dropDay = useOnboardingStore((s) => s.dropDay);

  useEffect(() => {
    if (!draftLoading && !draftPlan) startDrafting();
    // Only ever auto-start once, when the step first mounts with nothing drafted yet.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (draftLoading || !draftPlan) {
    return (
      <View style={styles.loadingRoot}>
        <Image source={WOBY.fly} style={styles.loadingFace} />
        <Text style={styles.loadingTitle}>Putting something together</Text>
        <Text style={styles.loadingBody}>Reading what you told me, then sketching a shape for the days.</Text>
      </View>
    );
  }

  const redrawLabel = redraws === 0 ? 'Try a different shape' : 'Try another one';
  const redrawNote = REDRAW_NOTES[Math.min(redraws, REDRAW_NOTES.length - 1)];

  return (
    <View style={styles.root}>
      <View style={styles.introRow}>
        <Image source={WOBY.happy} style={styles.introFace} />
        <View style={styles.introBubble}>
          <Text style={styles.introText}>{draftPlan.intro}</Text>
        </View>
      </View>

      <View style={styles.dayList}>
        {draftPlan.days.map((day, index) =>
          droppedDays[index] ? null : (
            <View key={index} style={styles.dayCard}>
              <View style={styles.dayRangeColumn}>
                <Text style={styles.dayRangeLabel}>Day</Text>
                <Text style={styles.dayRangeValue}>{(day.day.match(/\d+/g) || ['1']).join('–')}</Text>
              </View>
              <View style={styles.dayTextColumn}>
                <Text style={styles.dayTitle}>{day.title}</Text>
                <Text style={styles.dayNote}>{day.note}</Text>
              </View>
              <Pressable
                onPress={() => dropDay(index)}
                accessibilityRole={'button' as AccessibilityRole}
                accessibilityLabel="Drop this day"
                style={styles.dropButton}
              >
                <Text style={styles.dropGlyph}>×</Text>
              </Pressable>
            </View>
          ),
        )}
      </View>

      {draftDegraded ? (
        <Text style={styles.degradedNotice}>Drafted from what I had saved — I'll refresh this properly when you're back online.</Text>
      ) : null}

      <Pressable onPress={redraw} accessibilityRole={'button' as AccessibilityRole} style={({ pressed }) => [styles.redrawButton, pressed && styles.redrawButtonPressed]}>
        <RefreshIcon color={color.accent} />
        <Text style={styles.redrawLabel}>{redrawLabel}</Text>
      </Pressable>
      <Text style={styles.footnote}>{redrawNote}</Text>
      <Text style={styles.footnote}>Nothing here is booked. It's a shape to start from, and you can change any of it later.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingRoot: {
    alignItems: 'center',
    paddingTop: 48,
  },
  loadingFace: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  loadingTitle: {
    marginTop: 20,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: color.ink,
  },
  loadingBody: {
    marginTop: 8,
    maxWidth: 260,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  root: {
    paddingTop: 12,
  },
  introRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  introFace: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  introBubble: {
    flex: 1,
    minWidth: 0,
    backgroundColor: color.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  introText: {
    fontSize: 17,
    lineHeight: 22,
    color: color.ink,
  },
  dayList: {
    marginTop: 16,
    gap: 8,
  },
  dayCard: {
    backgroundColor: color.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  dayRangeColumn: {
    width: 44,
  },
  dayRangeLabel: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
    color: color.accent,
  },
  dayRangeValue: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
    color: color.accent,
  },
  dayTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  dayTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: color.ink,
    letterSpacing: -0.2,
  },
  dayNote: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  dropButton: {
    width: 44,
    height: 44,
    marginTop: -6,
    marginRight: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropGlyph: {
    fontSize: 18,
    color: 'rgba(22,50,63,.35)',
  },
  degradedNotice: {
    marginTop: 12,
    backgroundColor: color.warningWash10,
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    lineHeight: 18,
    color: '#8A4C10',
  },
  redrawButton: {
    marginTop: 12,
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: color.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  redrawButtonPressed: {
    backgroundColor: color.tintWash30,
  },
  redrawLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: color.accent,
  },
  footnote: {
    marginTop: 8,
    marginHorizontal: 4,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
});
