// Transcribed from the INTERVIEW constant in design_handoff_warbler/Warbler v4.dc.html
// (onboarding's Interview step).
export type InterviewQuestion = {
  id: string;
  question: string;
  note: string;
  answers: string[];
  multi?: boolean;
};

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'shape',
    question: 'What kind of trip is this for you?',
    note: 'Shapes how much I put in a day.',
    answers: [
      'My first time travelling alone',
      'A reset — slow, few plans',
      'See as much as I can',
      'Somewhere I already know',
    ],
  },
  {
    id: 'worry',
    question: 'What worries you about going alone?',
    note: "Pick as many as you like — I'll keep an eye on these without making a thing of them.",
    multi: true,
    answers: [
      'Getting lost or stranded',
      'Being alone in the evenings',
      'Money running out',
      'Something going wrong medically',
      'Honestly, nothing much',
    ],
  },
  {
    id: 'want',
    question: "What's the one thing you'd be sad to miss?",
    note: "I'll protect this when the plan has to change.",
    answers: [
      "Food I can't get at home",
      "A specific place I've seen photos of",
      'Meeting people',
      'Time on my own',
      'No idea yet',
    ],
  },
];

export const NOTHING_MUCH_ANSWER = 'Honestly, nothing much';
