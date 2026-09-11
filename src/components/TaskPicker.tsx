import { ChevronRight, ChevronUp } from "lucide-react";
import { useState, type ReactNode } from "react";

interface TaskPickerProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  selected: string | undefined;
  onClose: () => void | null;
}

export default function TaskPicker({
  title,
  icon,
  children,
  selected,
  onClose,
}: TaskPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="inset-0 z-20 flex items-end sm:rounded-3xl">
      <div className="w-full border border-border rounded-xl hover:bg-muted/5">
        <header className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/10 text-primary">
              {icon}
            </span>

            <h2 className="font-semibold tracking-tight">{title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted text-sm text-right">{selected}</span>

            {isOpen ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsOpen(false);
                }}
                aria-label={`Close ${title}`}
                className="
              flex h-9 w-9
              items-center justify-center
              rounded-full
               text-muted
              hover:bg-muted/10
            "
              >
                <ChevronUp size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label={`Open ${title}`}
                className="
              flex h-9 w-9
              items-center justify-center
              rounded-full
              text-muted
              hover:bg-muted/10
            "
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </header>

        {isOpen && (
          <div className="max-h-[70vh] overflow-y-auto px-5 pb-5">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
