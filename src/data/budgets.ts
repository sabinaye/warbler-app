// Transcribed from the BUDGETS constant in design_handoff_warbler/Warbler v4.dc.html. The
// README's prose names these tiers "Lean / Comfortable / Generous / Open", but the prototype's
// actual code uses "Relaxed" and "No limit" — the code is the more authoritative source since
// it's what actually ships in the interaction. Values are a single numeric scale reused as-is
// regardless of the active city's currency (a limitation inherited from the source design, not
// introduced here).
export type BudgetTier = {
  amount: number;
  label: string;
};

export const BUDGET_TIERS: BudgetTier[] = [
  { amount: 380, label: 'Lean' },
  { amount: 580, label: 'Comfortable' },
  { amount: 880, label: 'Relaxed' },
  { amount: 1400, label: 'No limit' },
];
