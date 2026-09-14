import { WobyFace } from '../assets/woby';

export type MessageOption = {
  title: string;
  price: string;
  meta: string;
  why: string;
  primary: boolean;
};

export type ConversationMessage =
  | { id: string; from: 'me'; text: string }
  | { id: string; from: 'woby'; face: WobyFace; text: string; options?: MessageOption[] };
