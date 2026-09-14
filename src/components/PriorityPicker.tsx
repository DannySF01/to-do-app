import { Flag } from "lucide-react";
import TaskPicker from "./TaskPicker";
import type { TaskPriority } from "../types/types";
import { t } from "i18next";

interface PriorityPickerProps {
  value: TaskPriority;
  label: string;
  onChange: (value: TaskPriority) => void;
  onClose: () => void;
}

export default function PriorityPicker({
  value,
  label,
  onChange,
  onClose,
}: PriorityPickerProps) {
  const priorities = [
    {
      value: "none" as const,
      label: t("priority.none"),
      color: "bg-zinc-300",
    },
    {
      value: "low" as const,
      label: t("priority.low"),
      color: "bg-green-500",
    },
    {
      value: "medium" as const,
      label: t("priority.medium"),
      color: "bg-yellow-500",
    },
    {
      value: "high" as const,
      label: t("priority.high"),
      color: "bg-red-500",
    },
  ];

  return (
    <TaskPicker
      title={label}
      icon={<Flag size={18} />}
      selected={priorities.find((priority) => priority.value === value)?.label}
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
              <span className="text-xs">{t("common.selected")}</span>
            )}
          </button>
        ))}
      </div>
    </TaskPicker>
  );
}
