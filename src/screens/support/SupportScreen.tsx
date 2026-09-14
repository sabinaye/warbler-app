import { AccessibilityRole, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '../../components/primitives/Avatar';
import { GroupedList, GroupedRow } from '../../components/primitives/GroupedList';
import { IconTile } from '../../components/primitives/IconTile';
import { TabScreen } from '../../components/primitives/TabScreen';
import { Toggle } from '../../components/primitives/Toggle';
import { ConfirmAlert } from '../../components/primitives/ConfirmAlert';
import { Toast } from '../../components/primitives/Toast';
import {
  DownloadCloudIcon,
  LocationPinIcon,
  MessageBubbleIcon,
  ReplayIcon,
  ShieldIcon,
  WarningTriangleIcon,
} from '../../components/icons/icons';
import { useConfirmAlert } from '../../hooks/useConfirmAlert';
import { useToast } from '../../hooks/useToast';
import { useTourTarget } from '../../hooks/useTourTarget';
import { color } from '../../theme/tokens';
import { textStyle } from '../../theme/typography';
import { useAppStore } from '../../state/store';
import { DEFAULT_CONTACTS, NO_CONTACT, contactFirstName } from '../../data/contacts';
import { LOCATION_SHARE_OPTIONS } from '../../data/locationSharingOptions';

export type SupportPush = 'contact' | 'location' | 'data' | 'triage';

type SupportScreenProps = {
  onNavigate: (push: SupportPush) => void;
};

export function SupportScreen({ onNavigate }: SupportScreenProps) {
  const contactId = useAppStore((s) => s.contactId);
  const customContacts = useAppStore((s) => s.customContacts);
  const locationShare = useAppStore((s) => s.locationShare);
  const offlineEnabled = useAppStore((s) => s.offlineEnabled);
  const offlineProgress = useAppStore((s) => s.offlineProgress);
  const toggleOffline = useAppStore((s) => s.toggleOffline);
  const replayTour = useAppStore((s) => s.replayTour);
  const resetEverything = useAppStore((s) => s.resetEverything);
  const helpCardTargetRef = useTourTarget('support-urgency');
  const markToldNow = useAppStore((s) => s.markToldNow);

  const alert = useConfirmAlert();
  const toast = useToast();

  const contact = [...DEFAULT_CONTACTS, ...customContacts].find((c) => c.id === contactId) ?? NO_CONTACT;
  const contactFirst = contactFirstName(contact);
  const shareOption = LOCATION_SHARE_OPTIONS.find((o) => o.key === locationShare) ?? LOCATION_SHARE_OPTIONS[3];
  const shareOn = locationShare !== 'none';
  const shareInk = shareOn ? color.success : color.inkSecondary;
  const shareTile = shareOn ? 'rgba(47,125,87,.14)' : 'rgba(95,118,131,.12)';

  const offlineNote =
    offlineProgress >= 100
      ? 'Maps, timetables and your plan are on this phone now.'
      : offlineProgress > 0
        ? `Saving maps and timetables… ${offlineProgress}%`
        : 'Maps, timetables and your plan, kept on this phone.';

  const handleTellContact = () => {
    if (!contact.phone) return;
    const message = "I'm okay. Just checking in.";
    const separator = Platform.OS === 'ios' ? '&' : '?';
    Linking.openURL(`sms:${contact.phone}${separator}body=${encodeURIComponent(message)}`)
      .then(() => markToldNow())
      .catch(() => toast.show("Couldn't open Messages."));
  };

  return (
    <>
      <TabScreen title="Support">
        <Text style={textStyle.largeTitle}>Support</Text>
        <Text style={[textStyle.bodySecondary, styles.subhead]}>Nothing leaves this phone unless you send it.</Text>

        <View style={styles.section}>
          <GroupedList>
            <GroupedRow
              label="Trusted contact"
              value={contactFirst}
              leading={<Avatar initial={contact.initial} backgroundColor={contact.avatarColor} />}
              onPress={() => onNavigate('contact')}
            />
            <GroupedRow
              label="Location sharing"
              value={shareOption.short}
              valueColor={shareInk}
              leading={
                <IconTile backgroundColor={shareTile}>
                  <LocationPinIcon color={shareInk} />
                </IconTile>
              }
              onPress={() => onNavigate('location')}
            />
            <GroupedRow
              label="What Warbler knows"
              leading={
                <IconTile backgroundColor="rgba(42,123,164,.14)">
                  <ShieldIcon color={color.accent} />
                </IconTile>
              }
              onPress={() => onNavigate('data')}
            />
            <SupportOfflineRow
              enabled={offlineEnabled}
              progress={offlineProgress}
              note={offlineNote}
              onToggle={toggleOffline}
            />
            <GroupedRow
              label="Show me around again"
              disclosure={false}
              leading={
                <IconTile backgroundColor="rgba(42,123,164,.14)">
                  <ReplayIcon color={color.accent} />
                </IconTile>
              }
              onPress={replayTour}
            />
          </GroupedList>
        </View>

        <View style={styles.section}>
          <Pressable
            onPress={handleTellContact}
            accessibilityRole={'button' as AccessibilityRole}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          >
            <MessageBubbleIcon color={color.surface} />
            <Text style={styles.primaryButtonLabel}>Tell {contactFirst} I'm okay</Text>
          </Pressable>
          <Text style={styles.caption}>Sends one short message. No location, no trip details.</Text>
        </View>

        <View style={styles.section}>
          <Pressable
            ref={helpCardTargetRef}
            onPress={() => onNavigate('triage')}
            accessibilityRole={'button' as AccessibilityRole}
            style={({ pressed }) => [styles.helpCard, pressed && styles.helpCardPressed]}
          >
            <IconTile backgroundColor="rgba(217,43,31,.12)">
              <WarningTriangleIcon />
            </IconTile>
            <View style={styles.helpTextColumn}>
              <Text style={styles.helpTitle}>I need help now</Text>
              <Text style={styles.helpSubtitle}>
                Local emergency numbers, your insurance details and {contactFirst} — one screen, works offline.
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Pressable
            onPress={() =>
              alert.show({
                title: 'Start over?',
                body: 'This trip and your setup are cleared from this phone, and first-time setup runs again.',
                confirmLabel: 'Start over',
                destructive: true,
                onConfirm: () => {
                  resetEverything();
                  toast.show('Cleared. Setup will run again next launch.');
                },
              })
            }
            accessibilityRole={'button' as AccessibilityRole}
            style={({ pressed }) => [styles.resetButton, pressed && styles.resetButtonPressed]}
          >
            <Text style={styles.resetLabel}>Start over from the beginning</Text>
          </Pressable>
          <Text style={styles.caption}>Clears this trip and runs first-time setup again.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.disclaimer}>
            Warbler is a lightweight safety net, not a guarantee. It helps you feel prepared and supported when
            something unexpected happens — it can't prevent it.
          </Text>
        </View>
      </TabScreen>

      <ConfirmAlert config={alert.config} onCancel={alert.hide} />
      <Toast message={toast.message} onDismiss={toast.hide} />
    </>
  );
}

function SupportOfflineRow({
  enabled,
  progress,
  note,
  onToggle,
}: {
  enabled: boolean;
  progress: number;
  note: string;
  onToggle: () => void;
}) {
  return (
    <GroupedRow
      label="Save it all offline"
      sublabel={note}
      disclosure={false}
      leading={
        <IconTile backgroundColor="rgba(47,125,87,.14)">
          <DownloadCloudIcon color={color.success} />
        </IconTile>
      }
    >
      <Toggle on={enabled} onToggle={onToggle} accessibilityLabel="Save offline" />
    </GroupedRow>
  );
}

const styles = StyleSheet.create({
  subhead: {
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  primaryButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: color.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonPressed: {
    backgroundColor: color.accentPressed,
  },
  primaryButtonLabel: {
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
  helpCard: {
    backgroundColor: color.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  helpCardPressed: {
    backgroundColor: 'rgba(217,43,31,.06)',
  },
  helpTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  helpTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: color.danger,
  },
  helpSubtitle: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  resetButton: {
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonPressed: {
    opacity: 0.6,
  },
  resetLabel: {
    fontSize: 17,
    color: color.accent,
  },
  disclaimer: {
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
    marginHorizontal: 4,
  },
});
