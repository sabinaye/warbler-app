import { AccessibilityRole, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color } from '../../theme/tokens';
import { MoneyIcon, NearbyIcon, NowIcon, PlanIcon, SupportIcon } from '../icons/icons';
import { useTourTarget } from '../../hooks/useTourTarget';

export const TAB_CONTROL_ROW_HEIGHT = 49;

export type TabKey = 'now' | 'plan' | 'nearby' | 'money' | 'support';

const TABS: { key: TabKey; label: string; Icon: typeof NowIcon }[] = [
  { key: 'now', label: 'Now', Icon: NowIcon },
  { key: 'plan', label: 'Plan', Icon: PlanIcon },
  { key: 'nearby', label: 'Nearby', Icon: NearbyIcon },
  { key: 'money', label: 'Money', Icon: MoneyIcon },
  { key: 'support', label: 'Support', Icon: SupportIcon },
];

type TabBarProps = {
  activeKey: TabKey;
  onSelect: (key: TabKey) => void;
};

export function TabBar({ activeKey, onSelect }: TabBarProps) {
  const insets = useSafeAreaInsets();

  // One useTourTarget call per fixed tab key (can't call hooks inside .map with a dynamic count).
  const targetRefs: Record<TabKey, (node: View | null) => void> = {
    now: useTourTarget('tab-now'),
    plan: useTourTarget('tab-plan'),
    nearby: useTourTarget('tab-nearby'),
    money: useTourTarget('tab-money'),
    support: useTourTarget('tab-support'),
  };

  return (
    <View style={[styles.container, { height: TAB_CONTROL_ROW_HEIGHT + insets.bottom }]}>
      <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.tint]} />
      <View style={styles.row}>
        {TABS.map(({ key, label, Icon }) => {
          const active = key === activeKey;
          const tintColor = active ? color.accent : color.inkTertiary;
          return (
            <View key={key} ref={targetRefs[key]} style={styles.tabWrap}>
              <Pressable
                onPress={() => onSelect(key)}
                accessibilityRole={'tab' as AccessibilityRole}
                accessibilityLabel={label}
                accessibilityState={{ selected: active }}
                style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
              >
                <Icon size={26} color={tintColor} />
                <Text style={[styles.label, { color: tintColor }]}>{label}</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 40,
    borderTopWidth: 0.5,
    borderTopColor: color.hairline16,
    overflow: 'hidden',
  },
  tint: {
    backgroundColor: color.canvasTranslucent86,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  tabWrap: {
    flex: 1,
  },
  tab: {
    flex: 1,
    minHeight: TAB_CONTROL_ROW_HEIGHT,
    paddingTop: 7,
    alignItems: 'center',
    gap: 2,
  },
  tabPressed: {
    opacity: 0.5,
  },
  label: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '500',
  },
});
