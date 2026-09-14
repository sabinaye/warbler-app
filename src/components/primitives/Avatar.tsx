import { StyleSheet, Text, View } from 'react-native';

import { color } from '../../theme/tokens';

type AvatarProps = {
  initial: string;
  backgroundColor: string;
  size?: number;
  fontSize?: number;
};

export function Avatar({ initial, backgroundColor, size = 32, fontSize = 15 }: AvatarProps) {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor }]}>
      <Text style={[styles.initial, { fontSize }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initial: {
    fontWeight: '600',
    color: color.ink,
  },
});
