export type Sender = 'user' | 'bot';

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  isError?: boolean;
  originalText?: string;
  // Quiz-related properties
  options?: string[];
  isQuizQuestion?: boolean;
  selectedAnswer?: string; // The user's choice
  // Suggestion chips
  suggestions?: string[];
}