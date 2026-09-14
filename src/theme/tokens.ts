// Design tokens transcribed from design_handoff_warbler/README.md ("Design tokens").
// Values here are the intended final values — do not approximate or "improve" them.

export const color = {
  canvas: '#FDFAEA',
  // Nav bars and tab bar sit on a 20–22px backdrop blur over one of these,
  // depending on which chrome it is (see the component that uses it for the exact figure).
  canvasTranslucent82: 'rgba(253,250,234,.82)',
  canvasTranslucent86: 'rgba(253,250,234,.86)',

  ink: '#16323F',
  inkSecondary: '#5F7683',
  inkTertiary: '#8196A1',

  accent: '#2A7BA4',
  accentPressed: '#1F6C94',

  tint: '#71ABCB',
  tintLight: '#A7CADD',
  // Row press state, info cards, selected chips — opacity varies .30–.45 by context.
  tintWash30: 'rgba(167,202,221,.30)',
  tintWash35: 'rgba(167,202,221,.35)',
  tintWash45: 'rgba(167,202,221,.45)',

  success: '#2F7D57',
  successWash14: 'rgba(47,125,87,.14)',
  warning: '#C86A12',
  warningInk: '#A8590C',
  warningWash10: 'rgba(200,106,18,.10)',
  warningWash14: 'rgba(200,106,18,.14)',

  danger: '#D92B1F',

  deviceShell: '#0E1C24',
  surface: '#FFFFFF',

  hairline16: 'rgba(22,50,63,.16)',
  hairline18: 'rgba(22,50,63,.18)',
} as const;

export const spacing = {
  screenGutter: 16,
  sectionRhythm: 24,
  sectionRhythmTight: 20,
  rowPaddingVertical: 11.5, // 11–12px
  rowPaddingHorizontal: 16,
} as const;

export const radius = {
  row: 10,
  card: 12,
  sheet: 16,
  tourCard: 16,
  pillMin: 11,
  pillMax: 22,
  full: 9999,
} as const;

export const shadow = {
  card: { offsetX: 0, offsetY: 1, blur: 2, color: 'rgba(22,50,63,.07)' },
  pushedScreen: { offsetX: -10, offsetY: 0, blur: 30, spread: -10, color: 'rgba(14,28,36,.22)' },
  tourCard: { offsetX: 0, offsetY: 18, blur: 40, spread: -12, color: 'rgba(14,28,36,.55)' },
  toggleKnob: { offsetX: 0, offsetY: 3, blur: 8, color: 'rgba(0,0,0,.18)' },
} as const;

export const hairlineWidth = 0.5;

export const touchTarget = {
  min: 44,
} as const;

export const layout = {
  pushedHeaderHeight: 103,
  pushedContentTopPadding: 127,
  tabBarHeight: 49,
  homeIndicatorHeight: 34,
  blurNav: 22,
  blurTabBar: 22,
} as const;

// Durations in ms, transcribed from the "Motion" table.
export const motion = {
  fadeUp: { riseDp: 8, durationMs: 400, easing: 'ease' as const },
  rise: { riseDp: 12, durationMs: 350, easing: 'ease' as const }, // "0.3–0.4s"
  push: { durationMs: 340, bezier: [0.2, 0.85, 0.25, 1] as const },
  sheet: { durationMs: 300 },
  dim: { durationMs: 280 },
  alert: { fromScale: 1.14, toScale: 1, durationMs: 200 },
  toast: { dropInDp: 12, totalMs: 3400 },
  valueTransition: { durationMs: 400, bezier: [0.2, 0.8, 0.2, 1] as const }, // "0.2–0.6s"
  wobyBob: { durationMs: 4500, amplitudeDp: 5, easing: 'ease-in-out' as const },
  wobyWave: { durationMs: 4500 },
  wobyStroll: { horizontalDurationMs: 4400, horizontalAmplitudeDp: 9, stepDurationMs: 620, stepRiseDp: 7 },
  spotlightPulse: { durationMs: 1700, strokeFrom: 2.5, strokeTo: 4.5, opacityFrom: 1, opacityTo: 0.55 },
} as const;

export const hapticDurationMs = { min: 6, max: 12 } as const;
