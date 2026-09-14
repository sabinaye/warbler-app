// Transcribed from the REFLECT constant in design_handoff_warbler/Warbler v4.dc.html
// ("Looking back" pushed screen — five-question end-of-trip reflection).
export type ReflectionQuestion = {
  question: string;
  answers: string[];
};

export const REFLECTION_QUESTIONS: ReflectionQuestion[] = [
  {
    question: 'What challenged you most on this trip?',
    answers: [
      'Working out where to go and what to do',
      'Feeling unsure on my own',
      'Spending more than I planned',
      'Getting overwhelmed or worn out',
      'Moments where I felt unsafe',
    ],
  },
  {
    question: 'What went better than you expected?',
    answers: ['Getting around', 'Talking to strangers', 'Eating alone', 'Keeping to a budget', 'Sleeping properly'],
  },
  {
    question: 'When did you feel most like yourself?',
    answers: [
      'Early mornings',
      'With other travellers',
      'Walking with no plan',
      'Somewhere local, eating',
      'Quiet evenings in',
    ],
  },
  {
    question: 'What would you do differently?',
    answers: [
      'Book less',
      'Book more',
      'Spend more on comfort',
      'Move between places slower',
      'Tell people at home more often',
    ],
  },
  {
    question: 'Would you travel alone again?',
    answers: ['Tomorrow', 'Yes, but differently', 'Yes, with someone next time', 'Not sure yet', 'Probably not'],
  },
];
