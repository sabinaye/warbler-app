// Transcribed from the CATS constant in design_handoff_warbler/Warbler v4.dc.html.
import { AnswerCategory } from './cityPacks/types';

export const ANSWER_CATEGORIES: Record<AnswerCategory, { label: string; tile: string; ink: string }> = {
  safety: { label: 'Safety', tile: 'rgba(217,43,31,.12)', ink: '#D92B1F' },
  logistics: { label: 'Logistics', tile: 'rgba(42,123,164,.14)', ink: '#2A7BA4' },
  payments: { label: 'Payments', tile: 'rgba(47,125,87,.14)', ink: '#2F7D57' },
  practical: { label: 'Practical', tile: 'rgba(167,202,221,.5)', ink: '#16323F' },
};
