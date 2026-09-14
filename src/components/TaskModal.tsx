import {
  X,
  CalendarDays,
  Clock3,
  Flag,
  Folder,
  Repeat2,
  Bell,
} from "lucide-react";
import { useState } from "react";
import Toggle from "./Toggle";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import PriorityPicker from "./PriorityPicker";
import ListPicker from "./ListPicker";
import RepeatPicker from "./RepeatPicker";
import type { List, Task, TaskPriority, TaskRepeat } from "../types/types";
import { t } from "i18next";

interface CreateTaskProps {
  mode: "create" | "edit";
  task?: Task;
  lists: List[];
  onSave: (task: Task) => void;
  onClose: () => void;
}

export default function TaskModal({
  mode,
  task,
  lists,
  onSave,
  onClose,
}: CreateTaskProps) {
  const [input, setInput] = useState(task?.text || "");
  const [toggleReminder, setToggleReminder] = useState(false);

  const [taskId] = useState(task?.id || "");
  const [date, setDate] = useState(task?.date || "");
  const [time, setTime] = useState(task?.time || "");
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority || "none",
  );
  const [list, setList] = useState<List["id"] | undefined>(
    task?.list || undefined,
  );
  const [repeat, setRepeat] = useState<TaskRepeat>(task?.repeat || "no");

  const options = [
    {
      icon: CalendarDays,
      key: "Date",
      component: (
        <DatePicker
          label={t("task.dateLabel")}
          value={date}
          onChange={(e) => setDate(e || "")}
          onClose={() => {}}
        />
      ),
    },
    {
      icon: Clock3,
      key: "Time",
      component: (
        <TimePicker
          label={t("task.timeLabel")}
          value={time}
          onChange={(e) => setTime(e || "")}
          onClose={() => {}}
        />
      ),
    },
    {
      icon: Flag,
      key: "Priority",
      component: (
        <PriorityPicker
          label={t("task.priorityLabel")}
          value={priority}
          onChange={(e) => setPriority(e)}
          onClose={() => {}}
        />
      ),
    },
    {
      icon: Folder,
      key: "List",
      component: (
        <ListPicker
          label={t("task.listLabel")}
          lists={lists}
          value={list}
          onChange={(e) => setList(e)}
          onClose={() => {}}
        />
      ),
    },
    {
      icon: Repeat2,
      key: "Repeat",
      component: (
        <RepeatPicker
          label={t("task.repeatLabel")}
          value={repeat}
          onChange={(e) => setRepeat(e)}
          onClose={() => {}}
        />
      ),
    },
  ];

  const handleSave = () => {
    const task: Task = {
      id: taskId || crypto.randomUUID(),
      text: input,
      reminder: toggleReminder,
      date,
      time,
      priority,
      list,
      repeat,
      completed: false,
    };
    onSave(task);
    onClose();
  };

  return (
    <div className="fixed h-full inset-0 z-50 flex items-end justify-center bg-black/20 backdrop-blur-[2px] sm:items-center">
      <div
        className="
          w-full
          max-w-xl
          overflow-hidden
          rounded-t-3xl
          bg-surface
          shadow-2xl
          sm:rounded-3xl
        "
      >
        <header className="flex h-16 items-center justify-between border-b border-border-strong px-5">
          <button
            onClick={onClose}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full
              transition
              hover:text-muted
            "
          >
            <X size={22} strokeWidth={2} />
          </button>

          <h1 className="text-[17px] font-semibold tracking-[-0.02em]">
            {t("task.newTask")}
          </h1>

          <button
            onClick={handleSave}
            disabled={!input.trim()}
            className="btn-primary"
          >
            {mode === "edit" ? t("common.update") : t("common.save")}
          </button>
        </header>

        <div className="max-h-[85vh] overflow-y-auto px-5 pb-8">
          <textarea
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            placeholder={t("task.placeholder")}
            value={input}
            className="mt-7
              w-full
              resize-none
              bg-transparent
              text-[20px]
              font-medium
              tracking-[-0.02em]
              outline-none
              placeholder:text-muted
            "
          />

          <div className="mt-3 overflow-hidden">
            {options.map((option) => {
              return (
                <div key={option.key} className="mt-3">
                  {option.component}
                </div>
              );
            })}
          </div>

          <button
            className="
          mt-3
          flex w-full items-center gap-3
          rounded-xl
          border border-border
          p-4
          text-left
          transition
          hover:bg-muted/5
        "
          >
            <span className="flex h-9 w-9 items-center justify-center text-primary rounded-full bg-muted/10">
              <Bell size={18} />
            </span>

            <span className="flex-1 text-sm font-medium">
              {t("task.reminderLabel")}
            </span>

            <Toggle checked={toggleReminder} onChange={setToggleReminder} />
          </button>
        </div>
      </div>
    </div>
  );
}
