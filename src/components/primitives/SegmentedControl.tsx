import { AccessibilityRole, Pressable, StyleSheet, Text, View } from 'react-native';

import { color } from '../../theme/tokens';
import { shadowStyle } from '../../theme/shadow';

type Segment<T extends string> = {
  key: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({ segments, value, onChange }: SegmentedControlProps<T>) {
  return (
    <View style={styles.track}>
      {segments.map((segment) => {
        const active = segment.key === value;
        return (
          <Pressable
            key={segment.key}
            onPress={() => onChange(segment.key)}
            accessibilityRole={'button' as AccessibilityRole}
            accessibilityState={{ selected: active }}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={styles.label}>{segment.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 32,
    borderRadius: 9,
    backgroundColor: 'rgba(22,50,63,.07)',
    padding: 2,
    flexDirection: 'row',
    gap: 2,
  },
  segment: {
    flex: 1,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: color.surface,
    ...shadowStyle({ offsetX: 0, offsetY: 2, blur: 6, color: 'rgba(22,50,63,.14)' }),
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: color.ink,
  },
});
