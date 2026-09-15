import { t } from "i18next";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ListMenuProps {
  onRename: () => void;
  onDelete: () => void;
}

export default function ListMenu({ onRename, onDelete }: ListMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRename = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setOpen(false);
    onRename();
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setOpen(false);
    onDelete();
  };

  return (
    <div ref={menuRef} className="relative shrink-0">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        aria-label="List options"
        aria-expanded={open}
        className="
          rounded-md 
          text-muted
          transition
          hover:bg-foreground/5
          hover:text-foreground
          md:opacity-0
          md:group-hover:opacity-100
          items-center
          flex
          p-0.5
        "
      >
        <MoreVertical size={16} strokeWidth={2} />
      </button>

      {open && (
        <div
          className="
            absolute right-0 top-full z-100
            mt-1.5 w-36
            rounded-xl
            border border-border
            bg-surface
            p-1
            shadow-lg
          "
        >
          <button
            type="button"
            onClick={handleRename}
            className="
              flex w-full items-center gap-2.5
              rounded-lg px-3 py-2.5
              text-sm text-foreground
              transition
              hover:bg-foreground/5
            "
          >
            <Pencil size={15} strokeWidth={1.8} />
            {t("common.rename")}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="
              flex w-full items-center gap-2.5
              rounded-lg px-3 py-2.5
              text-sm text-red-500
              transition
              hover:bg-red-500/10
            "
          >
            <Trash2 size={15} strokeWidth={1.8} />
            {t("common.delete")}
          </button>
        </div>
      )}
    </div>
  );
}
