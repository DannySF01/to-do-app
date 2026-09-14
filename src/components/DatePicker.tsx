import { CalendarDays } from "lucide-react";
import TaskPicker from "./TaskPicker";
import { t } from "i18next";

interface DatePickerProps {
  value: string | undefined;
  label: string;
  onChange: (value: string | null) => void;
  onClose: () => void;
}

function resolveOption(option: "today" | "tomorrow" | "nextWeek"): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  if (option === "tomorrow") date.setDate(date.getDate() + 1);
  if (option === "nextWeek") date.setDate(date.getDate() + 7);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidDate(iso: string): boolean {
  const year = Number(iso.slice(0, 4));
  return year >= 2026 && year <= 2100;
}

export default function DatePicker({
  value,
  label,
  onChange,
  onClose,
}: DatePickerProps) {
  const options: { value: "today" | "tomorrow" | "nextWeek"; label: string }[] =
    [
      { value: "today", label: t("date.today") },
      { value: "tomorrow", label: t("date.tomorrow") },
      { value: "nextWeek", label: t("date.nextWeek") },
    ];

  return (
    <TaskPicker
      title={label}
      icon={<CalendarDays size={18} />}
      selected={value}
      onClose={onClose}
    >
      <div className="space-y-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onChange(resolveOption(option.value));
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
              ${value === option.value ? "bg-muted/20 font-medium" : "hover:bg-muted/10"}
            `}
          >
            {option.label}

            {value === option.value && (
              <span className="text-xs">{t("common.selected")}</span>
            )}
          </button>
        ))}
      </div>

      <div className="my-5 h-px bg-muted/20" />

      <label className="block">
        <span className="mb-2 block text-xs font-medium text-muted">
          {t("date.custom")}
        </span>

        <input
          type="date"
          min="2026-01-01"
          max="2100-12-31"
          onChange={(e) => {
            if (!isValidDate(e.target.value)) return;
            onChange(e.target.value);
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
