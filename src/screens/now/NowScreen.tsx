import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityRole,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MessageBubble } from '../../components/primitives/MessageBubble';
import { ThinkingDots } from '../../components/primitives/ThinkingDots';
import { OptionConfirmSheet } from '../../components/primitives/OptionConfirmSheet';
import { MicIcon, SendArrowIcon } from '../../components/icons/icons';
import { WOBY } from '../../assets/woby';
import { color, touchTarget } from '../../theme/tokens';
import { textStyle } from '../../theme/typography';
import { useAppStore } from '../../state/store';
import { CITY_PACKS } from '../../data/cityPacks';
import { deriveMoney, formatMoney } from '../../domain/money';
import { MessageOption } from '../../domain/conversation';
import { useBatteryLevel } from '../../hooks/useBatteryLevel';
import { useTourTarget } from '../../hooks/useTourTarget';
import { TAB_CONTROL_ROW_HEIGHT } from '../../components/primitives/TabBar';

const QUICK_START_CHIPS = [
  'I missed the last train',
  'I spent €18 on dinner',
  "I'm over budget",
  "I'm low on energy",
  "I'm not feeling great",
];

type NowScreenProps = {
  onOpenSupport: () => void;
};

export function NowScreen({ onOpenSupport }: NowScreenProps) {
  const insets = useSafeAreaInsets();
  const trip = useAppStore((s) => s.trip);
  const logged = useAppStore((s) => s.logged);
  const cityPackKey = useAppStore((s) => s.cityPackKey);
  const msgs = useAppStore((s) => s.msgs);
  const thinking = useAppStore((s) => s.thinking);
  const offlineNotice = useAppStore((s) => s.offlineNotice);
  const draftMessage = useAppStore((s) => s.draftMessage);
  const setDraftMessage = useAppStore((s) => s.setDraftMessage);
  const sendMessage = useAppStore((s) => s.sendMessage);
  const retryLastMessage = useAppStore((s) => s.retryLastMessage);
  const confirmOption = useAppStore((s) => s.confirmOption);

  const pack = CITY_PACKS[cityPackKey];
  const money = deriveMoney(trip, logged);
  const batteryPercent = useBatteryLevel();
  const composerTargetRef = useTourTarget('composer');

  const [draft, setDraft] = useState('');
  const [pendingOption, setPendingOption] = useState<MessageOption | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (draftMessage) {
      setDraft(draftMessage);
      setDraftMessage('');
      inputRef.current?.focus();
    }
  }, [draftMessage, setDraftMessage]);

  const isEmpty = msgs.length === 0 && !thinking;
  const nights = Math.max(1, money.tripDays - 1);
  const currentNight = Math.min(money.dayIndex, nights);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    sendMessage(text);
    setDraft('');
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerTitleColumn}>
            <Text style={textStyle.largeTitle}>Right now</Text>
            <Text style={styles.tripLine}>
              {pack.city} · night {currentNight} of {nights}
            </Text>
          </View>
          <Pressable
            onPress={onOpenSupport}
            accessibilityRole={'button' as AccessibilityRole}
            accessibilityLabel="Connection status"
            style={({ pressed }) => [styles.connectionPill, pressed && styles.connectionPillPressed]}
          >
            <View style={[styles.connectionDot, { backgroundColor: offlineNotice ? color.warning : color.success }]} />
            <Text style={styles.connectionLabel}>{offlineNotice ? 'Offline' : 'Online'}</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contextStrip} contentContainerStyle={styles.contextStripContent}>
          {batteryPercent !== null ? (
            <View style={[styles.contextPill, styles.batteryPill]}>
              <View style={styles.batteryDot} />
              <Text style={styles.batteryLabel}>{batteryPercent}% battery</Text>
            </View>
          ) : null}
          <View style={styles.contextPill}>
            <Text style={styles.contextPillLabel}>{formatMoney(money.todayRemaining, pack.currencySymbol)} left today</Text>
          </View>
        </ScrollView>
      </View>

      <KeyboardAvoidingView style={styles.flexArea} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {isEmpty ? (
            <View style={styles.emptyState}>
              <Image source={WOBY.hero} style={styles.emptyFace} />
              <Text style={styles.emptyTitle}>Nothing needs you right now</Text>
              <Text style={styles.emptySubtitle}>When something comes up, tell me what's happening and I'll lay out your options.</Text>
            </View>
          ) : null}

          {msgs.map((message) => (
            <MessageBubble key={message.id} message={message} onSelectOption={setPendingOption} />
          ))}

          {thinking ? <ThinkingDots /> : null}

          {offlineNotice ? (
            <View style={styles.offlineNotice}>
              <Text style={styles.offlineNoticeText}>No connection, so this is from what I've saved on your phone.</Text>
              <Pressable onPress={retryLastMessage} accessibilityRole={'button' as AccessibilityRole} hitSlop={8}>
                <Text style={styles.retryLabel}>Retry</Text>
              </Pressable>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {QUICK_START_CHIPS.map((label) => (
              <Pressable
                key={label}
                onPress={() => handleSend(label)}
                accessibilityRole={'button' as AccessibilityRole}
                style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
              >
                <Text style={styles.chipLabel}>{label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={[styles.composerRow, { paddingBottom: Math.max(20, insets.bottom + TAB_CONTROL_ROW_HEIGHT + 16) }]}>
            <View style={styles.composer} ref={composerTargetRef}>
              <TextInput
                ref={inputRef}
                style={styles.composerInput}
                value={draft}
                onChangeText={setDraft}
                placeholder="Tell Woby what's happening"
                placeholderTextColor={color.inkTertiary}
                multiline
                accessibilityLabel="Message Woby"
              />
              <Pressable
                onPress={() => handleSend(draft)}
                accessibilityRole={'button' as AccessibilityRole}
                accessibilityLabel="Send"
                style={[styles.sendButton, { backgroundColor: draft.trim() ? color.tint : 'rgba(22,50,63,.22)' }]}
              >
                <SendArrowIcon />
              </Pressable>
            </View>
            <Pressable
              onPress={() => inputRef.current?.focus()}
              accessibilityRole={'button' as AccessibilityRole}
              accessibilityLabel="Dictate"
              style={({ pressed }) => [styles.micButton, pressed && styles.micButtonPressed]}
            >
              <MicIcon />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      <OptionConfirmSheet
        option={pendingOption}
        onCancel={() => setPendingOption(null)}
        onConfirm={() => {
          if (pendingOption) confirmOption(pendingOption);
          setPendingOption(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.canvas,
  },
  flexArea: {
    flex: 1,
  },
  header: {
    paddingTop: 66,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerTitleColumn: {
    minWidth: 0,
  },
  tripLine: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkSecondary,
  },
  connectionPill: {
    minHeight: touchTarget.min,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectionPillPressed: {
    opacity: 0.5,
  },
  connectionDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  connectionLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: color.ink,
  },
  contextStrip: {
    marginTop: 20,
  },
  contextStripContent: {
    gap: 8,
    paddingBottom: 4,
  },
  contextPill: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: color.tintWash45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextPillLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: color.ink,
  },
  batteryPill: {
    backgroundColor: color.warningWash14,
    flexDirection: 'row',
    gap: 6,
    paddingLeft: 10,
  },
  batteryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.warningInk,
  },
  batteryLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: color.warningInk,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  emptyFace: {
    width: 112,
    height: 112,
    opacity: 0.9,
    resizeMode: 'contain',
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: color.ink,
  },
  emptySubtitle: {
    marginTop: 4,
    maxWidth: 260,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 20,
    color: color.inkSecondary,
  },
  offlineNotice: {
    marginLeft: 48,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: color.warningWash10,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  offlineNoticeText: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    lineHeight: 18,
    color: '#8A4C10',
  },
  retryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: color.accent,
  },
  footer: {
    backgroundColor: color.canvas,
  },
  chipRow: {
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 10,
  },
  chip: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 19,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: 'rgba(113,171,203,.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipPressed: {
    backgroundColor: color.tintWash45,
  },
  chipLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: color.accent,
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
  },
  composer: {
    flex: 1,
    minHeight: touchTarget.min,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: color.surface,
    borderRadius: 22,
    paddingLeft: 16,
    paddingRight: 6,
  },
  composerInput: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    color: color.ink,
    paddingVertical: 11,
    maxHeight: 110,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  micButton: {
    width: touchTarget.min,
    height: touchTarget.min,
    borderRadius: 22,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonPressed: {
    backgroundColor: color.tintWash45,
  },
});
