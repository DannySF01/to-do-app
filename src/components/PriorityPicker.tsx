"use client";

import { Flag } from "lucide-react";
import TaskPicker from "./TaskPicker";
import type { TaskPriority } from "../types/types";

interface PriorityPickerProps {
  value: TaskPriority;
  onChange: (value: TaskPriority) => void;
  onClose: () => void;
}

const priorities = [
  {
    value: "none" as const,
    label: "No priority",
    color: "bg-zinc-300",
  },
  {
    value: "low" as const,
    label: "Low",
    color: "bg-green-500",
  },
  {
    value: "medium" as const,
    label: "Medium",
    color: "bg-yellow-500",
  },
  {
    value: "high" as const,
    label: "High",
    color: "bg-red-500",
  },
];

export default function PriorityPicker({
  value,
  onChange,
  onClose,
}: PriorityPickerProps) {
  return (
    <TaskPicker
      title="Priority"
      icon={<Flag size={18} />}
      selected={value}
      onClose={onClose}
    >
      <div className="space-y-1">
        {priorities.map((priority) => (
          <button
            key={priority.value}
            type="button"
            onClick={() => {
              onChange(priority.value);
              onClose();
            }}
            className={`
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3.5
              text-left
              text-sm
              transition
              ${value === priority.value ? "bg-muted/10 font-medium" : "hover:bg-muted/5"}
            `}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${priority.color}`} />

            <span className="flex-1">{priority.label}</span>

            {value === priority.value && (
              <span className="text-xs">Selected</span>
            )}
          </button>
        ))}
      </div>
    </TaskPicker>
  );
}
