import { useState, useEffect } from "react";
import type { Task, TFilters } from "../types/types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text: string, due?: string) => {
    if (!text.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, status: "active", due },
    ]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "active" ? "completed" : "active" }
          : t,
      ),
    );
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => t.status !== "completed"));
  };

  const getFilteredTasks = (filter: TFilters): Task[] => {
    return tasks.filter((t) => {
      if (filter === "all") return t;
      if (filter === "active") return t.status === "active";
      if (filter === "completed") return t.status === "completed";
    });
  };

  return {
    tasks,
    addTask,
    toggleTask,
    removeTask,
    clearCompleted,
    getFilteredTasks,
  };
}
