import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';

import { color, spacing } from '../../theme/tokens';
import { HEADER_TO_CONTENT_GAP, PushedScreenHeader, usePushedHeaderHeight } from './PushedScreenHeader';

type PushedScreenProps = {
  title: string;
  backLabel: string;
  onBack: () => void;
  children: ReactNode;
  contentContainerStyle?: ViewStyle;
  scroll?: boolean;
};

// The chrome shared by all ten pushed detail screens: labelled-back header + content
// that scrolls under it, starting HEADER_TO_CONTENT_GAP below the header's bottom edge.
export function PushedScreen({
  title,
  backLabel,
  onBack,
  children,
  contentContainerStyle,
  scroll = true,
}: PushedScreenProps) {
  const headerHeight = usePushedHeaderHeight();
  const contentTop = headerHeight + HEADER_TO_CONTENT_GAP;
  const paddingStyle = [
    { paddingTop: contentTop, paddingHorizontal: spacing.screenGutter, paddingBottom: 40 },
    contentContainerStyle,
  ];

  return (
    <View style={styles.root}>
      {scroll ? (
        <ScrollView style={styles.root} contentContainerStyle={paddingStyle}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.root, paddingStyle]}>{children}</View>
      )}
      <PushedScreenHeader title={title} backLabel={backLabel} onBack={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.canvas,
  },
});
