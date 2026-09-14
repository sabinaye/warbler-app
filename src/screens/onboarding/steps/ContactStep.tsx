import { useState } from 'react';
import { AccessibilityRole, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Avatar } from '../../../components/primitives/Avatar';
import { AppModal } from '../../../components/primitives/AppModal';
import { CheckAgreeIcon, PlusIcon } from '../../../components/icons/icons';
import { color, radius, touchTarget } from '../../../theme/tokens';
import { useAppStore } from '../../../state/store';
import { Contact, DEFAULT_CONTACTS, NO_CONTACT } from '../../../data/contacts';

export function ContactStep() {
  const contactId = useAppStore((s) => s.contactId);
  const customContacts = useAppStore((s) => s.customContacts);
  const setContact = useAppStore((s) => s.setContact);
  const addCustomContact = useAppStore((s) => s.addCustomContact);
  const [addingContact, setAddingContact] = useState(false);

  const allContacts = [...DEFAULT_CONTACTS, ...customContacts, NO_CONTACT];

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Who should I keep in the loop?</Text>
      <Text style={styles.subtitle}>Just one person. I'll only reach out when you ask me to — never on my own.</Text>

      <View style={styles.card}>
        {allContacts.map((candidate, index) => (
          <View key={candidate.id}>
            {index > 0 ? <View style={styles.separator} /> : null}
            <Pressable
              onPress={() => setContact(candidate.id)}
              accessibilityRole={'radio' as AccessibilityRole}
              accessibilityState={{ selected: candidate.id === contactId }}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <Avatar initial={candidate.initial} backgroundColor={candidate.avatarColor} size={40} fontSize={17} />
              <View style={styles.rowTextColumn}>
                <Text style={styles.rowName}>{candidate.name}</Text>
                <Text style={styles.rowRel}>{candidate.id === 'none' ? candidate.relationship : `${candidate.relationship}`}</Text>
              </View>
              <View style={{ opacity: candidate.id === contactId ? 1 : 0 }}>
                <CheckAgreeIcon color={color.accent} size={17} />
              </View>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.addCard}>
        <Pressable
          onPress={() => setAddingContact(true)}
          accessibilityRole={'button' as AccessibilityRole}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        >
          <View style={styles.addIconTile}>
            <PlusIcon color={color.accent} />
          </View>
          <Text style={styles.addLabel}>Add someone else</Text>
        </Pressable>
      </View>
      <Text style={styles.footnote}>You can change this or remove them entirely at any time.</Text>

      <AddContactModal
        visible={addingContact}
        onCancel={() => setAddingContact(false)}
        onSave={(contact) => {
          addCustomContact(contact);
          setAddingContact(false);
        }}
      />
    </View>
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
  const canSave = name.trim().length > 0;

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
    <AppModal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <View style={modalStyles.backdrop}>
        <Pressable style={{ flex: 1 }} onPress={onCancel} accessibilityElementsHidden />
        <View style={modalStyles.sheet}>
          <View style={modalStyles.headerRow}>
            <Pressable onPress={onCancel} accessibilityRole={'button' as AccessibilityRole}>
              <Text style={modalStyles.cancelLabel}>Cancel</Text>
            </Pressable>
            <Text style={modalStyles.title}>New contact</Text>
            <Pressable onPress={handleSave} disabled={!canSave} accessibilityRole={'button' as AccessibilityRole}>
              <Text style={[modalStyles.saveLabel, { color: canSave ? color.accent : color.inkTertiary }]}>Save</Text>
            </Pressable>
          </View>
          <View style={modalStyles.card}>
            <View style={modalStyles.field}>
              <Text style={modalStyles.fieldLabel}>Name</Text>
              <TextInput style={modalStyles.fieldInput} value={name} onChangeText={setName} placeholder="Their name" placeholderTextColor={color.inkTertiary} />
            </View>
            <View style={modalStyles.separator} />
            <View style={modalStyles.field}>
              <Text style={modalStyles.fieldLabel}>Relationship</Text>
              <TextInput style={modalStyles.fieldInput} value={relationship} onChangeText={setRelationship} placeholder="Sister, friend…" placeholderTextColor={color.inkTertiary} />
            </View>
            <View style={modalStyles.separator} />
            <View style={modalStyles.field}>
              <Text style={modalStyles.fieldLabel}>Phone</Text>
              <TextInput style={modalStyles.fieldInput} value={phone} onChangeText={setPhone} placeholder="Optional" placeholderTextColor={color.inkTertiary} keyboardType="phone-pad" />
            </View>
          </View>
          <Text style={modalStyles.footnote}>Stored on this phone only. They get nothing until you send them something.</Text>
        </View>
      </View>
    </AppModal>
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
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.row,
    overflow: 'hidden',
  },
  separator: {
    height: 0.5,
    backgroundColor: color.hairline18,
    marginLeft: 68,
  },
  row: {
    minHeight: touchTarget.min,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowPressed: {
    backgroundColor: color.tintWash30,
  },
  rowTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  rowName: {
    fontSize: 17,
    lineHeight: 22,
    color: color.ink,
  },
  rowRel: {
    fontSize: 13,
    lineHeight: 18,
    color: color.inkSecondary,
  },
  addCard: {
    marginTop: 8,
    backgroundColor: color.surface,
    borderRadius: radius.row,
    overflow: 'hidden',
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
  footnote: {
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
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 34,
  },
  headerRow: {
    minHeight: touchTarget.min,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
    lineHeight: 22,
    color: color.ink,
  },
  cancelLabel: {
    fontSize: 17,
    color: color.accent,
  },
  saveLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  card: {
    marginTop: 8,
    backgroundColor: color.surface,
    borderRadius: radius.row,
    overflow: 'hidden',
  },
  separator: {
    height: 0.5,
    backgroundColor: color.hairline18,
    marginLeft: 16,
  },
  field: {
    minHeight: touchTarget.min,
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fieldLabel: {
    width: 104,
    fontSize: 17,
    lineHeight: 22,
    color: color.ink,
  },
  fieldInput: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    color: color.ink,
    padding: 0,
  },
  footnote: {
    marginTop: 8,
    marginHorizontal: 4,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
});
