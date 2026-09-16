import type { Task } from "../types/types";

export type AgendaGroupKey =
  | "overdue"
  | "today"
  | "tomorrow"
  | "thisWeek"
  | "nextWeek"
  | "later";

export type AgendaGroups = Record<AgendaGroupKey, Task[]>;

function startOfToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function parseDueDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function groupTasksByDate(tasks: Task[]): AgendaGroups {
  const today = startOfToday();
  const tomorrow = addDays(today, 1);
  const endOfThisWeek = addDays(today, 7);
  const endOfNextWeek = addDays(today, 14);

  const groups: AgendaGroups = {
    overdue: [],
    today: [],
    tomorrow: [],
    thisWeek: [],
    nextWeek: [],
    later: [],
  };

  for (const task of tasks) {
    if (task.completed) continue;

    if (!task.date) continue;

    const due = parseDueDate(task.date);

    if (due < today) {
      groups.overdue.push(task);
    } else if (isSameDay(due, today)) {
      groups.today.push(task);
    } else if (isSameDay(due, tomorrow)) {
      groups.tomorrow.push(task);
    } else if (due < endOfThisWeek) {
      groups.thisWeek.push(task);
    } else if (due < endOfNextWeek) {
      groups.nextWeek.push(task);
    } else {
      groups.later.push(task);
    }
  }

  const byDateThenTime = (a: Task, b: Task) => {
    const dateCompare = (a.date ?? "").localeCompare(b.date ?? "");
    if (dateCompare !== 0) return dateCompare;
    // Tasks without time come last
    if (!a.time) return 1;
    if (!b.time) return -1;
    return a.time.localeCompare(b.time);
  };

  groups.overdue.sort(byDateThenTime);
  groups.thisWeek.sort(byDateThenTime);
  groups.nextWeek.sort(byDateThenTime);
  groups.later.sort(byDateThenTime);
  groups.today.sort(byDateThenTime);
  groups.tomorrow.sort(byDateThenTime);

  return groups;
}
