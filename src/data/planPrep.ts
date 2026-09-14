// Transcribed from the PACKING/BEFORE/DONE_BY_DEFAULT constants in
// design_handoff_warbler/Warbler v4.dc.html (the Trip prep pushed screen). %plug%/%city%/%emgList%
// tokens are filled via fillTemplate; %emgList% isn't a CityPack field (it's the prototype's own
// "119 ambulance..." join), so it's filled separately from pack.emergencyCaption.
export type PrepItem = {
  id: string;
  label: string;
  note: string;
};

export const PACKING: PrepItem[] = [
  { id: 'p1', label: 'Passport, plus a photo of it in your email', note: 'Takes thirty seconds and saves a very bad afternoon.' },
  { id: 'p2', label: 'Insurance policy number', note: "Written down somewhere that isn't the app that has it." },
  { id: 'p3', label: 'Plug adapter', note: '%plug%' },
  { id: 'p4', label: 'Power bank', note: 'Tonight is exactly why.' },
  { id: 'p5', label: 'Medication, in its box', note: 'Customs prefer the label to be on it.' },
  { id: 'p6', label: 'A card that works abroad, and some cash', note: 'Plenty of small places here are still cash only.' },
];

export const BEFORE_YOU_GO: PrepItem[] = [
  { id: 'b1', label: 'Tell %contact% your dates', note: 'They only need the outline, not the itinerary.' },
  { id: 'b2', label: 'Check whether you need a visa', note: 'UK passport, under 90 days — you do not.' },
  { id: 'b3', label: 'Download offline maps for %city%', note: 'Saved. This is what got you home tonight.' },
  { id: 'b4', label: 'Save the local emergency numbers', note: '%emgList%' },
  { id: 'b5', label: 'Set the emergency contact on your phone', note: 'Separate from Warbler — it works from the lock screen.' },
];

export const PREP_DONE_BY_DEFAULT: Record<string, boolean> = {
  p1: true, p2: true, p3: true, p5: true, p6: true,
  b1: true, b2: true, b3: true, b4: true,
};

export const ALL_PREP_ITEMS = [...PACKING, ...BEFORE_YOU_GO];
