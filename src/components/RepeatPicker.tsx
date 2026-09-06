"use client";

import { Repeat2 } from "lucide-react";
import TaskPicker from "./TaskPicker";
import type { TaskRepeat } from "../types/types";

interface RepeatPickerProps {
  value: TaskRepeat;
  onChange: (value: TaskRepeat) => void;
  onClose: () => void;
}

const options = [
  { value: "no" as const, label: "Does not repeat" },
  { value: "daily" as const, label: "Every day" },
  { value: "weekdays" as const, label: "Every weekday" },
  { value: "weekly" as const, label: "Every week" },
  { value: "monthly" as const, label: "Every month" },
];

export default function RepeatPicker({
  value,
  onChange,
  onClose,
}: RepeatPickerProps) {
  return (
    <TaskPicker
      title="Repeat"
      icon={<Repeat2 size={18} />}
      selected={value}
      onClose={onClose}
    >
      <div className="space-y-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onChange(option.value);
              onClose();
            }}
            className={`
              flex
              w-full
              items-center
              rounded-xl
              px-4
              py-3.5
              text-left
              text-sm
              transition
              ${value === option.value ? "bg-muted/10 font-medium" : "hover:bg-muted/5"}
            `}
          >
            <span className="flex-1">{option.label}</span>

            {value === option.value && (
              <span className="text-xs">Selected</span>
            )}
          </button>
        ))}
      </div>
    </TaskPicker>
  );
}
