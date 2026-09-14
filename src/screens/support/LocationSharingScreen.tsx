import { Image, StyleSheet, Text, View } from 'react-native';

import { GroupedList, GroupedRow } from '../../components/primitives/GroupedList';
import { PushedScreen } from '../../components/primitives/PushedScreen';
import { CheckmarkIcon } from '../../components/icons/icons';
import { WOBY } from '../../assets/woby';
import { color, radius } from '../../theme/tokens';
import { textStyle } from '../../theme/typography';
import { useAppStore } from '../../state/store';
import { LOCATION_SHARE_OPTIONS } from '../../data/locationSharingOptions';
import { CITY_PACKS } from '../../data/cityPacks';

type LocationSharingScreenProps = {
  onBack: () => void;
};

export function LocationSharingScreen({ onBack }: LocationSharingScreenProps) {
  const locationShare = useAppStore((s) => s.locationShare);
  const setLocationShare = useAppStore((s) => s.setLocationShare);
  const ACTIVE_PACK = useAppStore((s) => CITY_PACKS[s.cityPackKey]);

  const now = new Date();
  const selectedOption = LOCATION_SHARE_OPTIONS.find((o) => o.key === locationShare) ?? LOCATION_SHARE_OPTIONS[3];

  return (
    <PushedScreen title="Location sharing" backLabel="Support" onBack={onBack}>
      <Text style={[textStyle.groupHeader, styles.groupHeader]}>When should Warbler know where you are?</Text>
      <GroupedList>
        {LOCATION_SHARE_OPTIONS.map((option) => (
          <GroupedRow
            key={option.key}
            label={option.label}
            onPress={() => setLocationShare(option.key)}
            disclosure={false}
          >
            <View style={{ opacity: option.key === locationShare ? 1 : 0 }}>
              <CheckmarkIcon color={color.accent} />
            </View>
          </GroupedRow>
        ))}
      </GroupedList>
      <Text style={styles.caption}>{selectedOption.note({ pack: ACTIVE_PACK, now })}</Text>

      <View style={styles.infoPanel}>
        <Image source={WOBY.love} style={styles.infoFace} />
        <Text style={styles.infoText}>
          Whatever you pick, sharing ends on its own. I'll never start it for you, and you can stop it at any time.
        </Text>
      </View>
    </PushedScreen>
  );
}

const styles = StyleSheet.create({
  groupHeader: {
    marginBottom: 8,
  },
  caption: {
    marginTop: 8,
    marginHorizontal: 4,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
  infoPanel: {
    marginTop: 24,
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
