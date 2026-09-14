import { AccessibilityRole, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { WOBY } from '../../assets/woby';
import { ConversationMessage, MessageOption } from '../../domain/conversation';
import { color } from '../../theme/tokens';
import { tabularNums } from '../../theme/typography';
import { shadowStyle } from '../../theme/shadow';

type MessageBubbleProps = {
  message: ConversationMessage;
  onSelectOption?: (option: MessageOption) => void;
};

export function MessageBubble({ message, onSelectOption }: MessageBubbleProps) {
  if (message.from === 'me') {
    return (
      <View style={styles.meRow}>
        <View style={styles.meBubble}>
          <Text style={styles.meText}>{message.text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wobyRow}>
      <Image source={WOBY[message.face]} style={styles.face} />
      <View style={styles.wobyColumn}>
        <View style={styles.wobyBubble}>
          <Text style={styles.wobyText}>{message.text}</Text>
        </View>
        {message.options && message.options.length > 0 ? (
          <View style={styles.optionList}>
            {message.options.map((option, index) => (
              <Pressable
                key={`${option.title}-${index}`}
                onPress={() => onSelectOption?.(option)}
                accessibilityRole={'button' as AccessibilityRole}
                style={({ pressed }) => [
                  styles.optionCard,
                  { borderColor: option.primary ? color.tint : 'transparent' },
                  pressed && styles.optionCardPressed,
                ]}
              >
                <View style={styles.optionHeaderRow}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={[styles.optionPrice, tabularNums]}>{option.price}</Text>
                </View>
                <Text style={styles.optionMeta}>{option.meta}</Text>
                <Text style={styles.optionWhy}>{option.why}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  meRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  meBubble: {
    maxWidth: '80%',
    backgroundColor: color.accent,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  meText: {
    fontSize: 17,
    lineHeight: 22,
    color: color.surface,
  },
  wobyRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  face: {
    width: 40,
    height: 46,
    marginTop: 2,
    resizeMode: 'contain',
  },
  wobyColumn: {
    flex: 1,
    minWidth: 0,
  },
  wobyBubble: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    backgroundColor: color.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    ...shadowStyle({ offsetX: 0, offsetY: 1, blur: 2, color: 'rgba(22,50,63,.07)' }),
  },
  wobyText: {
    fontSize: 17,
    lineHeight: 22,
    color: color.ink,
  },
  optionList: {
    marginTop: 8,
    gap: 8,
  },
  optionCard: {
    backgroundColor: color.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    ...shadowStyle({ offsetX: 0, offsetY: 1, blur: 2, color: 'rgba(22,50,63,.07)' }),
  },
  optionCardPressed: {
    transform: [{ scale: 0.975 }],
  },
  optionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: color.ink,
    letterSpacing: -0.2,
  },
  optionPrice: {
    fontSize: 17,
    fontWeight: '600',
    color: color.ink,
  },
  optionMeta: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: color.accent,
  },
  optionWhy: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
});
