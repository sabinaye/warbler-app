import { useState } from 'react';
import { AccessibilityRole, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { PushedScreen } from '../../components/primitives/PushedScreen';
import { SegmentedControl } from '../../components/primitives/SegmentedControl';
import { WOBY } from '../../assets/woby';
import { color, radius } from '../../theme/tokens';
import { useAppStore } from '../../state/store';
import { CITY_PACKS } from '../../data/cityPacks';
import { DEFAULT_CONTACTS, NO_CONTACT, contactFirstName } from '../../data/contacts';
import { PACKING, BEFORE_YOU_GO, ALL_PREP_ITEMS } from '../../data/planPrep';
import { fillTemplate } from '../../domain/template';

type TripPrepScreenProps = {
  onBack: () => void;
};

type PrepSegment = 'packing' | 'before';

export function TripPrepScreen({ onBack }: TripPrepScreenProps) {
  const prepChecked = useAppStore((s) => s.prepChecked);
  const togglePrepItem = useAppStore((s) => s.togglePrepItem);
  const cityPackKey = useAppStore((s) => s.cityPackKey);
  const contactId = useAppStore((s) => s.contactId);
  const customContacts = useAppStore((s) => s.customContacts);
  const pack = CITY_PACKS[cityPackKey];
  const contact = [...DEFAULT_CONTACTS, ...customContacts, NO_CONTACT].find((c) => c.id === contactId) ?? NO_CONTACT;
  const contactFirst = contactFirstName(contact);

  const [segment, setSegment] = useState<PrepSegment>('packing');

  const doneCount = ALL_PREP_ITEMS.filter((item) => prepChecked[item.id]).length;
  const prepCount = `${doneCount} of ${ALL_PREP_ITEMS.length} done`;
  const encouragement =
    doneCount === ALL_PREP_ITEMS.length
      ? "That's everything. You can stop thinking about the list now."
      : 'No rush and no streak to break. Tick them off whenever it suits.';
  const prepPct = Math.round((doneCount / ALL_PREP_ITEMS.length) * 100);

  const items = segment === 'packing' ? PACKING : BEFORE_YOU_GO;

  return (
    <PushedScreen title="Trip prep" backLabel="Plan" onBack={onBack}>
      <View style={styles.progressPanel}>
        <Image source={WOBY.happy} style={styles.panelFace} />
        <View style={styles.panelTextColumn}>
          <Text style={styles.panelCount}>{prepCount}</Text>
          <Text style={styles.panelEncouragement}>{encouragement}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${prepPct}%` }]} />
          </View>
        </View>
      </View>

      <View style={styles.segmentWrap}>
        <SegmentedControl
          segments={[
            { key: 'packing', label: 'Packing' },
            { key: 'before', label: 'Before you go' },
          ]}
          value={segment}
          onChange={setSegment}
        />
      </View>

      <View style={styles.card}>
        {items.map((item, index) => {
          const on = !!prepChecked[item.id];
          const label = fillTemplate(item.label, { pack, contactFirst });
          const note = fillTemplate(item.note, { pack, contactFirst });
          return (
            <View key={item.id}>
              {index > 0 ? <View style={styles.separator} /> : null}
              <Pressable
                onPress={() => togglePrepItem(item.id)}
                accessibilityRole={'checkbox' as AccessibilityRole}
                accessibilityState={{ checked: on }}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              >
                <View style={[styles.checkbox, { borderColor: on ? color.tint : 'rgba(22,50,63,.28)', backgroundColor: on ? color.tint : 'transparent' }]}>
                  {on ? (
                    <Svg width={13} height={10} viewBox="0 0 17 13" fill="none">
                      <Path d="M1.5 6.6 6 11.4 15.5 1.5" stroke={color.surface} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  ) : null}
                </View>
                <View style={styles.textColumn}>
                  <Text style={[styles.label, on && styles.labelDone]}>{label}</Text>
                  <Text style={styles.note}>{note}</Text>
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
      <Text style={styles.caption}>No streaks, no nagging. This is just a list you can put down.</Text>
    </PushedScreen>
  );
}

const styles = StyleSheet.create({
  progressPanel: {
    backgroundColor: color.tintWash35,
    borderRadius: radius.card,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  panelFace: {
    width: 44,
    height: 44,
    alignSelf: 'flex-start',
    resizeMode: 'contain',
  },
  panelTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  panelCount: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: color.ink,
  },
  panelEncouragement: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    color: color.ink,
  },
  progressTrack: {
    marginTop: 12,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,.7)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: color.accent,
  },
  segmentWrap: {
    marginTop: 20,
  },
  card: {
    marginTop: 16,
    backgroundColor: color.surface,
    borderRadius: radius.row,
    overflow: 'hidden',
  },
  separator: {
    height: 0.5,
    backgroundColor: color.hairline18,
    marginLeft: 52,
  },
  row: {
    minHeight: 44,
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  rowPressed: {
    backgroundColor: color.tintWash30,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  textColumn: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 17,
    lineHeight: 22,
    color: color.ink,
  },
  labelDone: {
    color: color.inkSecondary,
    textDecorationLine: 'line-through',
  },
  note: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkSecondary,
  },
  caption: {
    marginTop: 8,
    marginHorizontal: 4,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
});
