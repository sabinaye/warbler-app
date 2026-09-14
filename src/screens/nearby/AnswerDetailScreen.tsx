import { StyleSheet, Text, View } from 'react-native';

import { PushedScreen } from '../../components/primitives/PushedScreen';
import { color, radius } from '../../theme/tokens';
import { useAppStore } from '../../state/store';
import { CITY_PACKS } from '../../data/cityPacks';

type AnswerDetailScreenProps = {
  answerId: string;
  onBack: () => void;
};

export function AnswerDetailScreen({ answerId, onBack }: AnswerDetailScreenProps) {
  const cityPackKey = useAppStore((s) => s.cityPackKey);
  const pack = CITY_PACKS[cityPackKey];
  const answer = pack.answers.find((a) => a.id === answerId) ?? pack.answers[0];

  return (
    <PushedScreen title="Answers" backLabel="Nearby" onBack={onBack}>
      <Text style={styles.question}>{answer.question}</Text>
      <Text style={styles.meta}>
        {answer.agreeCount} · {answer.freshness}
      </Text>

      <View style={styles.replyList}>
        {answer.replies.map((reply, index) => (
          <View key={index} style={styles.replyCard}>
            <View style={styles.replyHeaderRow}>
              <View style={styles.avatarDot} />
              <Text style={styles.replyWho}>{reply.who}</Text>
              <Text style={styles.replyWhen}>{reply.when}</Text>
            </View>
            <Text style={styles.replyText}>{reply.text}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.caption}>Everyone here is anonymous. Treat it as one traveller's experience, not official advice.</Text>
    </PushedScreen>
  );
}

const styles = StyleSheet.create({
  question: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: color.ink,
  },
  meta: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
  replyList: {
    marginTop: 20,
    gap: 8,
  },
  replyCard: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    padding: 16,
  },
  replyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: color.tintWash45,
  },
  replyWho: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: color.ink,
  },
  replyWhen: {
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
  replyText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 20,
    color: color.ink,
  },
  caption: {
    marginTop: 12,
    marginHorizontal: 4,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
});
