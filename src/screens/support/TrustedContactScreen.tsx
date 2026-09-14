import { useState } from 'react';
import {
  AccessibilityRole,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Avatar } from '../../components/primitives/Avatar';
import { GroupedList, GroupedRow } from '../../components/primitives/GroupedList';
import { PushedScreen } from '../../components/primitives/PushedScreen';
import { CheckmarkIcon, PlusIcon } from '../../components/icons/icons';
import { color, radius, touchTarget } from '../../theme/tokens';
import { textStyle } from '../../theme/typography';
import { useAppStore } from '../../state/store';
import { Contact, DEFAULT_CONTACTS, NO_CONTACT, contactFirstName } from '../../data/contacts';
import { LOCATION_SHARE_OPTIONS } from '../../data/locationSharingOptions';
import { formatRelativeTime } from '../../domain/relativeTime';

type TrustedContactScreenProps = {
  onBack: () => void;
};

export function TrustedContactScreen({ onBack }: TrustedContactScreenProps) {
  const contactId = useAppStore((s) => s.contactId);
  const customContacts = useAppStore((s) => s.customContacts);
  const locationShare = useAppStore((s) => s.locationShare);
  const lastToldAt = useAppStore((s) => s.lastToldAt);
  const setContact = useAppStore((s) => s.setContact);
  const addCustomContact = useAppStore((s) => s.addCustomContact);
  const [addingContact, setAddingContact] = useState(false);

  const allContacts = [...DEFAULT_CONTACTS, ...customContacts, NO_CONTACT];
  const contact = allContacts.find((c) => c.id === contactId) ?? NO_CONTACT;
  const contactFirst = contactFirstName(contact);
  const shareShort = LOCATION_SHARE_OPTIONS.find((o) => o.key === locationShare)?.short ?? 'Off';

  return (
    <PushedScreen title="Trusted contact" backLabel="Support" onBack={onBack}>
      <View style={styles.contactCard}>
        <Avatar initial={contact.initial} backgroundColor={contact.avatarColor} size={52} fontSize={20} />
        <View style={styles.contactCardText}>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.contactMeta}>
            {lastToldAt ? `Last told ${formatRelativeTime(lastToldAt)}` : 'Not told yet'}
          </Text>
        </View>
      </View>

      <Text style={[textStyle.groupHeader, styles.groupHeader]}>Who it is</Text>
      <GroupedList>
        {allContacts.map((candidate) => (
          <GroupedRow
            key={candidate.id}
            label={candidate.name}
            sublabel={candidate.id === 'none' ? candidate.relationship : `${candidate.relationship} · ${candidate.phone}`}
            leading={<Avatar initial={candidate.initial} backgroundColor={candidate.avatarColor} size={40} fontSize={17} />}
            onPress={() => setContact(candidate.id)}
            disclosure={false}
          >
            <View style={{ opacity: candidate.id === contactId ? 1 : 0 }}>
              <CheckmarkIcon color={color.accent} />
            </View>
          </GroupedRow>
        ))}
      </GroupedList>

      <View style={styles.addCard}>
        <Pressable
          onPress={() => setAddingContact(true)}
          accessibilityRole={'button' as AccessibilityRole}
          style={({ pressed }) => [styles.addRow, pressed && styles.addRowPressed]}
        >
          <View style={styles.addIconTile}>
            <PlusIcon color={color.accent} />
          </View>
          <Text style={styles.addLabel}>Add someone new</Text>
        </Pressable>
      </View>
      <Text style={styles.caption}>Changing this tells nobody. I only send what you ask me to send.</Text>

      <Text style={[textStyle.groupHeader, styles.groupHeader]}>What {contactFirst} can see</Text>
      <GroupedList>
        <GroupedRow label="Messages you send" value="Always" disclosure={false} />
        <GroupedRow label="Your location" value={shareShort} disclosure={false} />
        <GroupedRow label="Your plan and spending" value="Never" disclosure={false} />
      </GroupedList>
      <Text style={styles.caption}>{contactFirst} has no app and no account — just the messages you choose to send.</Text>

      <AddContactModal
        visible={addingContact}
        onCancel={() => setAddingContact(false)}
        onSave={(newContact) => {
          addCustomContact(newContact);
          setAddingContact(false);
        }}
      />
    </PushedScreen>
  );
}

function AddContactModal({
  visible,
  onCancel,
  onSave,
}: {
  visible: boolean;
  onCancel: () => void;
  onSave: (contact: Contact) => void;
}) {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');

  const canSave = name.trim().length > 0 && phone.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const trimmedName = name.trim();
    onSave({
      id: `custom-${Date.now()}`,
      name: trimmedName,
      relationship: relationship.trim() || 'Trusted contact',
      phone: phone.trim(),
      initial: trimmedName.charAt(0).toUpperCase() || '?',
      avatarColor: color.tintLight,
    });
    setName('');
    setRelationship('');
    setPhone('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={modalStyles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityElementsHidden />
        <View style={modalStyles.sheet}>
          <Text style={modalStyles.title}>Add someone new</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Name"
            placeholderTextColor={color.inkTertiary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInput
            style={modalStyles.input}
            placeholder="Relationship"
            placeholderTextColor={color.inkTertiary}
            value={relationship}
            onChangeText={setRelationship}
            autoCapitalize="words"
          />
          <TextInput
            style={modalStyles.input}
            placeholder="Phone"
            placeholderTextColor={color.inkTertiary}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Pressable
            onPress={handleSave}
            disabled={!canSave}
            accessibilityRole={'button' as AccessibilityRole}
            style={({ pressed }) => [
              modalStyles.saveButton,
              !canSave && modalStyles.saveButtonDisabled,
              pressed && canSave && modalStyles.saveButtonPressed,
            ]}
          >
            <Text style={modalStyles.saveLabel}>Save</Text>
          </Pressable>
          <Pressable onPress={onCancel} accessibilityRole={'button' as AccessibilityRole} style={modalStyles.cancelButton}>
            <Text style={modalStyles.cancelLabel}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  contactCard: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactCardText: {
    flex: 1,
    minWidth: 0,
  },
  contactName: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: color.ink,
  },
  contactMeta: {
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  groupHeader: {
    marginTop: 24,
    marginBottom: 8,
  },
  addCard: {
    marginTop: 8,
    backgroundColor: color.surface,
    borderRadius: radius.row,
    overflow: 'hidden',
  },
  addRow: {
    minHeight: touchTarget.min,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addRowPressed: {
    backgroundColor: color.tintWash30,
  },
  addIconTile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(42,123,164,.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLabel: {
    fontSize: 17,
    lineHeight: 22,
    color: color.accent,
  },
  caption: {
    marginTop: 8,
    marginHorizontal: 4,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
});

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(14,28,36,.4)',
  },
  sheet: {
    backgroundColor: color.canvas,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    padding: 16,
    paddingBottom: 34,
    gap: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: color.ink,
    marginBottom: 4,
  },
  input: {
    minHeight: touchTarget.min,
    borderRadius: radius.row,
    backgroundColor: color.surface,
    paddingHorizontal: 16,
    fontSize: 17,
    color: color.ink,
  },
  saveButton: {
    height: 50,
    borderRadius: radius.card,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(22,50,63,.16)',
  },
  saveButtonPressed: {
    backgroundColor: color.accentPressed,
  },
  saveLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: color.surface,
  },
  cancelButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLabel: {
    fontSize: 17,
    color: color.accent,
  },
});
