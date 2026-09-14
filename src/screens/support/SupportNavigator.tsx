import { useEffect, useState } from 'react';

import { SupportScreen } from './SupportScreen';
import { TrustedContactScreen } from './TrustedContactScreen';
import { LocationSharingScreen } from './LocationSharingScreen';
import { WhatWarblerKnowsScreen } from './WhatWarblerKnowsScreen';
import { UrgencyCheckScreen } from './UrgencyCheckScreen';
import { YourDetailsScreen } from './YourDetailsScreen';
import { useAppStore } from '../../state/store';

// A real, proper navigation stack (not the prototype's flattened single `push` value, where
// "back" from any depth always jumped straight to the tab — that was a shortcut of the
// single-file demo, not a deliberate design decision, so back here always returns to the
// immediately previous screen). Will be swapped for a native-stack Navigator once all five tabs
// exist; the screens themselves won't need to change.
type SupportRoute = 'contact' | 'location' | 'data' | 'triage' | 'details';

export function SupportNavigator() {
  const [stack, setStack] = useState<SupportRoute[]>([]);
  const push = (route: SupportRoute) => setStack((s) => [...s, route]);
  const pop = () => setStack((s) => s.slice(0, -1));
  const pendingOpenTriage = useAppStore((s) => s.pendingSupportOpenTriage);
  const clearPendingSupportTriage = useAppStore((s) => s.clearPendingSupportTriage);

  // The guided tour's "Open the urgency check" try-it action pushes here from outside this navigator.
  useEffect(() => {
    if (pendingOpenTriage) {
      push('triage');
      clearPendingSupportTriage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingOpenTriage, clearPendingSupportTriage]);

  const current = stack[stack.length - 1];

  switch (current) {
    case 'contact':
      return <TrustedContactScreen onBack={pop} />;
    case 'location':
      return <LocationSharingScreen onBack={pop} />;
    case 'data':
      return <WhatWarblerKnowsScreen onBack={pop} />;
    case 'triage':
      return <UrgencyCheckScreen onBack={pop} onShowDetails={() => push('details')} />;
    case 'details':
      return <YourDetailsScreen onBack={pop} />;
    default:
      return <SupportScreen onNavigate={push} />;
  }
}
