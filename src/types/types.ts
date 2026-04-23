export type Theme = "dark" | "light";

export interface Task {
  id: string;
  text: string;
  done: boolean;
  due?: string;
}
