// Transcribed from the TRIAGE constant in design_handoff_warbler/Warbler v4.dc.html (the
// urgency-check pushed screen). Labels/notes with %tokens% are run through fillTemplate with
// the matched city pack (and the trusted contact's first name for %contact%) before display.
import { color } from '../theme/tokens';

export type TriageKey = 'now' | 'soon' | 'minute';

export type TriageAction = {
  label: string;
  note: string;
  color: string;
};

export type TriageLevel = {
  key: TriageKey;
  label: string;
  dotColor: string;
  suggested: boolean;
  title: string;
  body: string;
  actions: TriageAction[];
};

export const TRIAGE_LEVELS: TriageLevel[] = [
  {
    key: 'now',
    label: 'Right now',
    dotColor: color.danger,
    suggested: false,
    title: 'Straight away',
    body: "Someone is hurt, or you feel in danger where you're standing.",
    actions: [
      {
        label: 'Show my details on screen',
        note: 'Insurance number, blood type, %contact% — readable by someone else.',
        color: color.ink,
      },
    ],
  },
  {
    key: 'soon',
    label: 'Soon, but not this second',
    dotColor: color.warning,
    suggested: true,
    title: 'Worth sorting tonight',
    body: 'Something has gone wrong and it needs dealing with, but you are safe where you are.',
    actions: [
      { label: 'Nearest 24-hour pharmacy', note: '%pharmMeta%. I have written down what to ask for.', color: color.ink },
      { label: 'Nearest %copShop%', note: '%copShopNote%', color: color.ink },
      { label: 'Call your insurance line', note: 'Open 24 hours. Policy number is saved on this phone.', color: color.ink },
    ],
  },
  {
    key: 'minute',
    label: 'I just need a minute',
    dotColor: color.accent,
    suggested: false,
    title: 'Somewhere to land',
    body: 'Nothing is broken. It has just been a lot, and you would like it to stop for a moment.',
    actions: [
      { label: 'Somewhere warm and open', note: '%warmPlace%', color: color.ink },
      { label: 'Breathe with me for a minute', note: 'Four in, six out. I will count.', color: color.ink },
      { label: 'Message %contact%', note: "I've drafted something low-key. You send it or you don't.", color: color.ink },
    ],
  },
];
