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
    setTasks((prev) => [...prev, task]);
  };

  const editTask = (id: string, task: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...task } : t)));
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
    editTask,
    toggleTask,
    removeTask,
    clearCompleted,
    getFilteredTasks,
  };
}
