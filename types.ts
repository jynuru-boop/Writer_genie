
export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Suggestion {
  id: string;
  label: string;
  prompt: string;
}
