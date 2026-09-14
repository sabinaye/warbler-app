// Transcribed from parseSpend() in design_handoff_warbler/Warbler v4.dc.html — the regex-based
// spend-intent detector that lets "I spent €18 on dinner" log a real entry instead of going
// through the scripted-reply table.
export type ParsedSpend = {
  amount: number;
  label: string;
};

const INTENT_WORDS = /\b(spent|spend|paid|bought|cost)\b/;
const AMOUNT = /(?:€|eur\s*)?(\d+(?:[.,]\d{1,2})?)/;
const LABEL_AFTER = /\b(?:on|for)\s+(?:a\s+|an\s+|the\s+|some\s+)?([a-z][a-z' -]{1,28})/;
const TRAILING_TIME_WORDS = /\s+(just now|today|tonight|earlier|yesterday)$/;

export function parseSpend(text: string): ParsedSpend | null {
  const lower = text.toLowerCase();
  if (!INTENT_WORDS.test(lower)) return null;

  const amountMatch = lower.match(AMOUNT);
  if (!amountMatch) return null;
  const amount = Math.round(parseFloat(amountMatch[1].replace(',', '.')));
  if (!amount || amount > 100000) return null;

  let label = '';
  const labelMatch = lower.match(LABEL_AFTER);
  if (labelMatch) {
    label = labelMatch[1].replace(TRAILING_TIME_WORDS, '').trim();
  }
  if (!label) label = 'unlabelled';

  return { amount, label: label.charAt(0).toUpperCase() + label.slice(1) };
}
