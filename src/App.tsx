import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Plus } from "lucide-react";
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
import { EmptyState } from "./components/EmptyState";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";

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

  const { t } = useTranslation();

  function handleAdd(task: Task) {
    addTask(task);
  }

  function handleEdit(task: Task) {
    editTask(task.id, task);
  }

  function handleDuplicate(task: Task) {
    addTask({ ...task, id: crypto.randomUUID() });
  }

  const welcomeMessage = () => {
    const name = "Daniel";
    let message;
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      message = t("greeting.morning");
    } else if (hours >= 12 && hours < 18) {
      message = t("greeting.afternoon");
    } else {
      message = t("greeting.evening");
    }
    return message + ", " + name + "! 👋";
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
      t("lists.deleteList"),
      t("lists.deleteListConfirmDescription"),
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
                  {welcomeMessage()}
                </h1>
                <p className="text-muted text-sm md:text-xs capitalize">
                  {new Date().toLocaleDateString(i18n.language, {
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
                <span className="font-medium text-sm flex items-center gap-2 pr-0.5">
                  <Plus size={18} strokeWidth={2} />
                  {t("newTask")}
                </span>
              </button>
            </div>

            <div className="space-y-6 pb-26 flex-1">
              <AnimatePresence mode="popLayout">
                {filteredTasks.length === 0 ? (
                  <EmptyState
                    title={t("emptyState.noTasks.title")}
                    description={t("emptyState.noTasks.description")}
                  />
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
                          {activeTasks.length} {t("views.active")}
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
                          {completedTasks.length} {t("views.completed")}
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

                    {completedTasks.length === 0 && view === "completed" && (
                      <EmptyState
                        icon={CheckCircle2}
                        title={t("emptyState.noCompleted.title")}
                        description={t("emptyState.noCompleted.description")}
                      />
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
