import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type IconTileProps = {
  backgroundColor: string;
  children: ReactNode;
  size?: number;
  radius?: number;
};

// The 32px rounded leading icon tile used throughout grouped-list rows.
export function IconTile({ backgroundColor, children, size = 32, radius = 8 }: IconTileProps) {
  return (
    <View style={[styles.tile, { width: size, height: size, borderRadius: radius, backgroundColor }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
