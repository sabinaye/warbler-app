import { useEffect, useState } from 'react';
import * as Battery from 'expo-battery';

/** Real device battery percentage (0-100), or null until the first reading arrives. */
export function useBatteryLevel(): number | null {
  const [percent, setPercent] = useState<number | null>(null);

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;

    Battery.getBatteryLevelAsync().then((level) => {
      if (level >= 0) setPercent(Math.round(level * 100));
    });

    subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setPercent(Math.round(batteryLevel * 100));
    });

    return () => subscription?.remove();
  }, []);

  return percent;
}
