// Persisted setup, per README's "State" section: "Setup: destination, date range, budget,
// trusted contact, completion timestamp. Written on onboarding completion and on any later edit
// from Trip details." Everything else in the app is session-only.
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CityPackKey } from '../data/cityPacks';
import { Contact } from '../data/contacts';
import { TripSetup } from '../domain/money';

const STORAGE_KEY = 'warbler.setup.v1';

export type PersistedSetup = {
  cityPackKey: CityPackKey;
  trip: TripSetup;
  contactId: string;
  customContacts: Contact[];
  completedAt: number;
};

export async function saveSetup(setup: PersistedSetup): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(setup));
}

export async function loadSetup(): Promise<PersistedSetup | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PersistedSetup;
  } catch {
    return null;
  }
}

export async function clearSetup(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
