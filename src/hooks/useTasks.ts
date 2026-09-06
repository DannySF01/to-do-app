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

  const addTask = (task: Task) => {
    const { text, date, time, priority, list, repeat, reminder } = task;
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        date,
        time,
        priority,
        list,
        repeat,
        completed: false,
        reminder,
      },
    ]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => t.completed === false));
  };

  const getFilteredTasks = (selectedList: string): Task[] => {
    return tasks.filter((t) => t.list === selectedList || selectedList === "");
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
