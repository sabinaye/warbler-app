import { Image, StyleSheet, Text, View } from 'react-native';

import { WOBY } from '../../../assets/woby';
import { CheckAgreeIcon, XIcon } from '../../../components/icons/icons';
import { color, radius } from '../../../theme/tokens';
import { textStyle } from '../../../theme/typography';

export function HelloStep() {
  return (
    <View style={styles.root}>
      <Image source={WOBY.hero} style={styles.hero} />
      <Text style={[textStyle.largeTitle, styles.title]}>Hi, I'm Woby.</Text>
      <Text style={styles.subtitle}>
        I travel with you. I'll hold the details of your trip, and when you're not sure what's next, I'll lay out a
        few good options.
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={[styles.bullet, { backgroundColor: color.successWash14 }]}>
            <CheckAgreeIcon color={color.success} />
          </View>
          <Text style={styles.rowText}>What I can do: help you decide, keep your plan, and put the right number in front of you.</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={[styles.bullet, { backgroundColor: 'rgba(95,118,131,.14)' }]}>
            <XIcon color={color.inkSecondary} />
          </View>
          <Text style={styles.rowText}>What I can't: promise nothing will go wrong, or reach anyone on your behalf.</Text>
        </View>
      </View>

      <Text style={styles.footnote}>No account needed. Everything starts on this phone.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: 24,
  },
  hero: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    maxWidth: 296,
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 22,
    color: color.inkSecondary,
  },
  card: {
    width: '100%',
    marginTop: 24,
    backgroundColor: color.surface,
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  separator: {
    height: 0.5,
    backgroundColor: color.hairline18,
    marginLeft: 16,
  },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  rowText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: color.ink,
    textAlign: 'left',
  },
  footnote: {
    marginTop: 16,
    maxWidth: 296,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
});
