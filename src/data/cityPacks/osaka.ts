import { CityPack } from './types';

export const osaka: CityPack = {
  key: 'osaka',
  match: /osaka|japan/i,
  city: 'Osaka',
  country: 'Japan',
  area: 'Namba',
  area2: 'Tennoji',
  stay: 'Hostel Sen',
  currencySymbol: '¥',
  cashAdvice: '¥10,000',
  transitCard: 'ICOCA',
  nightBus: 'Night bus 106',
  nightBusShort: '106',
  lateNightShop: 'konbini',
  warmPlaceLine: 'Konbini on this corner, open all night, nobody minds you sitting.',
  pharmacy: 'Kusuri no Aoki',
  pharmacyMeta: '600 m · open till 6am',
  pharmacyPhrase: '熱があります、市販の解熱剤をください。',
  policeEquivalent: 'koban',
  policeNote: 'Neighbourhood police box, 300 m. Used to helping travellers.',
  dayTrip: 'Kyoto',
  dayTripMeta: '28 min on the rapid',
  sight: 'Fushimi Inari',
  treat: 'kaiseki booking',
  helpPhrase: '助けてください — tasukete kudasai — please help me.',
  plugAdvice: 'Japan uses Type A. Your UK plugs will not fit.',
  embassy: 'British Embassy Tokyo handles lost passports. Osaka has a consular office for urgent cases.',
  atmAdvice: '7-Eleven and Japan Post reliably accept foreign cards. Bank ATMs often do not.',
  clinicCost: '¥8,000',
  lastTrain: '11:41',
  backTime: '12:50',
  emergencyNumbers: [
    { num: '119', note: 'Ambulance and fire. English support is available, though it can take a moment.' },
    { num: '110', note: 'Police. Use this if you feel threatened or unsafe.' },
  ],
  emergencyCaption: '119 ambulance and fire · 110 police. Always here, whatever you pick below.',
  askDraft: '',
  askSuggestions: [
    'Is the canal path east of Namba okay to walk at this hour?',
    'What should a taxi from Namba to Tennoji cost at midnight?',
    'Is it odd to walk into a capsule hotel without booking?',
  ],
  answers: [
    {
      id: 'a1',
      cat: 'safety',
      question: 'Is Namba station okay to walk through around midnight?',
      shortAnswer: 'Busy until the last train and staffed after. The quieter stretch is the canal path east.',
      agreeCount: '7 travellers',
      freshness: 'Updated 2 days ago',
      replies: [
        {
          who: 'Traveller in Osaka',
          when: '2 days ago',
          text: 'Walked it at half twelve on a Tuesday. Still plenty of people, konbini open, staff on the gate. Felt completely normal.',
        },
        {
          who: 'Traveller in Osaka',
          when: '1 week ago',
          text: "Fine, but the canal path east is much quieter after midnight. I take the main road instead — it's two minutes longer and much busier.",
        },
        {
          who: 'Traveller in Kyoto',
          when: '3 weeks ago',
          text: 'Did this a lot on a solo trip in November. No issues. The staffed exits are 4 and 11 if you want to come out somewhere lit.',
        },
      ],
    },
    {
      id: 'a2',
      cat: 'payments',
      question: 'Do the night buses take IC cards?',
      shortAnswer: 'Bus 106 takes ICOCA and Suica. Drivers cannot change notes above ¥1,000.',
      agreeCount: '4 travellers',
      freshness: 'Updated 5 days ago',
      replies: [
        {
          who: 'Traveller in Osaka',
          when: '5 days ago',
          text: 'Tapped my Suica on the 106 last week, worked fine. Tap at the back door when you get on.',
        },
        {
          who: 'Traveller in Osaka',
          when: '2 weeks ago',
          text: "Bring coins as a backup. I had a ¥5,000 note and the driver genuinely couldn't help.",
        },
      ],
    },
    {
      id: 'a3',
      cat: 'logistics',
      question: 'Capsule hotels near the station — book ahead or walk in?',
      shortAnswer: 'Walk-in after 11pm is usually cheaper than the app. Bring your passport.',
      agreeCount: '5 travellers',
      freshness: 'Updated 1 week ago',
      replies: [
        {
          who: 'Traveller in Osaka',
          when: '1 week ago',
          text: 'Walked in at midnight, paid about ¥600 less than the app was showing. They just need your passport.',
        },
        {
          who: 'Traveller in Tokyo',
          when: '1 month ago',
          text: 'Worth checking the app first anyway on a Friday or Saturday — those do sell out.',
        },
      ],
    },
    {
      id: 'a4',
      cat: 'practical',
      question: 'Eating alone in the evening — is it odd here?',
      shortAnswer: 'Not at all. Counter seats are designed for it and nobody will look twice.',
      agreeCount: '12 travellers',
      freshness: 'Updated 3 days ago',
      replies: [
        {
          who: 'Traveller in Osaka',
          when: '3 days ago',
          text: 'Solo counter dining is completely normal. Some places have single booths so you never speak to anyone.',
        },
        {
          who: 'Traveller in Osaka',
          when: '2 weeks ago',
          text: 'This was the thing I was most nervous about and it turned out to be the easiest part of the whole trip.',
        },
      ],
    },
  ],
  guides: [
    {
      id: 'g1',
      title: 'Getting around',
      subtitle: 'IC cards, last trains, night buses',
      intro: 'Almost everything here runs on a tap card, and almost everything stops just before midnight.',
      points: [
        {
          heading: 'Get an ICOCA',
          body: 'Works on trains, subways, buses and most convenience stores. Top it up at any machine with cash.',
        },
        {
          heading: 'Last trains are early',
          body: 'Most lines finish between 11:30pm and 12:15am. The gates close sooner than you would expect.',
        },
        {
          heading: 'Night buses exist',
          body: 'Fewer routes, roughly hourly, and they take the same card. Usually the cheapest way home late.',
        },
        {
          heading: 'Taxis are fine but pricey',
          body: 'Doors open by themselves. Many drivers take cards, but carrying cash saves a conversation.',
        },
      ],
    },
    {
      id: 'g2',
      title: 'Paying for things',
      subtitle: 'Cash still wins in small places',
      intro: 'Cards are widely accepted in cities, and completely useless in exactly the places you will want to eat.',
      points: [
        { heading: 'Carry ¥10,000 in cash', body: 'Small restaurants, shrines, markets and some hostels are still cash only.' },
        {
          heading: 'Use convenience store ATMs',
          body: '7-Eleven and Japan Post reliably accept foreign cards. Bank ATMs often do not.',
        },
        { heading: 'Always pay in yen', body: 'If a card machine offers to charge you in pounds, decline. The exchange rate is worse.' },
      ],
    },
    {
      id: 'g3',
      title: 'Staying connected',
      subtitle: 'eSIM, pocket wifi, and offline',
      intro: 'You want data for maps and translation. You want offline copies for the night the data runs out.',
      points: [
        { heading: 'eSIM is the simplest', body: 'Install before you fly, switch on when you land. No shop visit, no deposit.' },
        { heading: 'Download maps offline', body: 'Do it on hotel wifi on day one. It is the single most useful thing on this list.' },
        { heading: 'Public wifi is patchy', body: 'Convenience stores and stations have it. Most of it wants an email address first.' },
      ],
    },
    {
      id: 'g4',
      title: 'If something goes wrong',
      subtitle: 'Numbers, phrases, embassies',
      intro: 'Worth reading once now, while nothing is wrong, so you are not reading it for the first time later.',
      points: [
        {
          heading: '119 and 110',
          body: '119 is ambulance and fire. 110 is police. Both have English support, though it can take a moment.',
        },
        { heading: 'Koban are everywhere', body: 'Small neighbourhood police boxes. Staffed, used to lost tourists, and genuinely helpful.' },
        { heading: 'Your embassy', body: 'British Embassy Tokyo handles lost passports. Osaka has a consular office for urgent cases.' },
        { heading: 'One phrase worth having', body: '助けてください — tasukete kudasai — please help me.' },
      ],
    },
  ],
};
