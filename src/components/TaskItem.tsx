import { CalendarDays, Check, Clock, Flag, Repeat2 } from "lucide-react";
import { motion } from "motion/react";
import type { Task } from "../types/types";
import TaskMenu from "./TaskMenu";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function TaskItem({
  task,
  onToggle,
  onEdit,
  onDuplicate,
  onRemove,
}: TaskItemProps) {
  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => onToggle(task.id)}
      className="card flex items-center justify-between px-4 py-3 cursor-pointer transition-all"
    >
      <div className="flex items-center gap-4">
        <Checkbox checked={task.completed} />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p
              className={`text-sm font-medium transition-all ${task.completed ? "line-through text-muted" : "text-foreground"}`}
            >
              {task.text}
            </p>
            {task.list && (
              <span className="text-[10px] bg-muted/10 px-1.5 py-0.5 rounded-md capitalize text-muted">
                {task.list}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-[10px] capitalize">
            {task.date && (
              <div className="flex items-center gap-1 text-muted">
                <CalendarDays size={12} />
                <p className="font-mono">
                  {new Date(task.date).toLocaleDateString()}
                </p>
              </div>
            )}
            {task.time && (
              <div className="flex items-center gap-1 text-muted">
                <Clock size={12} />
                <p className="font-mono">{task.time}</p>
              </div>
            )}
            {task.priority !== "none" && (
              <div className={`${task.priority}`}>
                <span className="flex items-center gap-1 ">
                  <Flag size={12} />
                  {task.priority}
                </span>
              </div>
            )}
            {task.repeat !== "no" && (
              <div className={`${task.repeat}`}>
                <span className="flex items-center gap-1">
                  <Repeat2 size={12} />
                  {task.repeat}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <TaskMenu
        taskId={task.id}
        onEdit={onEdit}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
      />
    </motion.div>
  );
}

const Checkbox = ({ checked }: { checked: boolean }) => {
  return (
    <button
      type="button"
      className={`
    flex h-5 w-5 shrink-0 items-center justify-center
    rounded-md border
    transition-all duration-200
    ${
      checked
        ? "border-blue-500 bg-blue-500 text-white"
        : "border-zinc-500 bg-transparent hover:border-blue-500 hover:bg-blue-500/10"
    }
  `}
      aria-label={checked ? "Mark as active" : "Mark as completed"}
    >
      {checked && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
    </button>
  );
};
