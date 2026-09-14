// Transcribed from the SCRIPTS/FALLBACK constants in design_handoff_warbler/Warbler v4.dc.html —
// the offline-fallback reply table (README: "keep the scripted table as the offline fallback...
// that behaviour is a product feature, not a stub"). %tokens% are filled via fillTemplate.
import { WobyFace } from '../assets/woby';

export type ScriptOption = {
  title: string;
  price: string;
  meta: string;
  why: string;
  primary: boolean;
};

export type ScriptFollow = {
  face: WobyFace;
  text: string;
};

export type ScriptEntry = {
  match: RegExp;
  face: WobyFace;
  text: string;
  options: ScriptOption[];
  follow: ScriptFollow | null;
};

export const SCRIPTS: ScriptEntry[] = [
  {
    match: /train|metro|subway|missed|stranded|stuck|last one|home/i,
    face: 'hero',
    text: "You've got options — here are three good ways back tonight.",
    options: [
      {
        title: '%bus%',
        price: '€3',
        meta: '52 min · leaves 11:58',
        why: "The stop is 200 m behind you at Exit 4, and you'd be in by %backTime%.",
        primary: false,
      },
      {
        title: 'Split a taxi',
        price: '€14',
        meta: '22 min · rank is 2 min away',
        why: 'A couple of people from your hostel are in that queue now, if you fancy the company.',
        primary: true,
      },
      {
        title: 'Capsule by the station',
        price: '€28',
        meta: '4 min walk · charger at the desk',
        why: "A proper bed and a full battery by morning, if you'd rather not wait around.",
        primary: false,
      },
    ],
    follow: { face: 'hero', text: 'Either way, the %shop% on this corner has a charger — worth a top-up while you decide.' },
  },
  {
    match: /budget|money|broke|overspen|expensive|spent|cash/i,
    face: 'hero',
    text: "Let's see where things stand and find a few easy ways to even it out.",
    options: [
      {
        title: 'Two %shop% nights',
        price: 'saves €48',
        meta: 'Thursday and Saturday',
        why: "You've enjoyed these before, and they free up room for the rest of the week.",
        primary: true,
      },
      {
        title: '%daytrip% as a day trip',
        price: 'saves €90',
        meta: '%daytripMeta%',
        why: 'You keep the sights and skip one night of accommodation.',
        primary: false,
      },
      {
        title: 'Keep the %treat%',
        price: '€110',
        meta: 'later this trip',
        why: "You've been looking forward to this one — happy to protect it.",
        primary: false,
      },
    ],
    follow: null,
  },
  {
    match: /tired|exhaust|sleep|drained|overwhelm|too much|burn|energy/i,
    face: 'love',
    text: "Tomorrow's looking full. Here are some ways to make it feel lighter.",
    options: [
      {
        title: 'Move %sight% to another day',
        price: 'free',
        meta: 'same early light',
        why: 'Mornings are quieter there, and tonight you get a proper sleep.',
        primary: true,
      },
      {
        title: 'Keep it all, start later',
        price: 'free',
        meta: 'breakfast pushed back',
        why: 'Still very doable — just a gentler start to the morning.',
        primary: false,
      },
      {
        title: 'Leave tomorrow open',
        price: 'free',
        meta: 'nothing booked',
        why: 'Rest days often turn out to be the ones people remember most.',
        primary: false,
      },
    ],
    follow: null,
  },
  {
    match: /sick|ill|hurt|pain|fever|pharmac|hospital|doctor|not feeling/i,
    face: 'love',
    text: "Let's get you sorted. There's a pharmacy close by, and I've written out what to ask for.",
    options: [
      {
        title: '%pharm%',
        price: '—',
        meta: '%pharmMeta%',
        why: 'Show them this: %pharmPhrase%',
        primary: true,
      },
      {
        title: 'English-speaking clinic',
        price: '%clinicCost%',
        meta: 'opens 9am',
        why: "Covered by your insurance — I've got the policy number ready.",
        primary: false,
      },
      {
        title: 'Send %contact% a quick note',
        price: '—',
        meta: 'one message, no fuss',
        why: '"Bit under the weather, resting up, will message tomorrow."',
        primary: false,
      },
    ],
    follow: null,
  },
];

export const FALLBACK_SCRIPT: Omit<ScriptEntry, 'match'> = {
  face: 'hero',
  text: "Happy to help with this. Here's where I'd start.",
  options: [
    { title: 'Sort it now', price: '—', meta: 'about 10 min', why: "A small first step tonight, so it's off your mind.", primary: true },
    { title: 'Come back to it in the morning', price: '—', meta: "I'll remind you at 9", why: 'Nothing here changes overnight, and a fresh start often helps.', primary: false },
    { title: 'Tell me a bit more', price: '—', meta: 'two quick questions', why: 'Happy to ask rather than guess — this one sounds like it matters to you.', primary: false },
  ],
  follow: null,
};

export function matchScript(text: string): Omit<ScriptEntry, 'match'> {
  return SCRIPTS.find((s) => s.match.test(text)) ?? FALLBACK_SCRIPT;
}
