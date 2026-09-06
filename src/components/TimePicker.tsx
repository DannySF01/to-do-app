"use client";

import { Clock3 } from "lucide-react";
import TaskPicker from "./TaskPicker";

interface TimePickerProps {
  value: string | undefined;
  onChange: (value: string | null) => void;
  onClose: () => void;
}

export default function TimePicker({
  value,
  onChange,
  onClose,
}: TimePickerProps) {
  return (
    <TaskPicker
      title="Time"
      icon={<Clock3 size={18} />}
      selected={value}
      onClose={onClose}
    >
      <label className="block">
        <span className="mb-2 block text-xs font-medium text-muted">
          Select time
        </span>

        <input
          type="time"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
          className="
            w-full
            rounded-xl
            border
            border-border
            focus:border-border-strong
            px-4
            py-3
            outline-none
          "
        />
      </label>

      <button
        type="button"
        onClick={() => {
          onChange(null);
          onClose();
        }}
        className="
          mt-3
          w-full
          rounded-xl
          px-4
          py-3
          text-sm
          text-muted
          hover:bg-muted/5
        "
      >
        Remove time
      </button>

      <button
        type="button"
        onClick={onClose}
        className="
          mt-2
          w-full
          rounded-xl
          bg-black
          px-4
          py-3
          text-sm
          font-medium
          text-white
          hover:bg-zinc-800
        "
      >
        Done
      </button>
    </TaskPicker>
  );
}
