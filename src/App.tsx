import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  CheckCircle2,
  Heart,
  LayoutDashboard,
  ListChecks,
  ListTodo,
  Plus,
  User,
} from "lucide-react";
import { useTasks } from "./hooks/useTasks";
import TaskItem from "./components/TaskItem";
import { useNotifications } from "./hooks/useNotifications";
import type { List, Task, TFilters } from "./types/types";
import Sidebar from "./components/Sidebar";
import CreateTask from "./components/CreateTask";

export default function App() {
  const { tasks, addTask, toggleTask, removeTask, getFilteredTasks } =
    useTasks();

  const { requestPermission, sendSystemNotification } = useNotifications();

  const [selectedList, setSelectedList] = useState("");

  const [filter, setFilter] = useState<TFilters>("overview");

  const [lists, setLists] = useState<List[]>([
    {
      id: "personal",
      name: "Personal",
      icon: <User />,
      color: "text-violet-500",
    },
    {
      id: "work",
      name: "Work",
      icon: <Briefcase />,
      color: "text-blue-500",
    },
    {
      id: "study",
      name: "Study",
      icon: <BookOpen />,
      color: "text-amber-500",
    },
    {
      id: "wishlist",
      name: "Wishlist",
      icon: <Heart />,
      color: "text-rose-500",
    },
  ]);

  const filteredTasks = useMemo(
    () => getFilteredTasks(selectedList),
    [tasks, selectedList],
  );

  const activeTasks = filteredTasks.filter((t) => t.completed === false);
  const completedTasks = filteredTasks.filter((t) => t.completed === true);

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const handleAdd = (task: Task) => {
    addTask(task);
    requestPermission();
  };

  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = new Date();

      tasks.forEach((task) => {
        if (task.date && task.completed) {
          const dueDate = new Date(task.date);

          if (
            dueDate.getTime() <= now.getTime() &&
            dueDate.getTime() > now.getTime() - 60000
          ) {
            sendSystemNotification("Tarefa Pendente!", task.text);
          }
        }
      });
    }, 60000);

    return () => clearInterval(checkInterval);
  }, [tasks]);

  const welcomeMessage = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      return "Good Morning";
    } else if (hours >= 12 && hours < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar
        lists={lists}
        setLists={setLists}
        filter={filter}
        setFilter={setFilter}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
        tasks={tasks}
        numActiveTasks={activeTasks.length}
        numCompletedTasks={completedTasks.length}
      />
      <div className="w-full max-w-4xl space-y-6 py-16 md:py-8 md:px-12 px-6 font-medium">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-lg tracking-tight">
              {welcomeMessage()}, Daniel! 👋
            </h1>
            <p className="text-muted text-sm md:text-xs capitalize">
              {new Date().toLocaleDateString("pt-PT", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>

          <button
            onClick={() => setIsCreateTaskOpen(true)}
            className="btn-primary p-4 rounded-full absolute bottom-24 right-6 md:p-2 md:static z-10"
          >
            <Plus size={22} strokeWidth={2} className="md:hidden" />

            <span className="font-medium text-sm hidden md:flex items-center gap-2 px-1">
              <Plus size={18} strokeWidth={2} />
              New Task
            </span>
          </button>
        </div>

        {isCreateTaskOpen && (
          <CreateTask
            lists={lists}
            onSave={handleAdd}
            onClose={() => setIsCreateTaskOpen(false)}
          />
        )}

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center py-12 text-muted"
              >
                <ListChecks size={32} className="mb-2 opacity-20" />
                <p className="text-sm">
                  No {filter !== "overview" ? filter : ""} tasks
                </p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {activeTasks.length > 0 && filter !== "completed" && (
                  <motion.div
                    key="active"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-1"
                  >
                    <div className="mb-3 text-muted text-[11px] tracking-wide font-bold uppercase">
                      Active - {activeTasks.length}
                    </div>
                    {activeTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onEdit={() => {}}
                        onMove={() => {}}
                        onRemove={removeTask}
                      />
                    ))}
                  </motion.div>
                )}

                {completedTasks.length > 0 && filter !== "active" && (
                  <motion.div
                    key="completed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="mb-3 text-muted text-[11px] tracking-wide font-bold uppercase">
                      Completed - {completedTasks.length}
                    </div>
                    <div className="space-y-1 opacity-70">
                      {completedTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggle={toggleTask}
                          onEdit={() => {}}
                          onMove={() => {}}
                          onRemove={removeTask}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <MobileNav onClick={(e) => setFilter(e)} active={filter} />
    </div>
  );
}

const MobileNav = ({
  onClick,
  active,
}: {
  onClick: (value: TFilters) => void;
  active: string;
}) => {
  const NavButton = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick?: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 transition-colors duration-300 text-sm ${active ? "text-primary" : "text-muted"}`}
    >
      {children}
    </button>
  );
  return (
    <div className="fixed bg-surface border-t border-border px-12 py-4 w-full bottom-0 flex font-medium justify-between gap-6 md:hidden">
      <NavButton
        onClick={() => onClick("overview")}
        active={active === "overview"}
      >
        <LayoutDashboard size={20} strokeWidth={2} />
        <span>Overview</span>
      </NavButton>
      <NavButton onClick={() => onClick("active")} active={active === "active"}>
        <ListTodo size={20} strokeWidth={2} /> <span>Active</span>
      </NavButton>
      <NavButton
        onClick={() => onClick("completed")}
        active={active === "completed"}
      >
        <CheckCircle2 size={20} strokeWidth={2} /> <span>Completed</span>
      </NavButton>
    </div>
  );
};
