import { useState } from 'react';
import { AccessibilityRole, Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { PushedScreen } from '../../components/primitives/PushedScreen';
import { ConfirmAlert } from '../../components/primitives/ConfirmAlert';
import { Toast } from '../../components/primitives/Toast';
import { WOBY } from '../../assets/woby';
import { useConfirmAlert } from '../../hooks/useConfirmAlert';
import { useToast } from '../../hooks/useToast';
import { color, radius } from '../../theme/tokens';
import { useAppStore } from '../../state/store';
import { DEFAULT_CONTACTS, NO_CONTACT, contactFirstName } from '../../data/contacts';
import { TRIAGE_LEVELS, TriageKey } from '../../data/triage';
import { fillTemplate } from '../../domain/template';
import { CITY_PACKS } from '../../data/cityPacks';

type UrgencyCheckScreenProps = {
  onBack: () => void;
  onShowDetails: () => void;
};

export function UrgencyCheckScreen({ onBack, onShowDetails }: UrgencyCheckScreenProps) {
  const contactId = useAppStore((s) => s.contactId);
  const customContacts = useAppStore((s) => s.customContacts);
  const ACTIVE_PACK = useAppStore((s) => CITY_PACKS[s.cityPackKey]);
  const contact = [...DEFAULT_CONTACTS, ...customContacts, NO_CONTACT].find((c) => c.id === contactId) ?? NO_CONTACT;
  const contactFirst = contactFirstName(contact);

  const [triage, setTriage] = useState<TriageKey>('soon');
  const alert = useConfirmAlert();
  const toast = useToast();

  const level = TRIAGE_LEVELS.find((l) => l.key === triage) ?? TRIAGE_LEVELS[1];
  const ctx = { pack: ACTIVE_PACK, contactFirst };

  const callNumber = (num: string, note: string) => {
    alert.show({
      title: `Call ${num}?`,
      body: note,
      confirmLabel: `Call ${num}`,
      destructive: true,
      onConfirm: () => Linking.openURL(`tel:${num}`),
    });
  };

  const actions =
    triage === 'now'
      ? ACTIVE_PACK.emergencyNumbers.map((e) => ({ label: `Call ${e.num}`, note: e.note, color: color.danger }))
      : level.actions.map((a) => ({ label: fillTemplate(a.label, ctx), note: fillTemplate(a.note, ctx), color: a.color }));

  const handleActionTap = (label: string, note: string) => {
    if (/^Call/.test(label)) {
      callNumber(label.replace(/^Call\s*/, ''), `${note} Warbler will show your details on screen while you talk.`);
    } else if (/Breathe/.test(label)) {
      toast.show("Four in, six out. I'll count with you.");
    } else if (new RegExp(contactFirst).test(label)) {
      onBack();
      toast.show('Draft is ready on the Support tab. Nothing sent yet.');
    } else if (/details/i.test(label)) {
      onShowDetails();
    } else {
      toast.show('On screen now. Take your time.');
    }
  };

  return (
    <PushedScreen title="Getting help" backLabel="Support" onBack={onBack}>
      <View style={styles.infoPanel}>
        <Image source={WOBY.hero} style={styles.infoFace} />
        <Text style={styles.infoText}>
          From what you've told me tonight, this reads as something to sort soon rather than this second. You know
          better than me though — change it if I've got it wrong.
        </Text>
      </View>

      <View style={styles.emgRow}>
        {ACTIVE_PACK.emergencyNumbers.map((e, i) => (
          <Pressable
            key={e.num}
            onPress={() => callNumber(e.num, e.note)}
            accessibilityRole={'button' as AccessibilityRole}
            style={({ pressed }) => [
              styles.emgButton,
              i === 0 ? styles.emgButtonPrimary : styles.emgButtonSecondary,
              pressed && (i === 0 ? styles.emgButtonPrimaryPressed : styles.emgButtonSecondaryPressed),
            ]}
          >
            <Text style={[styles.emgButtonLabel, { color: i === 0 ? color.surface : color.danger }]}>
              Call {e.num}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.caption}>{ACTIVE_PACK.emergencyCaption}</Text>

      <Text style={[styles.groupHeader, styles.howUrgentHeader]}>How urgent is it?</Text>
      <View style={styles.levelList}>
        {TRIAGE_LEVELS.map((l) => (
          <Pressable
            key={l.key}
            onPress={() => setTriage(l.key)}
            accessibilityRole={'radio' as AccessibilityRole}
            accessibilityState={{ selected: l.key === triage }}
            style={({ pressed }) => [
              styles.levelCard,
              { borderColor: l.key === triage ? color.tint : 'transparent' },
              pressed && styles.levelCardPressed,
            ]}
          >
            <View style={styles.levelHeaderRow}>
              <View style={[styles.levelDot, { backgroundColor: l.dotColor }]} />
              <Text style={styles.levelLabel}>{l.label}</Text>
              {l.suggested ? <Text style={styles.suggestedBadge}>Woby's read</Text> : null}
            </View>
            <Text style={styles.levelBody}>{l.body}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.groupHeader, styles.actionsHeader]}>{level.title}</Text>
      <View style={styles.actionsCard}>
        {actions.map((action, index) => (
          <View key={`${action.label}-${index}`}>
            {index > 0 ? <View style={styles.separator} /> : null}
            <Pressable
              onPress={() => handleActionTap(action.label, action.note)}
              accessibilityRole={'button' as AccessibilityRole}
              style={({ pressed }) => [styles.actionRow, pressed && styles.actionRowPressed]}
            >
              <View style={styles.actionTextColumn}>
                <Text style={[styles.actionLabel, { color: action.color }]}>{action.label}</Text>
                <Text style={styles.actionNote}>{action.note}</Text>
              </View>
            </Pressable>
          </View>
        ))}
      </View>
      <Text style={styles.caption}>
        Warbler can't reach anyone for you. These put the right number and the right words in front of you — you
        make the call.
      </Text>

      <ConfirmAlert config={alert.config} onCancel={alert.hide} />
      <Toast message={toast.message} onDismiss={toast.hide} />
    </PushedScreen>
  );
}

const styles = StyleSheet.create({
  infoPanel: {
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
  emgRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  emgButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: radius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emgButtonPrimary: {
    backgroundColor: color.danger,
  },
  emgButtonPrimaryPressed: {
    backgroundColor: '#B02218',
  },
  emgButtonSecondary: {
    backgroundColor: color.surface,
    shadowColor: 'rgba(22,50,63,.07)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1,
  },
  emgButtonSecondaryPressed: {
    backgroundColor: 'rgba(217,43,31,.06)',
  },
  emgButtonLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  caption: {
    marginTop: 8,
    marginHorizontal: 4,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
  groupHeader: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: color.inkSecondary,
  },
  howUrgentHeader: {
    marginTop: 24,
    marginBottom: 8,
  },
  levelList: {
    gap: 8,
  },
  levelCard: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    shadowColor: 'rgba(22,50,63,.07)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1,
  },
  levelCardPressed: {
    backgroundColor: color.tintWash30,
  },
  levelHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  levelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  levelLabel: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: color.ink,
  },
  suggestedBadge: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: color.accent,
  },
  levelBody: {
    marginTop: 6,
    marginLeft: 20,
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  actionsHeader: {
    marginTop: 24,
    marginBottom: 8,
  },
  actionsCard: {
    backgroundColor: color.surface,
    borderRadius: radius.row,
    overflow: 'hidden',
  },
  separator: {
    height: 0.5,
    backgroundColor: color.hairline18,
    marginLeft: 16,
  },
  actionRow: {
    minHeight: 44,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  actionRowPressed: {
    backgroundColor: color.tintWash30,
  },
  actionTextColumn: {
    minWidth: 0,
  },
  actionLabel: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
  },
  actionNote: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkSecondary,
  },
});
