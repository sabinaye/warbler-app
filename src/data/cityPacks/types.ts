// Transcribed from the CITY_PACKS object in design_handoff_warbler/Warbler v4.dc.html
// (the README names the categories of city-keyed content; the actual copy lives only in the
// prototype's data, not the README). Every downstream screen reads from a CityPack — never
// branch on the city name in a component.

export type EmergencyNumber = {
  num: string;
  note: string;
};

export type AnswerCategory = 'safety' | 'logistics' | 'payments' | 'practical';

export type AnswerReply = {
  who: string;
  when: string;
  text: string;
};

export type Answer = {
  id: string;
  cat: AnswerCategory;
  question: string;
  shortAnswer: string;
  agreeCount: string;
  freshness: string;
  replies: AnswerReply[];
};

export type GuidePoint = {
  heading: string;
  body: string;
};

export type Guide = {
  id: string;
  title: string;
  subtitle: string;
  intro: string;
  points: GuidePoint[];
};

export type CityPack = {
  key: string;
  /** Regex the free-text destination is matched against (see cityPacks/index.ts). */
  match: RegExp;
  city: string;
  country: string;
  area: string;
  area2: string;
  stay: string;
  currencySymbol: string;
  /** Recommended cash-on-hand amount, already formatted with the currency symbol, e.g. "¥10,000". */
  cashAdvice: string;
  transitCard: string;
  nightBus: string;
  nightBusShort: string;
  lateNightShop: string;
  warmPlaceLine: string;
  pharmacy: string;
  pharmacyMeta: string;
  pharmacyPhrase: string;
  policeEquivalent: string;
  policeNote: string;
  dayTrip: string;
  dayTripMeta: string;
  sight: string;
  treat: string;
  helpPhrase: string;
  plugAdvice: string;
  embassy: string;
  atmAdvice: string;
  clinicCost: string;
  lastTrain: string;
  backTime: string;
  emergencyNumbers: EmergencyNumber[];
  emergencyCaption: string;
  askDraft: string;
  askSuggestions: string[];
  answers: Answer[];
  guides: Guide[];
};
