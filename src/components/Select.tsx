import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Select({
  value,
  options,
  onSelect,
}: {
  value: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex min-w-36 items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-hover"
      >
        <span>{selected?.label}</span>

        <ChevronDown
          size={16}
          className={`text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-100 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-lg">
          {options.map((lang) => (
            <button
              key={lang.value}
              type="button"
              onClick={() => {
                onSelect(lang.value);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface-hover"
            >
              <span>{lang.label}</span>

              {value === lang.value && (
                <Check size={16} className="text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
