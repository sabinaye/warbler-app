import { CityPack } from './types';
import { osaka } from './osaka';
import { lisbon } from './lisbon';
import { reykjavik } from './reykjavik';
import { seoul } from './seoul';

export * from './types';

export const CITY_PACKS = {
  osaka,
  lisbon,
  rvk: reykjavik,
  seoul,
} as const satisfies Record<string, CityPack>;

export type CityPackKey = keyof typeof CITY_PACKS;

// Onboarding's destination suggestions, in the order the prototype lists them.
export const CITY_OPTIONS = [osaka, lisbon, reykjavik, seoul].map((pack) => `${pack.city}, ${pack.country}`);

/**
 * Matches free-text destination input against each pack's regex, in CITY_PACKS order.
 * Unmatched input falls back to Osaka — this mirrors the prototype exactly
 * (`keys.find(k => CITY_PACKS[k].match.test(city)) || 'osaka'`), not a generic "default" pack.
 */
export function matchCityPack(destinationText: string): CityPack {
  const hit = (Object.values(CITY_PACKS) as CityPack[]).find((pack) => pack.match.test(destinationText));
  return hit ?? osaka;
}
