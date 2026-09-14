import { StyleSheet, Text, View } from 'react-native';

import { PushedScreen } from '../../components/primitives/PushedScreen';
import { color, radius } from '../../theme/tokens';
import { useAppStore } from '../../state/store';
import { DEFAULT_CONTACTS, NO_CONTACT } from '../../data/contacts';
import { CITY_PACKS } from '../../data/cityPacks';

type YourDetailsScreenProps = {
  onBack: () => void;
};

// The prototype's "Your details" screen (reachable from the urgency check's "Show my details on
// screen" action) shows Name/Blood type/Allergies/Insurance/24-hour line fields, but no
// onboarding step in the README collects any of them — only the trusted contact is real data
// today. Showing "Not set" for the rest rather than the prototype's fixture persona (it hardcodes
// a fictional "Maya Raman" with a blood type, allergy and policy number as demo filler).
export function YourDetailsScreen({ onBack }: YourDetailsScreenProps) {
  const contactId = useAppStore((s) => s.contactId);
  const customContacts = useAppStore((s) => s.customContacts);
  const ACTIVE_PACK = useAppStore((s) => CITY_PACKS[s.cityPackKey]);
  const contact = [...DEFAULT_CONTACTS, ...customContacts, NO_CONTACT].find((c) => c.id === contactId) ?? NO_CONTACT;

  const rows: { key: string; value: string }[] = [
    { key: 'Name', value: 'Not set' },
    { key: 'Blood type', value: 'Not set' },
    { key: 'Allergies', value: 'Not set' },
    { key: 'Insurance', value: 'Not set' },
    { key: '24-hour line', value: 'Not set' },
    { key: 'Contact', value: contact.id === 'none' ? 'Not set' : contact.name },
  ];

  return (
    <PushedScreen title="Your details" backLabel="Getting help" onBack={onBack}>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Medical and emergency details</Text>
        <Text style={styles.cardPhrase}>{ACTIVE_PACK.helpPhrase}</Text>
        <View style={styles.cardDivider} />
        <Text style={styles.cardEmg}>
          Local emergency: {ACTIVE_PACK.emergencyNumbers.map((e) => e.num).join(' or ')}
        </Text>
      </View>

      <View style={styles.rowsCard}>
        {rows.map((row, index) => (
          <View key={row.key}>
            {index > 0 ? <View style={styles.separator} /> : null}
            <View style={styles.row}>
              <Text style={styles.rowKey}>{row.key}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.caption}>Hold the phone up so someone else can read this. It stays on screen and works with no signal.</Text>
    </PushedScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.ink,
    borderRadius: 14,
    padding: 20,
  },
  cardLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: color.tintLight,
  },
  cardPhrase: {
    marginTop: 10,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    color: color.surface,
  },
  cardDivider: {
    marginTop: 14,
    height: 0.5,
    backgroundColor: 'rgba(167,202,221,.35)',
  },
  cardEmg: {
    marginTop: 14,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: color.surface,
  },
  rowsCard: {
    marginTop: 16,
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
    minHeight: 44,
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowKey: {
    fontSize: 17,
    lineHeight: 22,
    color: color.inkSecondary,
  },
  rowValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: color.ink,
  },
  caption: {
    marginTop: 12,
    marginHorizontal: 4,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
});
