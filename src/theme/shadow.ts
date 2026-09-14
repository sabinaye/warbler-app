import { Platform, ViewStyle } from 'react-native';

// react-native has no CSS box-shadow equivalent — this approximates the spec's
// `offset / blur / rgba` shadows with native shadow* props on iOS and elevation on Android
// (Android elevation can't match the colour or precise blur, so it's a rough stand-in there).
export function shadowStyle(spec: { offsetX: number; offsetY: number; blur: number; color: string }): ViewStyle {
  return Platform.select<ViewStyle>({
    ios: {
      shadowColor: spec.color,
      shadowOffset: { width: spec.offsetX, height: spec.offsetY },
      shadowOpacity: 1,
      shadowRadius: spec.blur / 2,
    },
    android: { elevation: 2 },
    default: {},
  })!;
}
