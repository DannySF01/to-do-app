export type Theme = "dark" | "light";

export interface Task {
  id: string;
  text: string;
  status: "active" | "completed";
  due?: string;
}

export type TFilters = "all" | "active" | "completed";
