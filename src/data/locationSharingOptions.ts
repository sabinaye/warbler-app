// Transcribed from the SHARE constant in design_handoff_warbler/Warbler v4.dc.html. The
// prototype's "2 hours" note hardcodes a fixed demo clock ("Sharing ends at 1:04am"); the real
// app computes that end time from the real now + 2h instead.
import { CityPack } from './cityPacks/types';

export type LocationShareKey = 'journey' | 'arrive' | 'hours' | 'none';

export type LocationShareOption = {
  key: LocationShareKey;
  label: string;
  short: string;
  note: (ctx: { pack: CityPack; now: Date }) => string;
};

function formatClockTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'pm' : 'am';
  const hour12 = ((hours + 11) % 12) + 1;
  return `${hour12}:${String(minutes).padStart(2, '0')}${period}`;
}

export const LOCATION_SHARE_OPTIONS: LocationShareOption[] = [
  {
    key: 'journey',
    label: 'Only during this journey',
    short: 'This journey',
    note: () => "Sharing ends on its own when you're back at your stay.",
  },
  {
    key: 'arrive',
    label: 'Until I arrive',
    short: 'Until arrival',
    note: ({ pack }) => `Sharing ends the moment you reach ${pack.stay}.`,
  },
  {
    key: 'hours',
    label: 'For the next 2 hours',
    short: '2 hours',
    note: ({ now }) => {
      const end = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      return `Sharing ends at ${formatClockTime(end)}. You can stop it sooner at any time.`;
    },
  },
  {
    key: 'none',
    label: 'Not right now',
    short: 'Off',
    note: () => 'Your location stays on this phone. Warbler never starts sharing on its own.',
  },
];
