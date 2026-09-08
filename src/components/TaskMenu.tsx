"use client";

import { Copy, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TaskMenuProps {
  taskId: string;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function TaskMenu({
  taskId,
  onEdit,
  onDuplicate,
  onRemove,
}: TaskMenuProps) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      {/* 3 dots */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="flex h-8 w-8 items-center justify-center rounded-lg
                   text-muted transition-colors
                   hover:bg-surface-hover hover:text-foreground"
        aria-label="Task options"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {/* Menu */}
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-border
                     bg-surface p-1.5 shadow-lg"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(taskId);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2
                             text-sm text-foreground
                             hover:bg-surface-hover"
          >
            <Pencil className="h-4 w-4 text-muted" />
            Edit task
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(taskId);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2
                             text-sm text-foreground
                             hover:bg-surface-hover"
          >
            <Copy className="h-4 w-4 text-muted" />
            Duplicate
          </button>

          <div className="my-1.5 h-px bg-border" />

          <button
            onClick={() => onRemove(taskId)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2
                             text-sm text-red-500
                             hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete task
          </button>
        </div>
      )}
    </div>
  );
}
