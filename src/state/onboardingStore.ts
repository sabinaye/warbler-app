// Transient state for the onboarding flow only — discarded once setup completes and the app
// store's real trip/city/contact fields take over. Nothing here persists.
import { create } from 'zustand';

import { DraftPlan, FALLBACK_DRAFT } from '../data/fallbackDraft';
import { NOTHING_MUCH_ANSWER } from '../data/interview';

export const ONBOARDING_STEPS = [
  'welcome',
  'trip',
  'interview',
  'budget',
  'drafting',
  'contact',
  'ready',
  'done',
] as const;
export type OnboardingStepName = (typeof ONBOARDING_STEPS)[number];

export type PermissionState = 'ask' | 'granted' | 'denied';

type OnboardingState = {
  step: number;
  destinationText: string;
  solo: boolean;
  dateStart: string | null;
  dateEnd: string | null;
  interviewIdx: number;
  interviewPicks: Record<string, string | string[]>;
  budget: number;
  draftLoading: boolean;
  draftPlan: DraftPlan | null;
  draftDegraded: boolean;
  redraws: number;
  droppedDays: Record<number, boolean>;
  locPerm: PermissionState;
  notifPerm: PermissionState;

  setDestinationText: (text: string) => void;
  toggleSolo: () => void;
  setDates: (start: string, end: string) => void;
  selectInterviewAnswer: (label: string) => void;
  setBudget: (amount: number) => void;
  startDrafting: () => void;
  redraw: () => void;
  dropDay: (index: number) => void;
  setLocPerm: (state: PermissionState) => void;
  setNotifPerm: (state: PermissionState) => void;
  goNext: () => void;
  goBack: () => void;
  skip: () => void;
  reset: () => void;
};

const initialState = {
  step: 0,
  destinationText: '',
  solo: true,
  dateStart: null as string | null,
  dateEnd: null as string | null,
  interviewIdx: 0,
  interviewPicks: {} as Record<string, string | string[]>,
  budget: 580,
  draftLoading: false,
  draftPlan: null as DraftPlan | null,
  draftDegraded: false,
  redraws: 0,
  droppedDays: {} as Record<number, boolean>,
  locPerm: 'ask' as PermissionState,
  notifPerm: 'ask' as PermissionState,
};

const DRAFT_DELAY_MS = 2200;

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,

  setDestinationText: (text) => set({ destinationText: text }),

  toggleSolo: () => set((s) => ({ solo: !s.solo })),

  setDates: (start, end) => set({ dateStart: start, dateEnd: end }),

  selectInterviewAnswer: (label) => {
    const { interviewIdx, interviewPicks } = get();
    const questionId = ['shape', 'worry', 'want'][interviewIdx];
    const isMulti = interviewIdx === 1;
    if (!isMulti) {
      set({ interviewPicks: { ...interviewPicks, [questionId]: label } });
      return;
    }
    const prev = interviewPicks[questionId];
    const arr = Array.isArray(prev) ? [...prev] : [];
    if (label === NOTHING_MUCH_ANSWER) {
      set({ interviewPicks: { ...interviewPicks, [questionId]: arr.includes(NOTHING_MUCH_ANSWER) ? [] : [NOTHING_MUCH_ANSWER] } });
      return;
    }
    const cleaned = arr.filter((x) => x !== NOTHING_MUCH_ANSWER);
    const at = cleaned.indexOf(label);
    if (at >= 0) cleaned.splice(at, 1);
    else cleaned.push(label);
    set({ interviewPicks: { ...interviewPicks, [questionId]: cleaned } });
  },

  setBudget: (amount) => set({ budget: amount }),

  startDrafting: () => {
    set({ draftLoading: true, draftPlan: null, draftDegraded: false });
    setTimeout(() => {
      set({ draftLoading: false, draftPlan: FALLBACK_DRAFT, draftDegraded: true });
    }, DRAFT_DELAY_MS);
  },

  redraw: () => {
    const redraws = get().redraws + 1;
    set({ draftLoading: true, draftPlan: null, draftDegraded: false, redraws, droppedDays: {} });
    setTimeout(() => {
      set({
        draftLoading: false,
        draftDegraded: true,
        draftPlan: { intro: FALLBACK_DRAFT.intro, days: [...FALLBACK_DRAFT.days].reverse() },
      });
    }, DRAFT_DELAY_MS);
  },

  dropDay: (index) => set((s) => ({ droppedDays: { ...s.droppedDays, [index]: true } })),

  setLocPerm: (state) => set({ locPerm: state }),

  setNotifPerm: (state) => set({ notifPerm: state }),

  goNext: () => {
    const { step, interviewIdx } = get();
    if (ONBOARDING_STEPS[step] === 'interview' && interviewIdx < 2) {
      set({ interviewIdx: interviewIdx + 1 });
      return;
    }
    set({ step: Math.min(ONBOARDING_STEPS.length - 1, step + 1) });
  },

  goBack: () => {
    const { step, interviewIdx } = get();
    if (ONBOARDING_STEPS[step] === 'interview' && interviewIdx > 0) {
      set({ interviewIdx: interviewIdx - 1 });
      return;
    }
    if (step > 0) set({ step: step - 1 });
  },

  skip: () => get().goNext(),

  reset: () => set(initialState),
}));
