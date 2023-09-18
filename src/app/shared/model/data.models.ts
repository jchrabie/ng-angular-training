export interface Category {
  id: number;
  name: string;
}

export interface ApiQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
}

export interface Results {
  questions: Question[];
  answers: string[];
  score: number;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export const DIFFICULTIES: { name: Difficulty }[] = [
  { name: 'Easy' },
  { name: 'Medium' },
  { name: 'Hard' },
];
