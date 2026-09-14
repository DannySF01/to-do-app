import { Repeat2 } from "lucide-react";
import TaskPicker from "./TaskPicker";
import type { TaskRepeat } from "../types/types";
import { t } from "i18next";

interface RepeatPickerProps {
  value: TaskRepeat;
  label: string;
  onChange: (value: TaskRepeat) => void;
  onClose: () => void;
}

export default function RepeatPicker({
  value,
  label,
  onChange,
  onClose,
}: RepeatPickerProps) {
  const options = [
    { value: "no" as const, label: t("repeat.none") },
    { value: "daily" as const, label: t("repeat.daily") },
    { value: "weekdays" as const, label: t("repeat.weekdays") },
    { value: "weekly" as const, label: t("repeat.weekly") },
    { value: "monthly" as const, label: t("repeat.monthly") },
  ];

  return (
    <TaskPicker
      title={label}
      icon={<Repeat2 size={18} />}
      selected={options.find((option) => option.value === value)?.label}
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
              <span className="text-xs">{t("common.selected")}</span>
            )}
          </button>
        ))}
      </div>
    </TaskPicker>
  );
}
