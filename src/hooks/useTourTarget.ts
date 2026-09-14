import { useEffect, useRef } from 'react';
import { View } from 'react-native';

export type MeasuredRect = { x: number; y: number; width: number; height: number };

// A module-level registry so the tour overlay (mounted once, high in the tree) can measure
// arbitrary target elements deep in whichever tab screen is currently active, without threading
// refs through every layer. Screens register/unregister as they mount/unmount.
const registry = new Map<string, View>();

export function useTourTarget(key: string) {
  const ref = useRef<View>(null);

  useEffect(() => {
    return () => {
      if (registry.get(key) === ref.current) registry.delete(key);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (node: View | null) => {
    ref.current = node;
    if (node) registry.set(key, node);
    else registry.delete(key);
  };
}

export function measureTourTarget(key: string): Promise<MeasuredRect | null> {
  const node = registry.get(key);
  if (!node) return Promise.resolve(null);
  return new Promise((resolve) => {
    node.measureInWindow((x, y, width, height) => {
      if (!width || !height) resolve(null);
      else resolve({ x, y, width, height });
    });
  });
}
