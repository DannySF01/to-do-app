import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Moon, Sun } from "lucide-react";
import { useTasks } from "./hooks/useTasks";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { tasks, addTask, toggleTask, removeTask } = useTasks();
  const { theme, toggleTheme } = useTheme();
  const [input, setInput] = useState("");
  const [due, setDue] = useState("");

  const handleAdd = () => {
    addTask(input, due);
    setInput("");
    setDue("");
  };

  return (
    <div className="min-h-screen flex justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium tracking-tight">Tasks</h1>
          <button
            onClick={() => toggleTheme()}
            className="text-muted hover:text-foreground transition"
          >
            {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        <div className="space-y-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="New task..."
            className="input"
          />
          <input
            type="datetime-local"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="input"
          />
          <button
            onClick={handleAdd}
            className="btn btn-primary w-full py-2 text-sm"
          >
            Add task
          </button>
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="card flex items-start justify-between px-3 py-2 hover:brightness-110 transition"
              >
                <div className="space-y-1">
                  <p
                    onClick={() => toggleTask(task.id)}
                    className={`text-sm cursor-pointer ${
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

                <button
                  onClick={() => removeTask(task.id)}
                  className="text-muted hover:text-red-500 transition-colors duration-200 pt-1"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
