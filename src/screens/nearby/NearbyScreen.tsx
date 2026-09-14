import { useState } from 'react';
import { AccessibilityRole, Pressable, StyleSheet, Text, View } from 'react-native';

import { SegmentedControl } from '../../components/primitives/SegmentedControl';
import { TabScreen } from '../../components/primitives/TabScreen';
import { CheckAgreeIcon, DisclosureIcon, ShieldOutlineIcon, SuitcaseHandleIcon, WalletIcon, WifiIcon, ShieldWarningIcon } from '../../components/icons/icons';
import { color, radius } from '../../theme/tokens';
import { textStyle } from '../../theme/typography';
import { useAppStore } from '../../state/store';
import { CITY_PACKS } from '../../data/cityPacks';
import { ANSWER_CATEGORIES } from '../../data/answerCategories';
import { AnswerCategory } from '../../data/cityPacks/types';
import { useTourTarget } from '../../hooks/useTourTarget';

type NearbySegment = 'answers' | 'guides';

const CATEGORY_ICON: Record<AnswerCategory, typeof ShieldOutlineIcon> = {
  safety: ShieldOutlineIcon,
  logistics: SuitcaseHandleIcon,
  payments: WalletIcon,
  practical: WifiIcon,
};

const GUIDE_STYLES = [
  { tile: 'rgba(42,123,164,.14)', ink: '#2A7BA4', Icon: SuitcaseHandleIcon },
  { tile: 'rgba(47,125,87,.14)', ink: '#2F7D57', Icon: WalletIcon },
  { tile: 'rgba(167,202,221,.5)', ink: '#16323F', Icon: WifiIcon },
  { tile: 'rgba(217,43,31,.12)', ink: '#D92B1F', Icon: ShieldWarningIcon },
];

type NearbyScreenProps = {
  onOpenAnswer: (id: string) => void;
  onOpenGuide: (id: string) => void;
  onOpenAsk: () => void;
};

export function NearbyScreen({ onOpenAnswer, onOpenGuide, onOpenAsk }: NearbyScreenProps) {
  const cityPackKey = useAppStore((s) => s.cityPackKey);
  const pack = CITY_PACKS[cityPackKey];
  const [segment, setSegment] = useState<NearbySegment>('answers');
  const firstAnswerTargetRef = useTourTarget('nearby-first-answer');

  return (
    <TabScreen title="Nearby">
      <Text style={textStyle.largeTitle}>Nearby</Text>
      <Text style={styles.subhead}>
        {pack.area}, {pack.city} · saved on your phone
      </Text>

      <View style={styles.segmentWrap}>
        <SegmentedControl
          segments={[
            { key: 'answers', label: 'Answers' },
            { key: 'guides', label: 'Guides' },
          ]}
          value={segment}
          onChange={setSegment}
        />
      </View>

      {segment === 'answers' ? (
        <>
          <View style={styles.answerList}>
            {pack.answers.map((answer, index) => {
              const cat = ANSWER_CATEGORIES[answer.cat];
              const Icon = CATEGORY_ICON[answer.cat];
              return (
                <Pressable
                  key={answer.id}
                  ref={index === 0 ? firstAnswerTargetRef : undefined}
                  onPress={() => onOpenAnswer(answer.id)}
                  accessibilityRole={'button' as AccessibilityRole}
                  style={({ pressed }) => [styles.answerCard, pressed && styles.answerCardPressed]}
                >
                  <View style={styles.answerHeaderRow}>
                    <View style={[styles.catTile, { backgroundColor: cat.tile }]}>
                      <Icon color={cat.ink} />
                    </View>
                    <View style={styles.answerTextColumn}>
                      <Text style={[styles.catLabel, { color: cat.ink }]}>{cat.label.toUpperCase()}</Text>
                      <Text style={styles.answerQuestion}>{answer.question}</Text>
                    </View>
                  </View>
                  <Text style={styles.answerShort}>{answer.shortAnswer}</Text>
                  <View style={styles.answerMetaRow}>
                    <View style={styles.agreePill}>
                      <CheckAgreeIcon />
                      <Text style={styles.agreeLabel}>{answer.agreeCount}</Text>
                    </View>
                    <Text style={styles.freshness}>{answer.freshness}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.section}>
            <Pressable
              onPress={onOpenAsk}
              accessibilityRole={'button' as AccessibilityRole}
              style={({ pressed }) => [styles.askButton, pressed && styles.askButtonPressed]}
            >
              <Text style={styles.askButtonLabel}>Nothing fits? Ask the travellers</Text>
            </Pressable>
            <Text style={styles.caption}>
              You're anonymous here by default. No name, no photo, no history — just the question and roughly where
              you are.
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.section}>
          <View style={styles.guideCard}>
            {pack.guides.map((guide, index) => {
              const style = GUIDE_STYLES[index] ?? GUIDE_STYLES[0];
              const Icon = style.Icon;
              return (
                <View key={guide.id}>
                  {index > 0 ? <View style={styles.separator} /> : null}
                  <Pressable
                    onPress={() => onOpenGuide(guide.id)}
                    accessibilityRole={'button' as AccessibilityRole}
                    style={({ pressed }) => [styles.guideRow, pressed && styles.guideRowPressed]}
                  >
                    <View style={[styles.catTile, { backgroundColor: style.tile }]}>
                      <Icon color={style.ink} />
                    </View>
                    <View style={styles.guideTextColumn}>
                      <Text style={styles.guideTitle}>{guide.title}</Text>
                      <Text style={styles.guideSubtitle}>{guide.subtitle}</Text>
                    </View>
                    <DisclosureIcon />
                  </Pressable>
                </View>
              );
            })}
          </View>
          <Text style={styles.caption}>All four are saved on your phone, so they still open with no signal.</Text>
        </View>
      )}
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  subhead: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkSecondary,
  },
  segmentWrap: {
    marginTop: 8,
  },
  answerList: {
    marginTop: 20,
    gap: 8,
  },
  answerCard: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    padding: 16,
  },
  answerCardPressed: {
    backgroundColor: color.tintWash30,
  },
  answerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  catTile: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  answerTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  catLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  answerQuestion: {
    marginTop: 2,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: color.ink,
    letterSpacing: -0.2,
  },
  answerShort: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  answerMetaRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  agreePill: {
    height: 24,
    paddingLeft: 7,
    paddingRight: 10,
    borderRadius: 12,
    backgroundColor: color.successWash14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  agreeLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: color.success,
  },
  freshness: {
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
  section: {
    marginTop: 20,
  },
  askButton: {
    height: 50,
    borderRadius: radius.card,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  askButtonPressed: {
    backgroundColor: color.accentPressed,
  },
  askButtonLabel: {
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
  guideCard: {
    backgroundColor: color.surface,
    borderRadius: radius.row,
    overflow: 'hidden',
  },
  separator: {
    height: 0.5,
    backgroundColor: color.hairline18,
    marginLeft: 16,
  },
  guideRow: {
    minHeight: 44,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  guideRowPressed: {
    backgroundColor: color.tintWash30,
  },
  guideTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  guideTitle: {
    fontSize: 17,
    lineHeight: 22,
    color: color.ink,
  },
  guideSubtitle: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkSecondary,
  },
});
