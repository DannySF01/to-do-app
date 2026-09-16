import {
  CheckCircle2,
  ChevronDown,
  LayoutDashboard,
  Plus,
  Settings,
  ListTodo,
  Menu,
  Folder,
  CalendarDays,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { List, Task, TView } from "../types/types";
import { motion } from "motion/react";
import ListMenu from "./ListMenu";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  view: string;
  setView: React.Dispatch<React.SetStateAction<TView>>;
  selectedList: string;
  setSelectedList: React.Dispatch<React.SetStateAction<string>>;
  onCreateList: () => void;
  onEditList: (list: List) => void;
  onDeleteList: (list: List) => void;
  lists: List[];
  tasks: Task[];
  numCompletedTasks: number;
  numActiveTasks: number;
  numLateTasks: number;
}

export default function Sidebar({
  open,
  setOpen,
  view,
  setView,
  selectedList,
  setSelectedList,
  lists,
  onCreateList,
  onEditList,
  onDeleteList,
  tasks,
  numActiveTasks,
  numCompletedTasks,
  numLateTasks,
}: SidebarProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(true)}
        className="
        fixed left-4 top-4 z-40
        flex h-10 w-10 items-center justify-center
        rounded-xl border border-border
        bg-surface text-foreground
        shadow-sm
        md:hidden
      "
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay outside the sidebar that closes it */}
      {open && (
        <button
          onClick={() => setOpen(false)}
          className="
          fixed inset-0 z-40
          bg-black/40
          backdrop-blur-[2px]
          md:hidden
        "
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface px-3 py-4 transition-transform duration-300 ease-out md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
        initial={false}
        animate={{ x: isMobile ? (open ? 0 : "-100%") : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        drag={isMobile ? "x" : false}
        dragConstraints={{ left: -256, right: 0 }}
        dragElastic={0.05}
        onDragEnd={(_, info) => {
          if (info.offset.x < -70 || info.velocity.x < -400) {
            setOpen(false);
          }
        }}
      >
        <h1 className="text-lg font-semibold tracking-[-0.01em] mb-6 px-2">
          To-Do App
        </h1>

        <div className="space-y-6">
          <section>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wide text-muted">
              {t("views.title")}
            </p>

            <nav className="space-y-0.5">
              <SidebarItem
                id="overview"
                active={view === "overview"}
                icon={<LayoutDashboard />}
                label={t("views.overview")}
                onClick={() => setView("overview")}
              />
              <SidebarItem
                id="calendar"
                active={view === "calendar"}
                icon={<CalendarDays />}
                label={t("views.calendar")}
                onClick={() => setView("calendar")}
                count={numLateTasks}
                countVariant="danger"
              />
              <SidebarItem
                id="active"
                active={view === "active"}
                icon={<ListTodo />}
                label={t("views.active")}
                count={numActiveTasks}
                onClick={() => setView("active")}
              />
              <SidebarItem
                id="completed"
                active={view === "completed"}
                icon={<CheckCircle2 />}
                label={t("views.completed")}
                count={numCompletedTasks}
                onClick={() => setView("completed")}
              />
            </nav>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between px-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                {t("lists.title")}
              </p>

              <button
                className="text-muted transition hover:text-primary px-1"
                onClick={onCreateList}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <nav className="space-y-0.5">
              {lists.map((list) => (
                <SidebarItem
                  id={list.id}
                  type="list"
                  key={list.id}
                  icon={<Folder size={18} />}
                  color={list.color}
                  label={list.name}
                  count={tasks.filter((task) => task.list === list.id).length}
                  active={selectedList === list.id}
                  onClick={() => {
                    if (selectedList === list.id) setSelectedList("");
                    else setSelectedList(list.id);
                  }}
                  onDelete={() => onDeleteList(list)}
                  onRename={() => onEditList(list)}
                />
              ))}
            </nav>
          </section>
        </div>

        <div className="flex-1" />

        <div className="space-y-2 border-t border-border pt-3">
          <SidebarItem
            id="settings"
            active={view === "settings"}
            onClick={() => setView("settings")}
            icon={<Settings />}
            label={t("settings.title")}
          />

          <button className="group flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-muted/5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-semibold text-zinc-600 ring-1 ring-zinc-200">
              DF
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium">Daniel</p>

              <p className="truncate text-[11px] text-muted">
                {t("account.freeAccount")}
              </p>
            </div>

            <ChevronDown className="h-3.5 w-3.5 text-muted transition group-hover:text-zinc-600" />
          </button>
        </div>
      </motion.aside>
    </>
  );
}

interface SidebarItemProps {
  id: string;
  type?: "view" | "list";
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  count?: number;
  countVariant?: "danger";
  color?: string;
  onClick?: () => void;
  onDelete?: () => void;
  onRename?: () => void;
}

function SidebarItem({
  id,
  type = "view",
  label,
  icon,
  active = false,
  count,
  countVariant,
  color,
  onClick,
  onDelete,
  onRename,
}: SidebarItemProps) {
  const isDefaultList = ["personal", "work", "study", "wishlist"].includes(
    id.trim().toLowerCase(),
  );

  return (
    <div
      onClick={onClick}
      className={`group flex w-full cursor-pointer font-medium items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition ${
        active
          ? "bg-primary/10 text-foreground"
          : "text-foreground/70 hover:bg-surface-hover hover:text-foreground"
      }`}
    >
      <span
        className={`relative flex h-4 w-4 items-center justify-center ${
          active ? "text-primary" : "text-muted"
        }`}
      >
        <span className={`[&>svg]:h-[15px] [&>svg]:w-[15px] ${color}`}>
          {icon}
        </span>
      </span>

      <span className="flex-1 text-left">{label}</span>

      <div className="flex items-center gap-2">
        {type === "list" && !isDefaultList && (
          <ListMenu onDelete={onDelete!} onRename={onRename!} />
        )}
        {count !== undefined && count > 0 && (
          <span
            className={`text-[11px] tabular-nums px-2 py-0.5 rounded-full ${
              countVariant === "danger"
                ? "bg-red-500 text-foreground"
                : "text-foreground/70 bg-muted/20"
            }`}
          >
            {count}
          </span>
        )}
      </div>
    </div>
  );
}
