import { useState, useEffect } from "react";
import type { Task } from "../types/types";

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
      { id: crypto.randomUUID(), text, done: false, due },
    ]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, addTask, toggleTask, removeTask };
}
