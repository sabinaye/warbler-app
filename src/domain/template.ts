import { CityPack } from '../data/cityPacks/types';

// Maps the %token% names used in copy (transcribed from the prototype's SCRIPTS/TRIAGE/SHARE
// data) to the CityPack field that fills them in.
const PACK_FIELD_MAP: Partial<Record<string, keyof CityPack>> = {
  city: 'city',
  stay: 'stay',
  bus: 'nightBus',
  shop: 'lateNightShop',
  pharm: 'pharmacy',
  pharmMeta: 'pharmacyMeta',
  pharmPhrase: 'pharmacyPhrase',
  copShop: 'policeEquivalent',
  copShopNote: 'policeNote',
  warmPlace: 'warmPlaceLine',
  daytrip: 'dayTrip',
  daytripMeta: 'dayTripMeta',
  sight: 'sight',
  treat: 'treat',
  backTime: 'backTime',
  clinicCost: 'clinicCost',
  plug: 'plugAdvice',
  phrase: 'helpPhrase',
  atm: 'atmAdvice',
  embassy: 'embassy',
  lastTrain: 'lastTrain',
};

export type TemplateContext = {
  pack: CityPack;
  /** First name of the trusted contact — fills %contact% (the prototype hardcodes "Priya" here). */
  contactFirst?: string;
};

/** Replaces %token% placeholders (e.g. "Sharing ends the moment you reach %stay%.") using ctx. */
export function fillTemplate(text: string, ctx: TemplateContext): string {
  return text.replace(/%(\w+)%/g, (match, token: string) => {
    if (token === 'contact') return ctx.contactFirst ?? match;
    if (token === 'emgList') {
      const nums = ctx.pack.emergencyNumbers.map((e) => e.num);
      return nums.join(' and ') + (nums.length > 1 ? ' — ambulance and police' : ' for everything');
    }
    const field = PACK_FIELD_MAP[token];
    if (!field) return match;
    const value = ctx.pack[field];
    return typeof value === 'string' ? value : match;
  });
}
