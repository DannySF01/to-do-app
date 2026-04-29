import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, ListChecks, MonitorDown } from "lucide-react";
import { useTasks } from "./hooks/useTasks";
import { useTheme } from "./hooks/useTheme";
import { usePWA } from "./hooks/usePWA";
import TaskItem from "./components/TaskItem";
import { useNotifications } from "./hooks/useNotifications";

export default function App() {
  const { tasks, addTask, toggleTask, removeTask } = useTasks();
  const { theme, toggleTheme } = useTheme();
  const { isInstallable, install } = usePWA();
  const { requestPermission, sendSystemNotification } = useNotifications();

  const pendingTasks = tasks.filter((t) => !t.done);
  const completedTasks = tasks.filter((t) => t.done);

  const [input, setInput] = useState("");
  const [due, setDue] = useState("");
  const [showModal, setShowModal] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleAdd = () => {
    if (!input.trim()) return;
    addTask(input.trim(), due);
    setInput("");
    setDue("");
    setShowModal(false);
    requestPermission();
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    if (showModal) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showModal]);

  useEffect(() => {
    if (showModal) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showModal]);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = new Date();

      tasks.forEach((task) => {
        if (task.due && !task.done) {
          const dueDate = new Date(task.due);

          if (
            dueDate.getTime() <= now.getTime() &&
            dueDate.getTime() > now.getTime() - 60000
          ) {
            sendSystemNotification("Tarefa Pendente!", task.text);
          }
        }
      });
    }, 60000);

    return () => clearInterval(checkInterval);
  }, [tasks]);

  return (
    <div className="min-h-screen flex justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium tracking-tight">Tasks</h1>
          <div className="flex items-center gap-3">
            {isInstallable && (
              <button
                onClick={install}
                className="btn text-muted hover:text-foreground"
              >
                <MonitorDown size={18} />
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="btn text-muted hover:text-foreground"
            >
              {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary w-full py-2 text-sm"
        >
          New Task
        </button>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {tasks.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-10 text-muted"
              >
                <ListChecks size={28} className="mb-2 opacity-50" />
                <p className="text-sm">No tasks yet</p>
              </motion.div>
            ) : (
              <>
                <div className="space-y-2">
                  {pendingTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onRemove={removeTask}
                    />
                  ))}
                </div>

                {completedTasks.length > 0 && (
                  <div className="space-y-2 pt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted px-1">
                      Done — {completedTasks.length}
                    </h3>
                    <div className="space-y-2 opacity-80">
                      {completedTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggle={toggleTask}
                          onRemove={removeTask}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-background rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-medium">New Task</h2>

              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="Task..."
                className="input"
              />

              <input
                type="datetime-local"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                className="input"
              />

              <div className="flex gap-2 ">
                <button
                  onClick={handleAdd}
                  disabled={!input.trim()}
                  className="btn btn-primary flex-1 disabled:opacity-50 py-2"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn flex-1 py-2"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
