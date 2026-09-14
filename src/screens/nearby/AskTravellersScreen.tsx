import { useState } from 'react';
import { AccessibilityRole, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PushedScreen } from '../../components/primitives/PushedScreen';
import { Toggle } from '../../components/primitives/Toggle';
import { Toast } from '../../components/primitives/Toast';
import { WOBY } from '../../assets/woby';
import { useToast } from '../../hooks/useToast';
import { color, radius, touchTarget } from '../../theme/tokens';
import { useAppStore } from '../../state/store';
import { CITY_PACKS } from '../../data/cityPacks';

type AskTravellersScreenProps = {
  onBack: () => void;
};

const SUGGESTION_LABELS = ['Is it safe right now?', 'How much should this cost?', 'Is this normal here?'];

export function AskTravellersScreen({ onBack }: AskTravellersScreenProps) {
  const cityPackKey = useAppStore((s) => s.cityPackKey);
  const pack = CITY_PACKS[cityPackKey];
  const [draft, setDraft] = useState(pack.askDraft);
  const [anonymous, setAnonymous] = useState(true);
  const [includeArea, setIncludeArea] = useState(false);
  const toast = useToast();

  const handlePost = () => {
    onBack();
    toast.show('Posted. Answers will land in Nearby.');
  };

  return (
    <PushedScreen title="Ask the travellers" backLabel="Nearby" onBack={onBack}>
      <View style={styles.introRow}>
        <Image source={WOBY.fly} style={styles.introFace} />
        <Text style={styles.introText}>I'll carry this to travellers who've been where you are. Nobody sees who's asking.</Text>
      </View>

      <View style={styles.composer}>
        <TextInput
          style={styles.composerInput}
          value={draft}
          onChangeText={setDraft}
          placeholder="What would you like to ask?"
          placeholderTextColor={color.inkTertiary}
          multiline
        />
      </View>

      <View style={styles.chipRow}>
        {SUGGESTION_LABELS.map((label, index) => (
          <Pressable
            key={label}
            onPress={() => setDraft(pack.askSuggestions[index] ?? label)}
            accessibilityRole={'button' as AccessibilityRole}
            style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
          >
            <Text style={styles.chipLabel}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.optionsCard}>
        <View style={styles.optionRow}>
          <View style={styles.optionTextColumn}>
            <Text style={styles.optionLabel}>Ask anonymously</Text>
            <Text style={styles.optionNote}>No name, no photo, no history attached.</Text>
          </View>
          <Toggle on={anonymous} onToggle={() => setAnonymous((v) => !v)} accessibilityLabel="Ask anonymously" />
        </View>
        <View style={styles.separator} />
        <View style={styles.optionRow}>
          <View style={styles.optionTextColumn}>
            <Text style={styles.optionLabel}>Include the area</Text>
            <Text style={styles.optionNote}>Roughly {pack.area}.</Text>
          </View>
          <Toggle on={includeArea} onToggle={() => setIncludeArea((v) => !v)} accessibilityLabel="Include the area" />
        </View>
      </View>

      <Pressable
        onPress={handlePost}
        disabled={!draft.trim()}
        accessibilityRole={'button' as AccessibilityRole}
        style={({ pressed }) => [styles.postButton, pressed && draft.trim() && styles.postButtonPressed]}
      >
        <Text style={styles.postLabel}>Post the question</Text>
      </Pressable>
      <Text style={styles.caption}>It goes out when you're back online. Answers come back here, not to your phone number.</Text>

      <Toast message={toast.message} onDismiss={toast.hide} />
    </PushedScreen>
  );
}

const styles = StyleSheet.create({
  introRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  introFace: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  introText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  composer: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    padding: 16,
    minHeight: 66,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  composerInput: {
    fontSize: 17,
    lineHeight: 22,
    color: color.ink,
    padding: 0,
  },
  chipRow: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 19,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: 'rgba(113,171,203,.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipPressed: {
    backgroundColor: color.tintWash45,
  },
  chipLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: color.accent,
  },
  optionsCard: {
    marginTop: 24,
    backgroundColor: color.surface,
    borderRadius: radius.row,
    overflow: 'hidden',
  },
  separator: {
    height: 0.5,
    backgroundColor: color.hairline18,
    marginLeft: 16,
  },
  optionRow: {
    minHeight: touchTarget.min,
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  optionLabel: {
    fontSize: 17,
    lineHeight: 22,
    color: color.ink,
  },
  optionNote: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkSecondary,
  },
  postButton: {
    marginTop: 24,
    height: 50,
    borderRadius: radius.card,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonPressed: {
    backgroundColor: color.accentPressed,
  },
  postLabel: {
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
});
