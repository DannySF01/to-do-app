import { motion } from "framer-motion";
import { ListTodo, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
}

export function EmptyState({
  icon: Icon = ListTodo,
  title = "No tasks yet",
  description = "Get started by creating a new task",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex h-full min-h-[60vh] w-full flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface"
      >
        <Icon className="h-7 w-7 text-muted" strokeWidth={1.5} />
      </motion.div>

      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="max-w-xs text-sm text-muted">{description}</p>
      </div>
    </motion.div>
  );
}
