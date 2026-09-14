import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Battery from 'expo-battery';

/**
 * Real device battery percentage (0-100), or null until the first reading arrives (or forever,
 * on a platform/browser that doesn't expose one).
 *
 * expo-battery's web implementation has no `addBatteryLevelListener` at all — calling it throws
 * ("addListener is not a function"), which was crashing the whole Now tab on web the instant it
 * mounted. `getBatteryLevelAsync` is a one-off read, so we fall back to polling it on web instead
 * of subscribing.
 */
export function useBatteryLevel(): number | null {
  const [percent, setPercent] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const readOnce = () => {
      Battery.getBatteryLevelAsync().then((level) => {
        if (!cancelled && level >= 0) setPercent(Math.round(level * 100));
      });
    };

    readOnce();

    if (Platform.OS === 'web' || typeof Battery.addBatteryLevelListener !== 'function') {
      const interval = setInterval(readOnce, 60000);
      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }

    const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      if (!cancelled) setPercent(Math.round(batteryLevel * 100));
    });

    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  return percent;
}
