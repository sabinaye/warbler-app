import { WobyFace } from '../assets/woby';
import { TabKey } from '../components/primitives/TabBar';

export type TourAction = 'ask' | 'plan' | 'money' | 'nearby' | 'triage';

export type TourStep = {
  tab: TabKey;
  face: WobyFace;
  label: string;
  body: string;
  cta: string;
  act: TourAction;
  /** Key registered via useTourTarget on the element this step spotlights. */
  targetKey: string;
  spotNote: string;
};

// Transcribed from the TOUR constant in design_handoff_warbler/Warbler v4.dc.html.
export const TOUR_STEPS: TourStep[] = [
  {
    tab: 'now',
    face: 'hero',
    label: 'Right now',
    body: "Start here. Tell me what's happened in your own words and I'll come back with three things you could actually do.",
    cta: 'Try: I missed the last train',
    act: 'ask',
    targetKey: 'composer',
    spotNote: 'the message field',
  },
  {
    tab: 'plan',
    face: 'happy',
    label: 'Plan',
    body: "Tonight's shape, not a schedule. Anything I add shows up marked as mine, and you can drop it.",
    cta: 'How do I change it?',
    act: 'plan',
    targetKey: 'plan-first-item',
    spotNote: 'the first item tonight',
  },
  {
    tab: 'money',
    face: 'tired',
    label: 'Money',
    body: "What's left, today and for the trip. I never tell you off about it — I just keep the number visible.",
    cta: 'Show me the whole trip',
    act: 'money',
    targetKey: 'money-segment',
    spotNote: 'the day / trip switch',
  },
  {
    tab: 'nearby',
    face: 'love',
    label: 'Nearby',
    body: 'Answers from travellers who were here before you, saved to your phone. Ask anonymously if nothing fits.',
    cta: 'Open an answer',
    act: 'nearby',
    targetKey: 'nearby-first-answer',
    spotNote: 'a saved answer',
  },
  {
    tab: 'support',
    face: 'fly',
    label: 'Support',
    body: "If something goes properly wrong, this is the fastest route. I'll read the urgency, and you get the final say.",
    cta: 'Open the urgency check',
    act: 'triage',
    targetKey: 'support-urgency',
    spotNote: 'the urgency check',
  },
];
