import { Home, ListTodo, CalendarDays, Settings, Plus } from "lucide-react";
import { useState } from "react";

interface BottomNavProps {
  onHome: () => void;
  onTasks: () => void;
  onAddTask: () => void;
  onCalendar: () => void;
  onSettings: () => void;
}

export default function BottomNav({
  onHome,
  onTasks,
  onCalendar,
  onSettings,
  onAddTask,
}: BottomNavProps) {
  const [active, setActive] = useState<
    "home" | "tasks" | "calendar" | "settings"
  >("home");

  return (
    <nav className="fixed inset-x-0 bottom-4 z-35 px-4 md:hidden">
      <div
        className="
          relative mx-auto flex h-16 max-w-md items-center
          justify-around
          rounded-3xl
          border border-border
          bg-surface/95
          px-5
          shadow-lg
          backdrop-blur-xl
        "
      >
        {/* Home */}
        <NavButton
          onClick={() => {
            setActive("home");
            onHome();
          }}
          active={active === "home"}
        >
          <Home size={21} strokeWidth={1.8} />
        </NavButton>

        {/* Tasks */}
        <NavButton
          onClick={() => {
            setActive("tasks");
            onTasks();
          }}
          active={active === "tasks"}
        >
          <ListTodo size={21} strokeWidth={1.8} />
        </NavButton>

        {/* Floating Add */}
        <button
          type="button"
          onClick={onAddTask}
          className="flex h-14 w-14
            items-center justify-center
            rounded-full
            bg-primary
            text-primary-foreground
            shadow-lg shadow-primary/25
            transition-transform
            hover:scale-105
            active:scale-95
          "
        >
          <Plus size={27} strokeWidth={2} />
        </button>

        {/* Calendar */}
        <NavButton
          onClick={() => {
            setActive("calendar");
            onCalendar();
          }}
          active={active === "calendar"}
        >
          <CalendarDays size={21} strokeWidth={1.8} />
        </NavButton>

        {/* Settings */}
        <NavButton
          onClick={() => {
            setActive("settings");
            onSettings();
          }}
          active={active === "settings"}
        >
          <Settings size={21} strokeWidth={1.8} />
        </NavButton>
      </div>
    </nav>
  );
}

function NavButton({
  active = false,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex h-11 w-11 items-center justify-center
        rounded-2xl
        transition-all duration-200

        ${
          active
            ? "bg-surface-hover text-foreground"
            : "text-muted hover:bg-surface-hover hover:text-foreground"
        }
      `}
    >
      {children}
    </button>
  );
}
