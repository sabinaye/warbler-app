import { Image, StyleSheet, Text, View } from 'react-native';

import { PushedScreen } from '../../components/primitives/PushedScreen';
import { WOBY } from '../../assets/woby';
import { color, radius } from '../../theme/tokens';
import { useAppStore } from '../../state/store';
import { CITY_PACKS } from '../../data/cityPacks';

type GuideDetailScreenProps = {
  guideId: string;
  onBack: () => void;
};

export function GuideDetailScreen({ guideId, onBack }: GuideDetailScreenProps) {
  const cityPackKey = useAppStore((s) => s.cityPackKey);
  const pack = CITY_PACKS[cityPackKey];
  const guide = pack.guides.find((g) => g.id === guideId) ?? pack.guides[0];

  return (
    <PushedScreen title="Guide" backLabel="Nearby" onBack={onBack}>
      <Text style={styles.title}>{guide.title}</Text>
      <Text style={styles.intro}>{guide.intro}</Text>

      <View style={styles.pointsCard}>
        {guide.points.map((point, index) => (
          <View key={point.heading}>
            {index > 0 ? <View style={styles.separator} /> : null}
            <View style={styles.point}>
              <Text style={styles.pointHeading}>{point.heading}</Text>
              <Text style={styles.pointBody}>{point.body}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.infoPanel}>
        <Image source={WOBY.hero} style={styles.infoFace} />
        <Text style={styles.infoText}>Saved on your phone. If you'd rather just ask me, I'm one tab away.</Text>
      </View>
    </PushedScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: color.ink,
  },
  intro: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  pointsCard: {
    marginTop: 20,
    backgroundColor: color.surface,
    borderRadius: radius.row,
    overflow: 'hidden',
  },
  separator: {
    height: 0.5,
    backgroundColor: color.hairline18,
    marginLeft: 16,
  },
  point: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pointHeading: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: color.ink,
  },
  pointBody: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  infoPanel: {
    marginTop: 20,
    backgroundColor: color.tintWash35,
    borderRadius: radius.card,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  infoFace: {
    width: 44,
    height: 44,
    alignSelf: 'flex-start',
    resizeMode: 'contain',
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: color.ink,
  },
});
