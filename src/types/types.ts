export type Theme = "dark" | "light";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string | null;
  time: string | null;
  priority: TaskPriority;
  list: string | undefined;
  repeat: TaskRepeat;
  reminder: boolean;
}

export interface List {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

export type TFilters = "overview" | "active" | "completed";

export type TaskPriority = "none" | "low" | "medium" | "high";

export type TaskRepeat = "no" | "daily" | "weekdays" | "weekly" | "monthly";

export type TaskPicker =
  | "date"
  | "time"
  | "priority"
  | "project"
  | "repeat"
  | null;
