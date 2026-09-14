// Transcribed from the dataSources list in design_handoff_warbler/Warbler v4.dc.html
// ("What Warbler knows" pushed screen).
export type DataSourceKey = 'location' | 'plan' | 'spend' | 'battery';

export type DataSourceDefinition = {
  key: DataSourceKey;
  label: string;
  detail: string;
};

export const DATA_SOURCES: DataSourceDefinition[] = [
  { key: 'location', label: 'Where you are', detail: 'Used to work out what is walkable right now.' },
  { key: 'plan', label: 'Your plan', detail: 'Bookings and times you have added yourself.' },
  { key: 'spend', label: 'What you have spent', detail: 'Typed in by you. Never linked to a bank.' },
  { key: 'battery', label: 'Battery and signal', detail: 'Used to suggest options that do not need a phone.' },
];
