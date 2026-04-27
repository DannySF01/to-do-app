import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Moon, Sun, ListChecks, MonitorDown } from "lucide-react";
import { useTasks } from "./hooks/useTasks";
import { useTheme } from "./hooks/useTheme";
import { usePWA } from "./hooks/usePWA";

export default function App() {
  const { tasks, addTask, toggleTask, removeTask } = useTasks();
  const { theme, toggleTheme } = useTheme();
  const { isInstallable, install } = usePWA();

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

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {tasks.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-10 text-center text-muted"
              >
                <div className="mb-3 opacity-70">
                  <ListChecks size={28} />
                </div>

                <p className="text-sm">No tasks yet</p>
              </motion.div>
            ) : (
              tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  onClick={() => toggleTask(task.id)}
                  className="card flex items-center justify-between p-3 hover:brightness-110 transition"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={(e) => e.stopPropagation()}
                      className="h-4 w-4 rounded border-muted accent-primary"
                    />

                    <div className="space-y-1">
                      <p
                        className={`text-sm ${
                          task.done ? "line-through text-muted" : ""
                        }`}
                      >
                        {task.text}
                      </p>

                      {task.due && (
                        <p className="text-[11px] text-muted">
                          {new Date(task.due).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeTask(task.id)}
                    className="text-muted hover:text-red-500 transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))
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

              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={!input.trim()}
                  className="btn btn-primary flex-1 disabled:opacity-50"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn flex-1"
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
