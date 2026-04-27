import { Trash2 } from "lucide-react";
import { motion } from "motion/react";

export default function TaskItem({
  task,
  onToggle,
  onRemove,
}: {
  task: any;
  onToggle: any;
  onRemove: any;
}) {
  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => onToggle(task.id)}
      className="card flex items-center justify-between p-3 hover:brightness-110 cursor-pointer transition-all"
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.done}
          readOnly
          className="h-4 w-4 rounded border-muted accent-primary cursor-pointer"
        />
        <div className="space-y-0.5">
          <p
            className={`text-sm transition-all ${task.done ? "line-through text-muted" : "text-foreground"}`}
          >
            {task.text}
          </p>
          {task.due && (
            <p className="text-[10px] text-muted font-mono uppercase">
              {new Date(task.due).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(task.id);
        }}
        className="text-muted hover:text-red-500 p-1 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
}
