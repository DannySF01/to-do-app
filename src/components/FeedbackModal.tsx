import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type FeedbackType = "error" | "warning" | "success" | "info";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: FeedbackType;
  confirmLabel?: string;
  onConfirm?: () => void;
}

const config = {
  error: {
    icon: AlertCircle,
    iconClass: "text-red-500 bg-red-500/10",
  },
  warning: {
    icon: AlertCircle,
    iconClass: "text-amber-500 bg-amber-500/10",
  },
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-500 bg-emerald-500/10",
  },
  info: {
    icon: Info,
    iconClass: "text-blue-500 bg-blue-500/10",
  },
};

export default function FeedbackModal({
  open,
  onClose,
  title,
  message,
  type = "error",
  confirmLabel = "Confirm",
  onConfirm,
}: FeedbackModalProps) {
  const { icon: Icon, iconClass } = config[type];

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-6 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
              >
                <Icon size={20} strokeWidth={2} />
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted transition hover:bg-foreground/5 hover:text-foreground"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4">
              <h2
                id="feedback-title"
                className="text-base font-semibold tracking-tight"
              >
                {title}
              </h2>

              <p className="mt-1.5 text-sm leading-5 text-muted">{message}</p>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              {onConfirm && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-muted transition hover:bg-foreground/5 hover:text-foreground"
                >
                  Cancel
                </button>
              )}

              <button
                type="button"
                onClick={handleConfirm}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  onConfirm
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "btn-primary"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
