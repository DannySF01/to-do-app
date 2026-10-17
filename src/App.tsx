import { useState, useMemo } from "react";
import { CheckCircle2, Menu, Plus } from "lucide-react";
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
import Calendar from "./components/Calendar";
import { groupTasksByDate } from "./utils/groupTasksByDate";
import { AnimatePresence, motion } from "motion/react";

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

  const [listModal, setListModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    list: List | null;
  }>({
    open: false,
    mode: "create",
    list: null,
  });

  type PendingAction =
    | { type: "deleteList"; list: List }
    | { type: "eraseData" }
    | null;

  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

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
    setPendingAction({ type: "deleteList", list });
  };

  const handleEraseData = () => {
    showFeedback(
      t("settings.dataStorage.eraseData"),
      t("settings.dataStorage.eraseDataConfirm"),
      "warning",
    );
    setPendingAction({ type: "eraseData" });
  };

  const handleFeedbackConfirm = () => {
    if (pendingAction?.type === "deleteList") {
      removeList(pendingAction.list.id);
      if (selectedList === pendingAction.list.id) setSelectedList("");
    } else if (pendingAction?.type === "eraseData") {
      localStorage.clear();
      window.location.reload();
    }
    setPendingAction(null);
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
        numLateTasks={groupTasksByDate(tasks).overdue.length}
      />
      {/* Mobile sidebar button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="z-40 absolute top-4 left-4
                flex h-12 w-12 items-center justify-center
                rounded-xl border border-border
                bg-surface text-foreground
                shadow-sm
                md:hidden
                "
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <main className="min-w-0 flex-1 h-screen overflow-y-auto touch-pan-y py-4 md:px-4 md:py-8">
        {view === "settings" ? (
          <Settings onErase={() => handleEraseData()} />
        ) : view === "calendar" ? (
          <Calendar tasks={tasks} onToggleComplete={toggleTask} />
        ) : (
          <div className="w-full max-w-4xl space-y-6 px-6 font-medium">
            <div className="flex justify-center items-center text-center pb-4 gap-4 border-b-2 border-border md:text-start md:justify-start">
              {/* Greeting */}
              <div className="space-y-1">
                <h1 className="text-xl font-semibold tracking-tight">
                  {welcomeMessage()}
                </h1>
                <p className="text-muted font-medium text-xs md:text-xs capitalize">
                  {new Date().toLocaleDateString(i18n.language, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
              {/* New task button */}
              <button
                onClick={() => setIsCreateTaskOpen(true)}
                className="btn-primary h-10 p-2 hidden md:block md:ml-auto"
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
                        <div className="flex items-center mb-3 gap-2">
                          <span className="capitalize">
                            {selectedList || t("views.overview")}
                          </span>
                          <span className="text-muted text-sm">|</span>
                          <div className="text-muted text-[11px] tracking-wide font-bold lowercase">
                            {activeTasks.length} {t("views.active")}
                          </div>
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
                        <div className="space-y-1">
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
          onCreateList={() =>
            setListModal({ open: true, mode: "create", list: null })
          }
        />
      )}

      {editingTask && (
        <TaskModal
          mode="edit"
          task={editingTask}
          lists={lists}
          onSave={handleEdit}
          onCreateList={() =>
            setListModal({ open: true, mode: "create", list: null })
          }
          onClose={() => setEditingTask(null)}
        />
      )}

      <MobileNav
        active={view}
        onHome={() => setView("overview")}
        onTasks={() => setView("active")}
        onCalendar={() => setView("calendar")}
        onSettings={() => setView("settings")}
        onAddTask={() => setIsCreateTaskOpen(true)}
      />
      <FeedbackModal
        open={feedback.open}
        title={feedback.title}
        message={feedback.message}
        type={feedback.type}
        onClose={hideFeedback}
        onConfirm={handleFeedbackConfirm}
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
