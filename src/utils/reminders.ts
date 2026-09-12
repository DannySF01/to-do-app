import type { ReminderOption } from "../types/types";

const reminderMinutes: Record<
  Exclude<ReminderOption, "none" | "at_time">,
  number
> = {
  "5m": 5,
  "15m": 15,
  "30m": 30,
  "1h": 60,
  "1d": 1440,
};

export function getReminderDate(
  date: string,
  time: string,
  reminder: ReminderOption,
): Date | null {
  if (reminder === "none") {
    return null;
  }

  const dueDate = new Date(`${date}T${time}`);

  if (Number.isNaN(dueDate.getTime())) {
    return null;
  }

  if (reminder === "at_time") {
    return dueDate;
  }

  return new Date(dueDate.getTime() - reminderMinutes[reminder] * 60_000);
}
