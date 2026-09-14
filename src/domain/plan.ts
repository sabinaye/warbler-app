import { color } from '../theme/tokens';

// Status vocabulary transcribed from the prototype's STATUS map (Plan tab). "missed" is only
// ever produced by a real missed-train flow via the assistant — nothing here fabricates one for
// a fresh trip.
export type PlanItemStatus = 'missed' | 'booked' | 'open' | 'track';

export const PLAN_STATUS: Record<PlanItemStatus, { label: string; ink: string; background: string }> = {
  missed: { label: 'Missed', ink: color.warningInk, background: color.warningWash14 },
  booked: { label: 'Booked', ink: color.success, background: color.successWash14 },
  open: { label: 'Open', ink: color.inkSecondary, background: 'rgba(95,118,131,.12)' },
  track: { label: 'On track', ink: color.success, background: color.successWash14 },
};

export type PlanItem = {
  id: string;
  time: string;
  duration: string;
  title: string;
  subtitle: string;
  byWoby: boolean;
  status: PlanItemStatus;
};
