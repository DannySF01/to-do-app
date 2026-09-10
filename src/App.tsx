import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  Heart,
  ListChecks,
  Plus,
  User,
} from "lucide-react";
import { useTasks } from "./hooks/useTasks";
import TaskItem from "./components/TaskItem";
import { useNotifications } from "./hooks/useNotifications";
import type { List, Task, TFilters } from "./types/types";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import TaskModal from "./components/TaskModal";
import { useSidebarSwipe } from "./hooks/useSidebarSwipe";

export default function App() {
  const { tasks, addTask, editTask, toggleTask, removeTask, getFilteredTasks } =
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
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleAdd(task: Task) {
    addTask(task);
    requestPermission();
  }

  function handleEdit(task: Task) {
    editTask(task.id, task);
  }

  function handleDuplicate(task: Task) {
    addTask({ ...task, id: crypto.randomUUID() });
  }

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

  useSidebarSwipe({
    onOpen: () => setSidebarOpen(true),
    enabled: !sidebarOpen,
  });

  return (
    <div className="min-h-screen flex">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
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

      <div className="w-full max-w-4xl space-y-6 pt-18 md:py-8 md:px-12 px-6 font-medium touch-pan-y">
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
            className="btn-primary p-2 hidden md:block"
          >
            <span className="font-medium text-sm flex items-center gap-2 ">
              <Plus size={18} strokeWidth={2} />
              New Task
            </span>
          </button>
        </div>

        {isCreateTaskOpen && (
          <TaskModal
            mode="create"
            lists={lists}
            onSave={handleAdd}
            onClose={() => setIsCreateTaskOpen(false)}
          />
        )}

        {editingTask && (
          <TaskModal
            mode="edit"
            task={editingTask}
            lists={lists}
            onSave={handleEdit}
            onClose={() => setEditingTask(null)}
          />
        )}

        <div className="space-y-6 pb-6 h-full">
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
                      {activeTasks.length} Active
                    </div>
                    {activeTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onEdit={() => setEditingTask(task)}
                        onDuplicate={() => handleDuplicate(task)}
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
                      {completedTasks.length} Completed
                    </div>
                    <div className="space-y-1 opacity-70">
                      {completedTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggle={toggleTask}
                          onEdit={() => setEditingTask(task)}
                          onDuplicate={() => handleDuplicate(task)}
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
      <MobileNav
        onHome={() => setFilter("overview")}
        onTasks={() => setFilter("active")}
        onCalendar={() => {}}
        onSettings={() => {}}
        onAddTask={() => setIsCreateTaskOpen(true)}
      />
    </div>
  );
}
