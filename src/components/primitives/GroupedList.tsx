import { Children, cloneElement, isValidElement, ReactElement, ReactNode } from 'react';
import { AccessibilityRole, Pressable, StyleSheet, Text, View } from 'react-native';

import { color, radius, touchTarget } from '../../theme/tokens';
import { shadowStyle } from '../../theme/shadow';
import { DisclosureIcon } from '../icons/icons';

export function GroupedList({ children }: { children: ReactNode }) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<GroupedRowProps>[];
  return (
    <View style={styles.card}>
      {items.map((child, i) => cloneElement(child, { key: i, isLast: i === items.length - 1 }))}
    </View>
  );
}

type GroupedRowProps = {
  label: string;
  sublabel?: string;
  value?: string;
  valueColor?: string;
  leading?: ReactNode;
  disclosure?: boolean;
  onPress?: () => void;
  accessibilityHint?: string;
  isLast?: boolean;
  /** Trailing control (e.g. a Toggle) in place of the value text + disclosure chevron. */
  children?: ReactNode;
};

export function GroupedRow({
  label,
  sublabel,
  value,
  valueColor,
  leading,
  disclosure = true,
  onPress,
  accessibilityHint,
  isLast,
  children,
}: GroupedRowProps) {
  const separatorInset = leading ? 60 : 16;
  const content = (
    <View style={styles.row}>
      {leading}
      <View style={styles.labelColumn}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
      </View>
      {children ? (
        children
      ) : (
        <>
          {value ? (
            <Text style={[styles.value, valueColor ? { color: valueColor } : null]} numberOfLines={1}>
              {value}
            </Text>
          ) : null}
          {disclosure && onPress ? <DisclosureIcon /> : null}
        </>
      )}
    </View>
  );

  return (
    <View>
      {onPress ? (
        <Pressable
          onPress={onPress}
          accessibilityRole={'button' as AccessibilityRole}
          accessibilityLabel={label}
          accessibilityHint={accessibilityHint}
          style={({ pressed }) => (pressed ? styles.rowPressed : null)}
        >
          {content}
        </Pressable>
      ) : (
        content
      )}
      {!isLast ? <View style={[styles.separator, { marginLeft: separatorInset }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.row,
    overflow: 'hidden',
    ...shadowStyle({ offsetX: 0, offsetY: 1, blur: 2, color: 'rgba(22,50,63,.07)' }),
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
  labelColumn: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 17,
    lineHeight: 22,
    color: color.ink,
  },
  sublabel: {
    fontSize: 13,
    lineHeight: 18,
    color: color.inkSecondary,
    marginTop: 2,
  },
  value: {
    fontSize: 17,
    color: color.inkTertiary,
  },
  separator: {
    height: 0.5,
    backgroundColor: color.hairline18,
  },
});
