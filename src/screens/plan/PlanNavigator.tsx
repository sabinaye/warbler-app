import { useState } from 'react';

import { PlanScreen } from './PlanScreen';
import { TripPrepScreen } from './TripPrepScreen';
import { TripDetailsScreen } from './TripDetailsScreen';
import { LookingBackScreen } from './LookingBackScreen';

type PlanRoute = 'prep' | 'details' | 'reflect';

export function PlanNavigator() {
  const [stack, setStack] = useState<PlanRoute[]>([]);
  const push = (route: PlanRoute) => setStack((s) => [...s, route]);
  const pop = () => setStack((s) => s.slice(0, -1));
  const current = stack[stack.length - 1];

  switch (current) {
    case 'prep':
      return <TripPrepScreen onBack={pop} />;
    case 'details':
      return <TripDetailsScreen onBack={pop} />;
    case 'reflect':
      return <LookingBackScreen onBack={pop} />;
    default:
      return (
        <PlanScreen
          onOpenTripDetails={() => push('details')}
          onOpenPrep={() => push('prep')}
          onOpenReflection={() => push('reflect')}
        />
      );
  }
}
