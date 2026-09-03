export interface Task {
  id: string;
  title: string;
  description?: string;
  points: number;
  date: string;
  completed: boolean;
}

export interface User {
  id: string;
  score: number;
}
