import { useEffect, useRef } from 'react';
import { Dimensions, View } from 'react-native';

export type MeasuredRect = { x: number; y: number; width: number; height: number };
export type CanvasSize = { width: number; height: number };

// A module-level registry so the tour overlay (mounted once, high in the tree) can measure
// arbitrary target elements deep in whichever tab screen is currently active, without threading
// refs through every layer. Screens register/unregister as they mount/unmount.
const registry = new Map<string, View>();

// On the desktop web preview, WebPhoneFrame renders the whole app at a fixed 393x852 logical
// size and then CSS-scales that box to fit the browser window. `measureInWindow` reports real,
// post-scale screen pixels (and the frame's offset within the page) — a different coordinate
// space than the 393x852 box the tour overlay draws its spotlight mask in. Measuring relative to
// the frame's own root node instead gives pre-scale logical coordinates that match, since CSS
// transforms affect painting, not layout. Native (and un-framed/mobile web) never sets this, so
// measurement there falls back to plain window coordinates, which are already correct.
let frameRoot: View | null = null;
let frameCanvasSize: CanvasSize | null = null;

export function setTourFrame(node: View | null, canvasSize: CanvasSize | null) {
  frameRoot = node;
  frameCanvasSize = canvasSize;
}

export function getTourCanvasSize(): CanvasSize {
  return frameCanvasSize ?? Dimensions.get('window');
}

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
    const onMeasured = (x: number, y: number, width: number, height: number) => {
      if (!width || !height) resolve(null);
      else resolve({ x, y, width, height });
    };
    if (frameRoot) {
      node.measureLayout(frameRoot, onMeasured, () => resolve(null));
    } else {
      node.measureInWindow(onMeasured);
    }
  });
}
