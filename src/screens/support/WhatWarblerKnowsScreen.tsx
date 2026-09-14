import { AccessibilityRole, Pressable, StyleSheet, Text } from 'react-native';

import { GroupedList, GroupedRow } from '../../components/primitives/GroupedList';
import { PushedScreen } from '../../components/primitives/PushedScreen';
import { Toggle } from '../../components/primitives/Toggle';
import { ConfirmAlert } from '../../components/primitives/ConfirmAlert';
import { Toast } from '../../components/primitives/Toast';
import { useConfirmAlert } from '../../hooks/useConfirmAlert';
import { useToast } from '../../hooks/useToast';
import { color, radius } from '../../theme/tokens';
import { useAppStore } from '../../state/store';
import { DATA_SOURCES } from '../../data/dataSources';

type WhatWarblerKnowsScreenProps = {
  onBack: () => void;
};

export function WhatWarblerKnowsScreen({ onBack }: WhatWarblerKnowsScreenProps) {
  const dataSourceFlags = useAppStore((s) => s.dataSourceFlags);
  const toggleDataSource = useAppStore((s) => s.toggleDataSource);
  const resetEverything = useAppStore((s) => s.resetEverything);
  const alert = useConfirmAlert();
  const toast = useToast();

  return (
    <PushedScreen title="What Warbler knows" backLabel="Support" onBack={onBack}>
      <Text style={styles.intro}>Everything below is stored on this phone. Turn off anything you'd rather I didn't use.</Text>

      <GroupedList>
        {DATA_SOURCES.map((source) => (
          <GroupedRow key={source.key} label={source.label} sublabel={source.detail} disclosure={false}>
            <Toggle
              on={dataSourceFlags[source.key]}
              onToggle={() => toggleDataSource(source.key)}
              accessibilityLabel={source.label}
            />
          </GroupedRow>
        ))}
      </GroupedList>

      <Pressable
        onPress={() =>
          alert.show({
            title: 'Delete everything?',
            body: 'Your trip, plan and spending are removed from this phone. This cannot be undone.',
            confirmLabel: 'Delete',
            destructive: true,
            onConfirm: () => {
              resetEverything();
              onBack();
              toast.show('Deleted. Warbler is back to knowing nothing.');
            },
          })
        }
        accessibilityRole={'button' as AccessibilityRole}
        style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
      >
        <Text style={styles.deleteLabel}>Delete everything Warbler knows</Text>
      </Pressable>

      <ConfirmAlert config={alert.config} onCancel={alert.hide} />
      <Toast message={toast.message} onDismiss={toast.hide} />
    </PushedScreen>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
    marginHorizontal: 4,
    marginBottom: 16,
  },
  deleteButton: {
    marginTop: 24,
    minHeight: 50,
    borderRadius: radius.card,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonPressed: {
    backgroundColor: 'rgba(217,43,31,.06)',
  },
  deleteLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: color.danger,
  },
});
