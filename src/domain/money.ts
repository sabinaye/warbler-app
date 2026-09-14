// The single source of truth for money maths, per design_handoff_warbler/README.md
// ("Money derivation. Trip length = dateEnd − dateStart + 1. Daily budget = budget / tripDays.
// Today's remaining = daily budget − scripted day spend − logged total, floored at 0. 'Tight
// today' below 25% remaining. The Now context pills read from the same values — never
// duplicate this maths in two places.")
//
// "Scripted day spend" in the prototype was fixture data (fake breakfast/day-pass/dinner
// percentages) to make demo screenshots look lived-in — the app has no real transaction feed,
// so in production the only spend it can ever observe is what the user tells it. There is no
// scripted-spend term here: today's remaining is the daily budget minus what's been logged
// today, full stop.

export type TripSetup = {
  /** ISO date, "yyyy-mm-dd". */
  startDate: string;
  /** ISO date, "yyyy-mm-dd". */
  endDate: string;
  budget: number;
};

export type LoggedSpend = {
  id: string;
  label: string;
  amount: number;
  /** ISO date, "yyyy-mm-dd", the calendar day this entry was logged on. */
  loggedAt: string;
};

export type MoneyDerivation = {
  tripDays: number;
  /** 1-based day of the trip "today" falls on, clamped to [1, tripDays]. */
  dayIndex: number;
  /** Days left of the trip, inclusive of today — pairs with tripDays for "N days left of M". */
  daysLeft: number;
  dailyBudget: number;
  loggedToday: LoggedSpend[];
  todayLoggedTotal: number;
  loggedTotal: number;
  todayRemaining: number;
  isTight: boolean;
  wholeTripRemaining: number;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const TIGHT_THRESHOLD = 0.25;

function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysBetween(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / MS_PER_DAY);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function deriveMoney(trip: TripSetup, logged: LoggedSpend[], now: Date = new Date()): MoneyDerivation {
  const start = parseISODate(trip.startDate);
  const end = parseISODate(trip.endDate);
  const tripDays = Math.max(1, daysBetween(start, end) + 1);

  const dayIndex = clamp(daysBetween(start, now) + 1, 1, tripDays);
  const daysLeft = tripDays - dayIndex + 1;

  const dailyBudget = Math.max(1, Math.round(trip.budget / tripDays));

  const todayISO = toISODate(now);
  const loggedToday = logged.filter((entry) => entry.loggedAt === todayISO);
  const todayLoggedTotal = loggedToday.reduce((sum, entry) => sum + entry.amount, 0);
  const loggedTotal = logged.reduce((sum, entry) => sum + entry.amount, 0);

  const todayRemaining = Math.max(0, dailyBudget - todayLoggedTotal);
  const isTight = todayRemaining < dailyBudget * TIGHT_THRESHOLD;
  const wholeTripRemaining = Math.max(0, trip.budget - loggedTotal);

  return {
    tripDays,
    dayIndex,
    daysLeft,
    dailyBudget,
    loggedToday,
    todayLoggedTotal,
    loggedTotal,
    todayRemaining,
    isTight,
    wholeTripRemaining,
  };
}

/**
 * "kr" reads as a word and wants a space ("kr 5,000"); single-glyph symbols (€ ¥ ₩) don't
 * ("€60", "¥10,000") — matches every cashAdvice string across the four authored city packs.
 */
export function formatMoney(amount: number, currencySymbol: string): string {
  const formattedNumber = Math.round(amount).toLocaleString('en-US');
  const isWordLikeSymbol = currencySymbol.length > 1;
  return isWordLikeSymbol ? `${currencySymbol} ${formattedNumber}` : `${currencySymbol}${formattedNumber}`;
}
