import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListChecks, Plus } from "lucide-react";
import { useTasks } from "./hooks/useTasks";
import TaskItem from "./components/TaskItem";
import { useNotifications } from "./hooks/useNotifications";
import type { List, Task, TView } from "./types/types";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import TaskModal from "./components/TaskModal";
import { useSidebarSwipe } from "./hooks/useSidebarSwipe";
import FeedbackModal from "./components/FeedbackModal";
import { useFeedback } from "./hooks/useFeedback";
import { useLists } from "./hooks/useLists";
import ListModal from "./components/ListModal";
import Settings from "./components/Settings";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { tasks, addTask, editTask, toggleTask, removeTask, getFilteredTasks } =
    useTasks();

  useNotifications();

  const [selectedList, setSelectedList] = useState("");

  const [view, setView] = useState<TView>("overview");

  const { lists, addList, editList, removeList } = useLists();

  const filteredTasks = useMemo(
    () => getFilteredTasks(selectedList),
    [tasks, selectedList],
  );

  const activeTasks = filteredTasks.filter((t) => t.completed === false);
  const completedTasks = filteredTasks.filter((t) => t.completed === true);

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { feedback, showFeedback, hideFeedback } = useFeedback();

  const [listToDelete, setListToDelete] = useState<List | null>(null);

  const [listModal, setListModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    list: List | null;
  }>({
    open: false,
    mode: "create",
    list: null,
  });

  function handleAdd(task: Task) {
    addTask(task);
    //requestPermission();
  }

  function handleEdit(task: Task) {
    editTask(task.id, task);
  }

  function handleDuplicate(task: Task) {
    addTask({ ...task, id: crypto.randomUUID() });
  }

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

  useTheme();

  const handleSaveList = (name: string) => {
    if (listModal.mode === "create") {
      return addList(name);
    }

    if (listModal.list) {
      return editList(listModal.list.id, name);
    }
  };

  const handleDeleteList = (list: List) => {
    showFeedback(
      "Remove List",
      "Are you sure you want to remove this list? This action cannot be undone.",
      "warning",
    );
    setListToDelete(list);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        lists={lists}
        view={view}
        setView={setView}
        onCreateList={() =>
          setListModal({ open: true, mode: "create", list: null })
        }
        onEditList={(list) => setListModal({ open: true, mode: "edit", list })}
        onDeleteList={(list) => handleDeleteList(list)}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
        tasks={tasks}
        numActiveTasks={activeTasks.length}
        numCompletedTasks={completedTasks.length}
      />

      <main className="min-w-0 flex-1 h-screen overflow-y-auto touch-pan-y">
        {view === "settings" ? (
          <Settings onBack={() => setView("overview")} />
        ) : (
          <div className="w-full max-w-4xl space-y-6 px-6 pt-18 font-medium md:px-12 md:py-8">
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

            <div className="space-y-6 pb-26 flex-1">
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
                      No {view !== "overview" ? view : ""} tasks
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {activeTasks.length > 0 && view !== "completed" && (
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

                    {completedTasks.length > 0 && view !== "active" && (
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
        )}
      </main>

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

      <MobileNav
        active={view}
        onHome={() => setView("overview")}
        onTasks={() => setView("active")}
        onCalendar={() => {}}
        onSettings={() => setView("settings")}
        onAddTask={() => setIsCreateTaskOpen(true)}
      />
      <FeedbackModal
        open={feedback.open}
        title={feedback.title}
        message={feedback.message}
        type={feedback.type}
        onClose={hideFeedback}
        onConfirm={() => {
          if (!listToDelete) return;
          removeList(listToDelete.id);
          if (selectedList === listToDelete.id) {
            setSelectedList("");
          }
        }}
      />
      <ListModal
        open={listModal.open}
        mode={listModal.mode}
        initialName={listModal.list?.name ?? ""}
        onClose={() =>
          setListModal((prev) => ({
            ...prev,
            open: false,
          }))
        }
        onSave={handleSaveList}
      />
    </div>
  );
}
