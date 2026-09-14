import { useEffect, useState } from 'react';

import { NearbyScreen } from './NearbyScreen';
import { AnswerDetailScreen } from './AnswerDetailScreen';
import { GuideDetailScreen } from './GuideDetailScreen';
import { AskTravellersScreen } from './AskTravellersScreen';
import { useAppStore } from '../../state/store';

type NearbyRoute =
  | { type: 'answer'; id: string }
  | { type: 'guide'; id: string }
  | { type: 'ask' };

export function NearbyNavigator() {
  const [stack, setStack] = useState<NearbyRoute[]>([]);
  const pendingAnswerId = useAppStore((s) => s.pendingNearbyAnswerId);
  const clearPendingNearbyAnswer = useAppStore((s) => s.clearPendingNearbyAnswer);
  const pop = () => setStack((s) => s.slice(0, -1));
  const current = stack[stack.length - 1];

  // The guided tour's "Open an answer" try-it action pushes here from outside this navigator.
  useEffect(() => {
    if (pendingAnswerId) {
      setStack((s) => [...s, { type: 'answer', id: pendingAnswerId }]);
      clearPendingNearbyAnswer();
    }
  }, [pendingAnswerId, clearPendingNearbyAnswer]);

  if (current?.type === 'answer') {
    return <AnswerDetailScreen answerId={current.id} onBack={pop} />;
  }
  if (current?.type === 'guide') {
    return <GuideDetailScreen guideId={current.id} onBack={pop} />;
  }
  if (current?.type === 'ask') {
    return <AskTravellersScreen onBack={pop} />;
  }

  return (
    <NearbyScreen
      onOpenAnswer={(id) => setStack((s) => [...s, { type: 'answer', id }])}
      onOpenGuide={(id) => setStack((s) => [...s, { type: 'guide', id }])}
      onOpenAsk={() => setStack((s) => [...s, { type: 'ask' }])}
    />
  );
}
