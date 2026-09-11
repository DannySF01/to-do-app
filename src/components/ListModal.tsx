import { useEffect, useState } from "react";
import { Folder, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ListModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialName?: string;
  onClose: () => void;
  onSave: (
    name: string,
  ) => void | { success: boolean; reason?: "empty" | "exists" };
}

export default function ListModal({
  open,
  mode,
  initialName = "",
  onClose,
  onSave,
}: ListModalProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(initialName);
      setError("");
    }
  }, [open, initialName]);

  const isEdit = mode === "edit";

  const handleSave = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter a list name.");
      return;
    }

    const result = onSave(trimmedName);

    if (result && typeof result === "object" && !result.success) {
      if (result.reason === "exists") {
        setError("A list with this name already exists.");
      }

      return;
    }

    setName("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setName("");
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="
            fixed inset-0 z-100
            flex items-center justify-center
            bg-black/40 px-6
            backdrop-blur-[2px]
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            onClick={(e) => e.stopPropagation()}
            className="
              w-full max-w-sm
              rounded-2xl
              border border-border
              bg-surface
              p-5
              shadow-2xl
            "
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold tracking-tight">
                  {isEdit ? "Rename List" : "New List"}
                </h2>

                <p className="mt-1 text-sm text-muted">
                  {isEdit
                    ? "Choose a new name for your list."
                    : "Create a list to organize your tasks."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="
                  rounded-lg p-1.5
                  text-muted
                  transition
                  hover:bg-foreground/5
                  hover:text-foreground
                "
              >
                <X size={18} />
              </button>
            </div>

            {/* Input */}
            <div className="mt-6">
              <label
                htmlFor="list-name"
                className="mb-2 block text-xs font-medium"
              >
                List name
              </label>

              <input
                id="list-name"
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSave();
                  }
                }}
                className={`
                  w-full rounded-xl
                  border
                  bg-background
                  px-3 py-2.5
                  text-sm
                  outline-none
                  transition
                  placeholder:text-muted/60
                  ${
                    error
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-border focus:border-foreground/30"
                  }
                `}
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs text-red-500"
                >
                  {error}
                </motion.p>
              )}
            </div>

            {/* Icon */}
            {!isEdit && (
              <div
                className="
                  mt-5 flex items-center gap-3
                  rounded-xl
                  border border-border
                  bg-background
                  p-3
                "
              >
                <div
                  className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-lg
                    bg-foreground/5
                  "
                >
                  <Folder size={18} className="text-muted" />
                </div>

                <div>
                  <p className="text-sm font-medium">Folder</p>

                  <p className="text-xs text-muted">Default list icon</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="
                  rounded-xl px-4 py-2
                  text-sm font-medium
                  text-muted
                  transition
                  hover:bg-foreground/5
                  hover:text-foreground
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="btn-primary px-4 py-2 text-sm"
              >
                {isEdit ? "Save Changes" : "Create List"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
