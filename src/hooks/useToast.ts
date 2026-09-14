import { useCallback, useState } from 'react';

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  const show = useCallback((next: string) => setMessage(next), []);
  const hide = useCallback(() => setMessage(null), []);

  return { message, show, hide };
}
