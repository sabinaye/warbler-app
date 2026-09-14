import { Component, ReactNode } from 'react';
import { AccessibilityRole, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { WOBY } from '../assets/woby';
import { color, radius } from '../theme/tokens';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

// A crash anywhere below this leaves a friendly cream screen instead of the browser's default
// blank white page (React unmounts the tree on an uncaught render error with no boundary).
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Warbler crashed:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.root}>
          <Image source={WOBY.oops} style={styles.face} />
          <Text style={styles.title}>Something went wrong.</Text>
          <Text style={styles.body}>Nothing here is lost — closing and reopening Warbler should sort it.</Text>
          <Pressable
            onPress={() => this.setState({ hasError: false })}
            accessibilityRole={'button' as AccessibilityRole}
            style={styles.retryButton}
          >
            <Text style={styles.retryLabel}>Try again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  face: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 16,
    fontSize: 17,
    fontWeight: '600',
    color: color.ink,
  },
  body: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  retryButton: {
    marginTop: 24,
    height: 50,
    paddingHorizontal: 24,
    borderRadius: radius.card,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: color.surface,
  },
});
