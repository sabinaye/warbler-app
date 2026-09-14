import { useCallback, useState } from 'react';

import { ConfirmAlertConfig } from '../components/primitives/ConfirmAlert';

export function useConfirmAlert() {
  const [config, setConfig] = useState<ConfirmAlertConfig | null>(null);

  const hide = useCallback(() => setConfig(null), []);

  // Wraps the caller's onConfirm so the alert always closes itself after the action fires.
  const show = useCallback((next: ConfirmAlertConfig) => {
    setConfig({
      ...next,
      onConfirm: () => {
        next.onConfirm();
        setConfig(null);
      },
    });
  }, []);

  return { config, show, hide };
}
