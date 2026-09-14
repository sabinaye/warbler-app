import { AccessibilityRole, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { WOBY } from '../../../assets/woby';
import { CheckAgreeIcon } from '../../../components/icons/icons';
import { color } from '../../../theme/tokens';
import { useOnboardingStore } from '../../../state/onboardingStore';
import { INTERVIEW_QUESTIONS } from '../../../data/interview';

export function InterviewStep() {
  const interviewIdx = useOnboardingStore((s) => s.interviewIdx);
  const interviewPicks = useOnboardingStore((s) => s.interviewPicks);
  const selectInterviewAnswer = useOnboardingStore((s) => s.selectInterviewAnswer);

  const question = INTERVIEW_QUESTIONS[interviewIdx];
  const current = interviewPicks[question.id];

  return (
    <View style={styles.root}>
      <View style={styles.questionRow}>
        <Image source={WOBY.fly} style={styles.face} />
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{question.question}</Text>
        </View>
      </View>

      <View style={styles.optionList}>
        {question.answers.map((answer) => {
          const on = question.multi ? Array.isArray(current) && current.includes(answer) : current === answer;
          return (
            <Pressable
              key={answer}
              onPress={() => selectInterviewAnswer(answer)}
              accessibilityRole={(question.multi ? 'checkbox' : 'radio') as AccessibilityRole}
              accessibilityState={{ selected: on }}
              style={({ pressed }) => [
                styles.optionRow,
                { borderColor: on ? color.tint : 'transparent' },
                pressed && styles.optionRowPressed,
              ]}
            >
              <View
                style={[
                  styles.checkMark,
                  { borderRadius: question.multi ? 6 : 11, borderColor: on ? color.tint : 'rgba(22,50,63,.28)', backgroundColor: on ? color.tint : 'transparent' },
                ]}
              >
                {on ? <CheckAgreeIcon color={color.surface} size={11} /> : null}
              </View>
              <Text style={styles.optionLabel}>{answer}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.note}>{question.note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 12,
  },
  questionRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  face: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  bubble: {
    flex: 1,
    minWidth: 0,
    backgroundColor: color.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  bubbleText: {
    fontSize: 17,
    lineHeight: 22,
    color: color.ink,
  },
  optionList: {
    gap: 8,
  },
  optionRow: {
    backgroundColor: color.surface,
    borderRadius: 12,
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
  },
  optionRowPressed: {
    backgroundColor: color.tintWash30,
  },
  checkMark: {
    width: 22,
    height: 22,
    borderWidth: 1.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    color: color.ink,
  },
  note: {
    marginTop: 12,
    marginHorizontal: 4,
    fontSize: 13,
    lineHeight: 18,
    color: color.inkTertiary,
  },
});
