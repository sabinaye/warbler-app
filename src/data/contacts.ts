// Transcribed from the CONTACTS constant in design_handoff_warbler/Warbler v4.dc.html.
export type Contact = {
  id: string;
  name: string;
  relationship: string;
  /** Empty for the "Nobody for now" placeholder contact. */
  phone: string;
  initial: string;
  avatarColor: string;
};

export const DEFAULT_CONTACTS: Contact[] = [
  { id: 'priya', name: 'Priya Raman', relationship: 'Sister', phone: '+44 7700 900412', initial: 'P', avatarColor: '#A7CADD' },
  { id: 'mum', name: 'Anita Raman', relationship: 'Mum', phone: '+44 7700 900188', initial: 'A', avatarColor: 'rgba(47,125,87,.25)' },
];

export const NO_CONTACT: Contact = {
  id: 'none',
  name: 'Nobody for now',
  relationship: 'You can add someone later',
  phone: '',
  initial: '—',
  avatarColor: 'rgba(95,118,131,.18)',
};

export function contactSubtitle(contact: Contact): string {
  return contact.phone ? `${contact.relationship} · ${contact.phone}` : contact.relationship;
}

export function contactFirstName(contact: Contact): string {
  return contact.id === 'none' ? 'nobody yet' : contact.name.split(' ')[0];
}
