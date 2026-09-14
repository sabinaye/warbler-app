// Transcribed from FALLBACK_DRAFT in design_handoff_warbler/Warbler v4.dc.html — the offline
// fallback for onboarding's "drafting the plan" step. There's no live drafting backend wired up,
// so this fallback is what every draft uses today (always marked as drafted-from-saved-content).
export type DraftDay = {
  day: string;
  title: string;
  note: string;
};

export type DraftPlan = {
  intro: string;
  days: DraftDay[];
};

export const FALLBACK_DRAFT: DraftPlan = {
  intro: "Here's a loose shape. Nothing booked, and you can move any of it.",
  days: [
    { day: 'Day 1-2', title: 'Land and do nothing', note: "Drop your bag, walk one street, eat whatever's closest." },
    { day: 'Day 3-4', title: 'The one thing you came for', note: 'Early, before it fills up, while you still have energy.' },
    { day: 'Day 5-6', title: 'A day trip, decided that morning', note: "I'll suggest one based on the weather and how you're feeling." },
    { day: 'Day 7-9', title: 'Slow and local', note: 'Nothing booked. This is usually the day people remember.' },
  ],
};

export const REDRAW_NOTES = [
  "If this doesn't feel like your trip, say so — I'd rather start again than talk you into it.",
  "Happy to keep going. Tell me what's wrong with it and I'll aim somewhere else.",
  "We can also skip this entirely — you don't need a plan from me to leave.",
];
