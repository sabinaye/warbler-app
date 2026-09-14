// The app's single Zustand store (per README's "State" section: Setup and the tour-seen flag
// persist to device storage via ../state/persistence; everything else here is session-only).
import { create } from 'zustand';
import NetInfo from '@react-native-community/netinfo';

import { Contact, DEFAULT_CONTACTS, contactFirstName, NO_CONTACT } from '../data/contacts';
import { DataSourceKey, DATA_SOURCES } from '../data/dataSources';
import { LocationShareKey } from '../data/locationSharingOptions';
import { CITY_PACKS, CityPackKey, matchCityPack } from '../data/cityPacks';
import { deriveMoney, LoggedSpend, TripSetup, formatMoney } from '../domain/money';
import { PlanItem } from '../domain/plan';
import { ALL_PREP_ITEMS, PREP_DONE_BY_DEFAULT } from '../data/planPrep';
import { ConversationMessage, MessageOption } from '../domain/conversation';
import { parseSpend } from '../domain/spendParser';
import { matchScript } from '../data/scripts';
import { fillTemplate } from '../domain/template';
import { clearSetup, loadSetup, saveSetup } from './persistence';
import { useTourStore } from './tourStore';

let offlineDownloadTimer: ReturnType<typeof setInterval> | null = null;

const SPEND_REPLY_DELAY_MS = 750;
const SCRIPTED_REPLY_DELAY_MS = 1000;
const FOLLOW_UP_DELAY_MS = 1400;
const DOWNLOAD_STEP_PERCENT = 9;
const DOWNLOAD_INTERVAL_MS = 130;

function nextId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
}

function stopOfflineDownload() {
  if (offlineDownloadTimer) {
    clearInterval(offlineDownloadTimer);
    offlineDownloadTimer = null;
  }
}

function runOfflineDownload(set: (partial: Partial<AppState>) => void, get: () => AppState) {
  stopOfflineDownload();
  offlineDownloadTimer = setInterval(() => {
    const nextProgress = Math.min(100, get().offlineProgress + DOWNLOAD_STEP_PERCENT);
    set({ offlineProgress: nextProgress });
    if (nextProgress >= 100) stopOfflineDownload();
  }, DOWNLOAD_INTERVAL_MS);
}

// TODO: real values come from onboarding (not built yet). ¥88,000 over 14–23 Mar is a
// placeholder scaled to Osaka prices (the prototype's own default city) — not the README's
// "€880" Money-tab example, which is illustrative prose, not literal to any one authored city.
const PLACEHOLDER_TRIP: TripSetup = {
  startDate: '2026-03-14',
  endDate: '2026-03-23',
  budget: 88000,
};

type AppState = {
  contactId: string;
  customContacts: Contact[];
  locationShare: LocationShareKey;
  dataSourceFlags: Record<DataSourceKey, boolean>;
  offlineEnabled: boolean;
  offlineProgress: number;
  tourSeen: boolean;
  /** Timestamp (ms) of the last "Tell [contact] I'm okay" send, or null if never sent. */
  lastToldAt: number | null;
  trip: TripSetup;
  cityPackKey: CityPackKey;
  logged: LoggedSpend[];
  /** Pre-fill for the Now composer — set by "Log a spend" on Money, consumed once Now focuses it. */
  draftMessage: string;
  /** Assistant/user-added items beyond the always-present "back at accommodation" baseline. */
  extraPlanItems: PlanItem[];
  removedPlanItemIds: string[];
  prepChecked: Record<string, boolean>;
  reflectStep: number;
  reflectPicks: Record<number, number>;
  msgs: ConversationMessage[];
  thinking: boolean;
  offlineNotice: boolean;
  lastAsk: string;
  /** null while hydrating from storage at boot; then true (setup found) or false (needs onboarding). */
  setupComplete: boolean | null;
  moneySegment: 'today' | 'trip';
  /** Cross-navigator tour triggers: set by the tour, consumed and cleared by the target navigator. */
  pendingNearbyAnswerId: string | null;
  pendingSupportOpenTriage: boolean;

  setContact: (id: string) => void;
  addCustomContact: (contact: Contact) => void;
  setLocationShare: (key: LocationShareKey) => void;
  toggleDataSource: (key: DataSourceKey) => void;
  toggleOffline: () => void;
  restartOfflineDownload: () => void;
  replayTour: () => void;
  markToldNow: () => void;
  setTrip: (trip: Partial<TripSetup>) => void;
  setDestinationFromText: (text: string) => void;
  addLoggedSpend: (label: string, amount: number) => void;
  setDraftMessage: (text: string) => void;
  removePlanItem: (id: string) => void;
  addPlanItem: (item: PlanItem) => void;
  togglePrepItem: (id: string) => void;
  answerReflection: (step: number, answerIndex: number) => void;
  skipReflection: () => void;
  restartReflection: () => void;
  sendMessage: (text: string) => Promise<void>;
  retryLastMessage: () => void;
  confirmOption: (option: MessageOption) => void;
  seedAmbientNudge: () => void;
  hydrate: () => Promise<void>;
  completeSetup: (setup: { cityPackKey: CityPackKey; trip: TripSetup; contactId: string }) => Promise<void>;
  setMoneySegment: (segment: 'today' | 'trip') => void;
  requestNearbyAnswer: (id: string) => void;
  clearPendingNearbyAnswer: () => void;
  requestSupportTriage: () => void;
  clearPendingSupportTriage: () => void;
  markTourSeen: () => void;
  resetEverything: () => void;
};

const initialDataSourceFlags: Record<DataSourceKey, boolean> = DATA_SOURCES.reduce(
  (flags, source) => ({ ...flags, [source.key]: true }),
  {} as Record<DataSourceKey, boolean>,
);

const initialPrepChecked: Record<string, boolean> = ALL_PREP_ITEMS.reduce(
  (flags, item) => ({ ...flags, [item.id]: !!PREP_DONE_BY_DEFAULT[item.id] }),
  {} as Record<string, boolean>,
);

export const useAppStore = create<AppState>((set, get) => ({
  contactId: DEFAULT_CONTACTS[0].id,
  customContacts: [],
  locationShare: 'none',
  dataSourceFlags: initialDataSourceFlags,
  offlineEnabled: true,
  offlineProgress: 100,
  tourSeen: false,
  lastToldAt: null,
  trip: PLACEHOLDER_TRIP,
  cityPackKey: 'osaka',
  logged: [],
  draftMessage: '',
  extraPlanItems: [],
  removedPlanItemIds: [],
  prepChecked: initialPrepChecked,
  reflectStep: 0,
  reflectPicks: {},
  msgs: [],
  thinking: false,
  offlineNotice: false,
  lastAsk: '',
  setupComplete: null,
  moneySegment: 'today',
  pendingNearbyAnswerId: null,
  pendingSupportOpenTriage: false,

  setContact: (id) => set({ contactId: id }),

  setMoneySegment: (segment) => set({ moneySegment: segment }),

  requestNearbyAnswer: (id) => set({ pendingNearbyAnswerId: id }),
  clearPendingNearbyAnswer: () => set({ pendingNearbyAnswerId: null }),

  requestSupportTriage: () => set({ pendingSupportOpenTriage: true }),
  clearPendingSupportTriage: () => set({ pendingSupportOpenTriage: false }),

  markTourSeen: () => set({ tourSeen: true }),

  hydrate: async () => {
    const saved = await loadSetup();
    if (saved) {
      set({
        cityPackKey: saved.cityPackKey,
        trip: saved.trip,
        contactId: saved.contactId,
        customContacts: saved.customContacts,
        setupComplete: true,
      });
    } else {
      set({ setupComplete: false });
    }
  },

  completeSetup: async ({ cityPackKey, trip, contactId }) => {
    set({ cityPackKey, trip, contactId, setupComplete: true });
    await saveSetup({ cityPackKey, trip, contactId, customContacts: get().customContacts, completedAt: Date.now() });
  },

  sendMessage: async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: ConversationMessage = { id: nextId('me'), from: 'me', text: trimmed };
    set((state) => ({
      msgs: [...state.msgs, userMessage],
      thinking: true,
      offlineNotice: false,
      lastAsk: trimmed,
    }));

    const spend = parseSpend(trimmed);
    if (spend) {
      setTimeout(() => {
        get().addLoggedSpend(spend.label, spend.amount);
        const state = get();
        const pack = CITY_PACKS[state.cityPackKey];
        const money = deriveMoney(state.trip, state.logged);
        const replyText =
          `Logged ${formatMoney(spend.amount, pack.currencySymbol)} for ${spend.label.toLowerCase()}. ` +
          (money.todayRemaining > 0
            ? `That leaves ${formatMoney(money.todayRemaining, pack.currencySymbol)} for today.`
            : "That's today's budget used up — I'll keep tonight's suggestions free where I can.");
        set((s) => ({
          thinking: false,
          msgs: [...s.msgs, { id: nextId('woby'), from: 'woby', face: 'hero', text: replyText }],
        }));
      }, SPEND_REPLY_DELAY_MS);
      return;
    }

    // No live assistant backend is wired yet — every reply comes from the scripted table.
    // The amber "offline" notice only shows when the device is genuinely offline, so it never
    // makes a false connectivity claim; it's not shown just because we lack a live backend.
    let isOffline = false;
    try {
      const netState = await NetInfo.fetch();
      isOffline = !(netState.isConnected && netState.isInternetReachable !== false);
    } catch {
      isOffline = false;
    }

    const state = get();
    const pack = CITY_PACKS[state.cityPackKey];
    const contact = [...DEFAULT_CONTACTS, ...state.customContacts].find((c) => c.id === state.contactId) ?? NO_CONTACT;
    const contactFirst = contactFirstName(contact);
    const ctx = { pack, contactFirst };
    const scripted = matchScript(trimmed);
    const filledText = fillTemplate(scripted.text, ctx);
    const filledOptions: MessageOption[] = scripted.options.map((o) => ({
      title: fillTemplate(o.title, ctx),
      price: fillTemplate(o.price, ctx),
      meta: fillTemplate(o.meta, ctx),
      why: fillTemplate(o.why, ctx),
      primary: o.primary,
    }));

    setTimeout(() => {
      set((s) => ({
        thinking: false,
        offlineNotice: isOffline,
        msgs: [...s.msgs, { id: nextId('woby'), from: 'woby', face: scripted.face, text: filledText, options: filledOptions }],
      }));
      if (scripted.follow) {
        setTimeout(() => {
          set((s) => ({
            msgs: [...s.msgs, { id: nextId('woby'), from: 'woby', face: scripted.follow!.face, text: fillTemplate(scripted.follow!.text, ctx) }],
          }));
        }, FOLLOW_UP_DELAY_MS);
      }
    }, SCRIPTED_REPLY_DELAY_MS);
  },

  retryLastMessage: () => {
    const lastAsk = get().lastAsk;
    set({ offlineNotice: false });
    if (lastAsk) get().sendMessage(lastAsk);
  },

  confirmOption: (option) =>
    get().addPlanItem({
      id: nextId('plan'),
      time: 'Tonight',
      duration: option.meta,
      title: option.title,
      subtitle: option.why,
      byWoby: true,
      status: 'booked',
    }),

  // Transcribed from componentDidMount's "ambientNudge" — a proactive Now message waiting the
  // first time the app opens after setup, not something the user has to ask for. Drops the
  // prototype's invented "fourteen minutes away on foot" (no real distance data exists).
  seedAmbientNudge: () => {
    const state = get();
    if (state.msgs.length > 0) return;
    const pack = CITY_PACKS[state.cityPackKey];
    set({
      msgs: [
        {
          id: nextId('woby'),
          from: 'woby',
          face: 'hero',
          text: `Heads up — the last train from ${pack.area} is at ${pack.lastTrain}.`,
        },
      ],
    });
  },

  removePlanItem: (id) => set((state) => ({ removedPlanItemIds: [...state.removedPlanItemIds, id] })),

  addPlanItem: (item) => set((state) => ({ extraPlanItems: [...state.extraPlanItems, item] })),

  togglePrepItem: (id) =>
    set((state) => ({ prepChecked: { ...state.prepChecked, [id]: !state.prepChecked[id] } })),

  answerReflection: (step, answerIndex) =>
    set((state) => ({
      reflectPicks: { ...state.reflectPicks, [step]: answerIndex },
      reflectStep: step + 1,
    })),

  skipReflection: () => set((state) => ({ reflectStep: state.reflectStep + 1 })),

  restartReflection: () => set({ reflectStep: 0, reflectPicks: {} }),

  setDraftMessage: (text) => set({ draftMessage: text }),

  setTrip: (trip) => set((state) => ({ trip: { ...state.trip, ...trip } })),

  setDestinationFromText: (text) => set({ cityPackKey: matchCityPack(text).key as CityPackKey }),

  addLoggedSpend: (label, amount) =>
    set((state) => {
      const now = new Date();
      const loggedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      return {
        logged: [...state.logged, { id: `spend-${Date.now()}`, label, amount, loggedAt }],
      };
    }),

  markToldNow: () => set({ lastToldAt: Date.now() }),

  addCustomContact: (contact) =>
    set((state) => ({ customContacts: [...state.customContacts, contact], contactId: contact.id })),

  setLocationShare: (key) => set({ locationShare: key }),

  toggleDataSource: (key) =>
    set((state) => ({ dataSourceFlags: { ...state.dataSourceFlags, [key]: !state.dataSourceFlags[key] } })),

  toggleOffline: () => {
    const next = !get().offlineEnabled;
    set({ offlineEnabled: next, offlineProgress: 0 });
    if (next) runOfflineDownload(set, get);
    else stopOfflineDownload();
  },

  restartOfflineDownload: () => {
    if (!get().offlineEnabled) return;
    set({ offlineProgress: 0 });
    runOfflineDownload(set, get);
  },

  replayTour: () => {
    set({ tourSeen: false });
    useTourStore.getState().start();
  },

  resetEverything: () => {
    clearSetup();
    set({
      contactId: DEFAULT_CONTACTS[0].id,
      customContacts: [],
      locationShare: 'none',
      dataSourceFlags: initialDataSourceFlags,
      offlineEnabled: true,
      offlineProgress: 100,
      trip: PLACEHOLDER_TRIP,
      cityPackKey: 'osaka',
      logged: [],
      extraPlanItems: [],
      removedPlanItemIds: [],
      prepChecked: initialPrepChecked,
      reflectStep: 0,
      reflectPicks: {},
      msgs: [],
      thinking: false,
      offlineNotice: false,
      lastAsk: '',
      setupComplete: false,
    });
  },
}));
