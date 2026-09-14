import { AccessibilityRole, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

import { BellIcon, LocationPinIcon } from '../../../components/icons/icons';
import { Toggle } from '../../../components/primitives/Toggle';
import { color, radius, touchTarget } from '../../../theme/tokens';
import { useOnboardingStore, PermissionState } from '../../../state/onboardingStore';
import { useAppStore } from '../../../state/store';

function permissionCopy(state: PermissionState, granted: string, denied: string, ask: string) {
  return state === 'granted' ? granted : state === 'denied' ? denied : ask;
}

export function ReadyStep() {
  const locPerm = useOnboardingStore((s) => s.locPerm);
  const notifPerm = useOnboardingStore((s) => s.notifPerm);
  const setLocPerm = useOnboardingStore((s) => s.setLocPerm);
  const setNotifPerm = useOnboardingStore((s) => s.setNotifPerm);
  const offlineEnabled = useAppStore((s) => s.offlineEnabled);
  const offlineProgress = useAppStore((s) => s.offlineProgress);
  const toggleOffline = useAppStore((s) => s.toggleOffline);

  const handleAskLocation = async () => {
    if (locPerm !== 'ask') return;
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocPerm(status === 'granted' ? 'granted' : 'denied');
  };

  const handleAskNotifs = async () => {
    if (notifPerm !== 'ask') return;
    const { status } = await Notifications.requestPermissionsAsync();
    setNotifPerm(status === 'granted' ? 'granted' : 'denied');
  };

  const offlineNote =
    offlineProgress >= 100
      ? 'Maps, timetables and your plan are on this phone now.'
      : offlineProgress > 0
        ? `Saving maps and timetables… ${offlineProgress}%`
        : 'Maps, timetables and your plan, kept on this phone.';

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Two things before you fly</Text>
      <Text style={styles.subtitle}>Both are optional, and Warbler works without either.</Text>

      <View style={styles.list}>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={[styles.iconTile, { backgroundColor: locPerm === 'granted' ? color.successWash14 : 'rgba(95,118,131,.12)' }]}>
              <LocationPinIcon color={locPerm === 'granted' ? color.success : color.inkSecondary} />
            </View>
            <View style={styles.cardTextColumn}>
              <Text style={styles.cardTitle}>Where you are</Text>
              <Text style={styles.cardBody}>Lets me work out what's walkable right now. I never share it with anyone unless you tell me to.</Text>
            </View>
          </View>
          <Pressable
            onPress={handleAskLocation}
            accessibilityRole={'button' as AccessibilityRole}
            style={[styles.permButton, { backgroundColor: locPerm === 'ask' ? color.accent : 'rgba(22,50,63,.07)' }]}
          >
            <Text style={[styles.permButtonLabel, { color: locPerm === 'ask' ? color.surface : color.inkSecondary }]}>
              {permissionCopy(locPerm, 'Allowed while using the app', "Not allowed — that's fine", 'Allow location')}
            </Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={[styles.iconTile, { backgroundColor: notifPerm === 'granted' ? color.successWash14 : 'rgba(95,118,131,.12)' }]}>
              <BellIcon color={notifPerm === 'granted' ? color.success : color.inkSecondary} />
            </View>
            <View style={styles.cardTextColumn}>
              <Text style={styles.cardTitle}>A nudge when it matters</Text>
              <Text style={styles.cardBody}>Last trains, a booking you'd forget. Never streaks, never nagging.</Text>
            </View>
          </View>
          <Pressable
            onPress={handleAskNotifs}
            accessibilityRole={'button' as AccessibilityRole}
            style={[styles.permButton, { backgroundColor: notifPerm === 'ask' ? color.accent : 'rgba(22,50,63,.07)' }]}
          >
            <Text style={[styles.permButtonLabel, { color: notifPerm === 'ask' ? color.surface : color.inkSecondary }]}>
              {permissionCopy(notifPerm, 'Notifications on', 'Off — Warbler still works', 'Allow notifications')}
            </Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.offlineRow}>
            <View style={styles.cardTextColumn}>
              <Text style={styles.cardTitle}>Save it all offline</Text>
              <Text style={styles.cardBody}>{offlineNote}</Text>
            </View>
            <Toggle on={offlineEnabled} onToggle={toggleOffline} accessibilityLabel="Save it all offline" />
          </View>
          {offlineEnabled && offlineProgress < 100 ? (
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${offlineProgress}%` }]} />
            </View>
          ) : null}
          {offlineEnabled && offlineProgress >= 100 ? (
            <View style={styles.savedPill}>
              <Text style={styles.savedLabel}>Saved to this phone</Text>
            </View>
          ) : null}
        </View>
      </View>
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
  list: {
    gap: 8,
  },
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    padding: 14,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconTile: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: color.ink,
  },
  cardBody: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  permButton: {
    marginTop: 12,
    minHeight: touchTarget.min,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permButtonLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  offlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    marginTop: 12,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(22,50,63,.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: color.success,
  },
  savedPill: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: color.successWash14,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  savedLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: color.success,
  },
});
