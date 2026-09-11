import { CalendarDays } from "lucide-react";
import TaskPicker from "./TaskPicker";

interface DatePickerProps {
  value: string | undefined;
  onChange: (value: string | null) => void;
  onClose: () => void;
}

const presets = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "next-week", label: "Next week" },
];

export default function DatePicker({
  value,
  onChange,
  onClose,
}: DatePickerProps) {
  return (
    <TaskPicker
      title="Date"
      icon={<CalendarDays size={18} />}
      selected={value}
      onClose={onClose}
    >
      <div className="space-y-1">
        {presets.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => {
              onChange(preset.value);
              onClose();
            }}
            className={`
              flex
              w-full
              items-center
              justify-between
              rounded-xl
              px-4
              py-3.5
              text-left
              text-sm
              transition
              ${value === preset.value ? "bg-muted/20 font-medium" : "hover:bg-muted/10"}
            `}
          >
            {preset.label}

            {value === preset.value && (
              <span className="text-xs">Selected</span>
            )}
          </button>
        ))}
      </div>

      <div className="my-5 h-px bg-muted/20" />

      <label className="block">
        <span className="mb-2 block text-xs font-medium text-muted">
          Custom date
        </span>

        <input
          type="date"
          value={
            value && !presets.some((item) => item.value === value) ? value : ""
          }
          onChange={(e) => {
            onChange(e.target.value || null);
            onClose();
          }}
          className="
            w-full
            rounded-xl
            border
            border-border
            px-4
            py-3
            text-sm
            outline-none
            focus:border-border-strong
          "
        />
      </label>
    </TaskPicker>
  );
}
