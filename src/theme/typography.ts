import { TextStyle } from 'react-native';
import { color } from './tokens';

// Transcribed from the "Typography" table in design_handoff_warbler/README.md.
// Poppins roles need the Poppins_<weight> family loaded via useFonts before use.
// Body/UI roles omit fontFamily so they fall through to the platform default (SF Pro on iOS).

export const textStyle = {
  largeTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 34,
    lineHeight: 41,
    letterSpacing: -0.4,
    color: color.ink,
  } satisfies TextStyle,

  screenTitleCollapsed: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: color.ink,
  } satisfies TextStyle,

  sectionHeading: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.4,
    color: color.ink,
  } satisfies TextStyle,

  cardTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: color.ink,
  } satisfies TextStyle,

  rowLabel: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400',
    color: color.ink,
  } satisfies TextStyle,

  rowLabelEmphasis: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: color.ink,
  } satisfies TextStyle,

  bodySecondary: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
    color: color.inkSecondary,
  } satisfies TextStyle,

  buttonLabel: {
    fontSize: 17,
    fontWeight: '600',
  } satisfies TextStyle,

  buttonLabelSmall: {
    fontSize: 15,
    fontWeight: '600',
  } satisfies TextStyle,

  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    color: color.inkTertiary,
  } satisfies TextStyle,

  groupHeader: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: color.inkSecondary,
  } satisfies TextStyle,

  micro: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
  } satisfies TextStyle,

  moneyRingFigure: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 34,
    letterSpacing: -1,
    color: color.ink,
  } satisfies TextStyle,
} as const;

// Numerals in money contexts: font-variant-numeric: tabular-nums.
export const tabularNums: TextStyle = { fontVariant: ['tabular-nums'] };
