import { CityPack } from './types';

export const seoul: CityPack = {
  key: 'seoul',
  match: /seoul|korea/i,
  city: 'Seoul',
  country: 'South Korea',
  area: 'Hongdae',
  area2: 'Itaewon',
  stay: 'Hostel Nuri',
  currencySymbol: '₩',
  cashAdvice: '₩50,000',
  transitCard: 'T-money',
  nightBus: 'Night bus N26',
  nightBusShort: 'N26',
  lateNightShop: 'convenience store',
  warmPlaceLine: 'Convenience store on this corner, open all night, with seats inside.',
  pharmacy: 'Hongdae night pharmacy',
  pharmacyMeta: '450 m · open till 2am',
  pharmacyPhrase: '열이 있어요. 해열제 주세요.',
  policeEquivalent: 'police box',
  policeNote: 'Hongdae 파출소, 300 m. Staffed all night and used to travellers.',
  dayTrip: 'Suwon',
  dayTripMeta: '35 min on the subway',
  sight: 'Bukhansan',
  treat: 'hanjeongsik dinner',
  helpPhrase: '도와주세요 — dowajuseyo — please help me.',
  plugAdvice: 'Korea uses Type F. Your UK plugs will not fit.',
  embassy: 'British Embassy Seoul handles lost passports, in Jung-gu.',
  atmAdvice: 'Global ATMs at convenience stores take foreign cards. Bank machines often do not.',
  clinicCost: '₩40,000',
  lastTrain: '00:20',
  backTime: '01:10',
  emergencyNumbers: [
    { num: '119', note: 'Ambulance and fire. English support is available, though it can take a moment.' },
    { num: '112', note: 'Police. Use this if you feel threatened or unsafe.' },
  ],
  emergencyCaption: '119 ambulance and fire · 112 police. Always here, whatever you pick below.',
  askDraft: 'Is Hongdae okay to walk through around midnight?',
  askSuggestions: [
    'Is Hongdae okay to walk through around midnight?',
    'What should a taxi from Hongdae to Itaewon cost at midnight?',
    'Is it odd to eat at a restaurant alone here?',
  ],
  answers: [
    {
      id: 'a1',
      cat: 'safety',
      question: 'Is Hongdae okay to walk through around midnight?',
      shortAnswer: 'Busiest part of the night, honestly. Streets are packed and staffed until dawn.',
      agreeCount: '13 travellers',
      freshness: 'Updated 1 day ago',
      replies: [
        {
          who: 'Traveller in Seoul',
          when: '1 day ago',
          text: 'Midnight is peak Hongdae. Streets full, shops open, felt completely normal on my own.',
        },
        {
          who: 'Traveller in Busan',
          when: '3 weeks ago',
          text: 'Very safe. The only thing to watch is how loud and crowded it gets around the main stage.',
        },
      ],
    },
    {
      id: 'a2',
      cat: 'payments',
      question: 'Do the night buses take T-money?',
      shortAnswer: 'The N26 takes T-money and foreign contactless. Cash is awkward — avoid it.',
      agreeCount: '6 travellers',
      freshness: 'Updated 4 days ago',
      replies: [
        {
          who: 'Traveller in Seoul',
          when: '4 days ago',
          text: 'Tapped T-money on the N26, worked fine. Tap again at the back door when you get off.',
        },
        {
          who: 'Traveller in Seoul',
          when: '2 weeks ago',
          text: 'Buy the card at any convenience store. Far easier than fumbling for exact change.',
        },
      ],
    },
    {
      id: 'a3',
      cat: 'logistics',
      question: 'Guesthouses near the station — book ahead or walk in?',
      shortAnswer: 'Walk-in after 11pm is usually cheaper than the app. Bring your passport.',
      agreeCount: '5 travellers',
      freshness: 'Updated 1 week ago',
      replies: [
        {
          who: 'Traveller in Seoul',
          when: '1 week ago',
          text: 'Walked in near midnight, paid about ₩12,000 less than the app. They just need your passport.',
        },
        {
          who: 'Traveller in Seoul',
          when: '1 month ago',
          text: 'Weekends in Hongdae do sell out though — worth checking the app on a Friday.',
        },
      ],
    },
    {
      id: 'a4',
      cat: 'practical',
      question: 'Eating alone in the evening — is it odd here?',
      shortAnswer: 'Less than it used to be. Counter seats and single portions are normal now.',
      agreeCount: '10 travellers',
      freshness: 'Updated 3 days ago',
      replies: [
        {
          who: 'Traveller in Seoul',
          when: '3 days ago',
          text: 'Honbap — eating alone — is completely normal now. Plenty of places have single counters.',
        },
        {
          who: 'Traveller in Seoul',
          when: '2 weeks ago',
          text: 'Some barbecue places want two people minimum. Everywhere else is completely fine on your own.',
        },
      ],
    },
  ],
  guides: [
    {
      id: 'g1',
      title: 'Getting around',
      subtitle: 'T-money, last trains, night buses',
      intro: 'Everything runs on a tap card, and the subway stops just after midnight.',
      points: [
        {
          heading: 'Get a T-money card',
          body: 'Works on subway, buses, taxis and most convenience stores. Buy and top up at any station or shop.',
        },
        {
          heading: 'Last subway is just after midnight',
          body: 'Most lines finish between 00:00 and 00:40. Check the platform board rather than guessing.',
        },
        {
          heading: 'Night buses run all night',
          body: 'N-prefixed routes cover the city hourly and take the same card. Cheapest way home late.',
        },
        {
          heading: 'Taxis are cheap and safe',
          body: 'Kakao T is the standard app. Most drivers take the card, and fares are low by European standards.',
        },
      ],
    },
    {
      id: 'g2',
      title: 'Paying for things',
      subtitle: 'Cards work almost everywhere',
      intro: 'Korea is close to cashless, but a little cash still saves you at market stalls.',
      points: [
        { heading: 'Carry ₩50,000 in cash', body: 'Market stalls, some older restaurants and a few guesthouses are still cash only.' },
        { heading: 'Use convenience store ATMs', body: 'Global ATMs at convenience stores take foreign cards. Bank machines often do not.' },
        { heading: 'Always pay in won', body: 'If a card machine offers to charge you in pounds, decline. The rate is worse.' },
      ],
    },
    {
      id: 'g3',
      title: 'Staying connected',
      subtitle: 'eSIM, wifi, and offline',
      intro: 'Coverage is excellent. You still want offline copies for the night the data runs out.',
      points: [
        { heading: 'eSIM is the simplest', body: 'Install before you fly, switch on when you land. No shop visit, no deposit.' },
        { heading: 'Download maps offline', body: 'Note that Google Maps is weak here — Naver Map or Kakao Map work far better.' },
        { heading: 'Public wifi is everywhere', body: 'Subway, cafés and shops all have it, and most of it is genuinely fast.' },
      ],
    },
    {
      id: 'g4',
      title: 'If something goes wrong',
      subtitle: 'Numbers, phrases, embassies',
      intro: 'Worth reading once now, while nothing is wrong, so you are not reading it for the first time later.',
      points: [
        {
          heading: '119 and 112',
          body: '119 is ambulance and fire. 112 is police. Both have English support, though it can take a moment.',
        },
        {
          heading: 'Police boxes are everywhere',
          body: '파출소 are small staffed neighbourhood posts, used to lost travellers and genuinely helpful.',
        },
        { heading: 'Your embassy', body: 'British Embassy Seoul handles lost passports, in Jung-gu.' },
        { heading: 'One phrase worth having', body: '도와주세요 — dowajuseyo — please help me.' },
      ],
    },
  ],
};
