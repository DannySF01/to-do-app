import {
  CheckCircle2,
  ChevronDown,
  LayoutDashboard,
  Plus,
  Settings,
  ListCheck,
  MonitorDown,
  Moon,
  Sun,
  ListTodo,
  Menu,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { List, Task, TFilters } from "../types/types";
import { useTheme } from "../hooks/useTheme";
import { usePWA } from "../hooks/usePWA";
import { motion } from "motion/react";

interface SidebarProps {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<TFilters>>;
  selectedList: string;
  setSelectedList: React.Dispatch<React.SetStateAction<string>>;
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  tasks: Task[];
  numCompletedTasks: number;
  numActiveTasks: number;
}

export default function Sidebar({
  filter,
  setFilter,
  selectedList,
  setSelectedList,
  lists,
  setLists,
  tasks,
  numActiveTasks,
  numCompletedTasks,
}: SidebarProps) {
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { isInstallable, install } = usePWA();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  function createList(name: string, color: string) {
    const newList = {
      id: crypto.randomUUID(),
      name,
      icon: <ListCheck />,
      color,
    } as List;

    setLists((prev) => [...prev, newList]);

    localStorage.setItem("lists", JSON.stringify(lists));
  }

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
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

      {/* Edge swipe zone */}
      {!isOpen && (
        <motion.div
          className="fixed inset-y-0 left-0 z-30 w-6 md:hidden"
          drag="x"
          dragConstraints={{ left: 0, right: 80 }}
          dragElastic={0}
          onDragEnd={(_, info) => {
            if (info.offset.x > 50 || info.velocity.x > 300) {
              setIsOpen(true);
            }
          }}
        />
      )}

      {/* Mobile overlay outside the sidebar that closes it */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="
          fixed inset-0 z-40
          bg-black/40
          backdrop-blur-[2px]
          md:hidden
        "
          aria-label="Close sidebar"
        />
      )}

      <motion.div
        className="fixed left-0 top-0 bottom-0 z-30 w-5 md:hidden"
        drag="x"
        dragConstraints={{ left: 0, right: 280 }}
        dragElastic={0}
        onDragEnd={(_, info) => {
          if (info.offset.x > 80 || info.velocity.x > 500) {
            setIsOpen(true);
          }
        }}
      />

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface px-3 py-4 transition-transform duration-300 ease-out md:static md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        initial={false}
        animate={{ x: isMobile ? (isOpen ? 0 : "-100%") : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        drag={isMobile ? "x" : false}
        dragConstraints={{ left: -256, right: 0 }}
        dragElastic={0.05}
        onDragEnd={(_, info) => {
          if (info.offset.x < -70 || info.velocity.x < -400) {
            setIsOpen(false);
          }
        }}
      >
        <div className="mb-6 flex items-center justify-between px-2">
          <h1 className="text-lg font-semibold tracking-[-0.01em]">
            To-Do App
          </h1>
          <div className="flex items-center gap-3">
            {isInstallable && (
              <button
                onClick={install}
                className="btn text-muted hover:text-foreground"
              >
                <MonitorDown size={18} />
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="btn text-muted hover:text-foreground"
            >
              {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wide text-muted">
              Views
            </p>

            <nav className="space-y-0.5">
              <SidebarItem
                active={filter === "overview"}
                icon={<LayoutDashboard />}
                label="Overview"
                onClick={() => setFilter("overview")}
              />
              <SidebarItem
                active={filter === "active"}
                icon={<ListTodo />}
                label="Active"
                count={numActiveTasks}
                onClick={() => setFilter("active")}
              />
              <SidebarItem
                active={filter === "completed"}
                icon={<CheckCircle2 />}
                label="Completed"
                count={numCompletedTasks}
                onClick={() => setFilter("completed")}
              />
            </nav>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between px-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                Lists
              </p>

              <button
                className="text-muted transition hover:text-primary px-1"
                onClick={() => setIsAddingList(true)}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <nav className="space-y-0.5">
              {lists.map((list) => (
                <SidebarItem
                  key={list.id}
                  icon={list.icon}
                  color={list.color}
                  label={list.name}
                  count={tasks.filter((task) => task.list === list.id).length}
                  active={selectedList === list.id}
                  onClick={() => {
                    if (selectedList === list.id) setSelectedList("");
                    else setSelectedList(list.id);
                  }}
                />
              ))}
            </nav>
          </section>
        </div>

        {isAddingList && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = newListName.trim();
              if (!name) return;
              createList(name, "text-violet-500");
              setNewListName("");
              setIsAddingList(false);
            }}
            className="mt-2"
          >
            <input
              autoFocus
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onBlur={() => {
                if (!newListName.trim()) {
                  setIsAddingList(false);
                }
              }}
              placeholder="List name..."
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition placeholder:text-muted "
            />
          </form>
        )}

        <div className="flex-1" />

        <div className="space-y-2 border-t border-border pt-3">
          <SidebarItem icon={<Settings />} label="Settings" />

          <button className="group flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-muted/5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-semibold text-zinc-600 ring-1 ring-zinc-200">
              DF
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium">Daniel</p>

              <p className="truncate text-[11px] text-muted">Free account</p>
            </div>

            <ChevronDown className="h-3.5 w-3.5 text-muted transition group-hover:text-zinc-600" />
          </button>
        </div>
      </motion.aside>
    </>
  );
}

function SidebarItem({
  label,
  icon,
  active = false,
  count,
  color,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  count?: number;
  color?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full font-medium items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition ${
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

      {count !== undefined && (
        <span className="text-[11px] tabular-nums text-foreground/70 bg-muted/20 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}
