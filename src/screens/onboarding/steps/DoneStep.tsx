import { Image, StyleSheet, Text, View } from 'react-native';

import { WOBY } from '../../../assets/woby';
import { color, radius } from '../../../theme/tokens';
import { textStyle } from '../../../theme/typography';
import { useOnboardingStore } from '../../../state/onboardingStore';
import { useAppStore } from '../../../state/store';
import { DEFAULT_CONTACTS, NO_CONTACT, contactFirstName } from '../../../data/contacts';
import { matchCityPack } from '../../../data/cityPacks';
import { formatMoney } from '../../../domain/money';

export function DoneStep() {
  const destinationText = useOnboardingStore((s) => s.destinationText);
  const budget = useOnboardingStore((s) => s.budget);
  const locPerm = useOnboardingStore((s) => s.locPerm);
  const contactId = useAppStore((s) => s.contactId);
  const customContacts = useAppStore((s) => s.customContacts);

  const pack = matchCityPack(destinationText);
  const contact = [...DEFAULT_CONTACTS, ...customContacts, NO_CONTACT].find((c) => c.id === contactId) ?? NO_CONTACT;
  const who = contact.id === 'none' ? 'nobody in the loop for now' : `${contactFirstName(contact)} in the loop`;
  const summary = `${pack.city}, ${formatMoney(budget, pack.currencySymbol)}, and ${who}.`;

  const firstSuggestion =
    locPerm === 'granted'
      ? "Save your accommodation address before you fly. It's the one thing you'll need when you can't think straight."
      : "Save your accommodation address before you fly — and the local emergency number while you're at it.";

  return (
    <View style={styles.root}>
      <Image source={WOBY.sing} style={styles.hero} />
      <Text style={[textStyle.largeTitle, styles.title]}>You're set.</Text>
      <Text style={styles.summary}>{summary}</Text>

      <View style={styles.panel}>
        <Image source={WOBY.happy} style={styles.panelFace} />
        <View style={styles.panelTextColumn}>
          <Text style={styles.panelLabel}>First thing I'd do</Text>
          <Text style={styles.panelBody}>{firstSuggestion}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    paddingTop: 32,
  },
  hero: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 20,
    textAlign: 'center',
  },
  summary: {
    marginTop: 12,
    maxWidth: 296,
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 22,
    color: color.inkSecondary,
  },
  panel: {
    width: '100%',
    marginTop: 24,
    backgroundColor: color.tintWash35,
    borderRadius: radius.card,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  panelFace: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  panelTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  panelLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: color.accent,
  },
  panelBody: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 20,
    color: color.ink,
  },
});
