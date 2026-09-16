import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import {
  groupTasksByDate,
  type AgendaGroupKey,
} from "../utils/groupTasksByDate";
import { useLists } from "../hooks/useLists";
import type { Task } from "../types/types";

interface CalendarProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
}

const GROUP_ORDER: AgendaGroupKey[] = [
  "overdue",
  "today",
  "tomorrow",
  "thisWeek",
  "nextWeek",
  "later",
];

function parseDueDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function Calendar({ tasks, onToggleComplete }: CalendarProps) {
  const { t, i18n } = useTranslation();
  const { lists } = useLists();

  const groups = useMemo(() => groupTasksByDate(tasks), [tasks]);

  function formatWeekday(iso: string): string {
    const date = parseDueDate(iso);
    const label = new Intl.DateTimeFormat(i18n.language, {
      weekday: "short",
    }).format(date);
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  function groupLabel(key: AgendaGroupKey): string {
    switch (key) {
      case "overdue":
        return t("calendar.overdue");
      case "today":
        return t("calendar.today");
      case "tomorrow":
        return t("calendar.tomorrow");
      case "thisWeek":
        return t("calendar.thisWeek");
      case "nextWeek":
        return t("calendar.nextWeek");
      case "later":
        return t("calendar.later");
    }
  }

  function dateHint(task: Task, groupKey: AgendaGroupKey): string | null {
    if (groupKey === "today" || groupKey === "tomorrow")
      return task.time ?? null;

    if (groupKey === "overdue") {
      const date = parseDueDate(task.date!);
      return new Intl.DateTimeFormat(i18n.language, {
        day: "2-digit",
        month: "2-digit",
      }).format(date);
    }

    // thisWeek / later
    const weekday = formatWeekday(task.date!);
    return task.time ? `${weekday}, ${task.time}` : weekday;
  }

  const hasAnyTask = GROUP_ORDER.some((key) => groups[key].length > 0);

  if (!hasAnyTask) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center justify-center gap-2 py-24 text-center"
      >
        <p className="text-sm font-medium text-foreground">
          {t("emptyState.noTasks.title")}
        </p>
        <p className="max-w-xs text-sm text-muted">
          {t("emptyState.noTasks.description")}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-4xl px-6 pb-26 pt-18 md:px-10 md:py-6">
      {GROUP_ORDER.map((key, sectionIndex) => {
        const groupTasks = groups[key];
        if (groupTasks.length === 0) return null;

        return (
          <motion.section
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: sectionIndex * 0.05,
              ease: "easeOut",
            }}
          >
            <div className="mb-3 flex items-center gap-2 px-1">
              {key === "overdue" && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
              )}
              <p
                className={`text-xs font-semibold uppercase tracking-wider ${
                  key === "overdue" ? "text-red-500" : "text-muted"
                }`}
              >
                {groupLabel(key)}
              </p>
              <span className="text-xs font-medium text-muted/60">
                {groupTasks.length}
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border shadow-sm shadow-black/2 transition-shadow duration-300 hover:shadow-md hover:shadow-black/3">
              <AnimatePresence initial={false}>
                {groupTasks.map((task, index) => {
                  const list = lists.find((l) => l.id === task.list);
                  const hint = dateHint(task, key);

                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12, height: 0 }}
                      transition={{
                        duration: 0.25,
                        delay: sectionIndex * 0.05 + index * 0.03,
                        ease: "easeOut",
                      }}
                      whileHover={{ x: 2 }}
                      className={`group flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${
                        index < groupTasks.length - 1
                          ? "border-b border-border"
                          : ""
                      } ${
                        key === "overdue"
                          ? "bg-red-500/5 hover:bg-red-500/8"
                          : "bg-surface hover:bg-surface-hover"
                      }`}
                    >
                      <motion.button
                        type="button"
                        onClick={() => onToggleComplete(task.id)}
                        aria-label={t("task.markComplete")}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                        className="h-4 w-4 shrink-0 rounded-sm border border-border-strong transition-colors duration-200 hover:border-primary"
                      />

                      <span className="flex-1 truncate text-sm text-foreground transition-colors duration-200">
                        {task.text}
                      </span>

                      {list && (
                        <span className="shrink-0 rounded-lg bg-surface-hover px-2 py-0.5 text-xs text-muted transition-colors duration-200 group-hover:bg-border/60">
                          {list.name}
                        </span>
                      )}

                      {hint && (
                        <span
                          className={`shrink-0 text-xs tabular-nums ${
                            key === "overdue"
                              ? "font-medium text-red-500"
                              : "text-muted"
                          }`}
                        >
                          {hint}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}
