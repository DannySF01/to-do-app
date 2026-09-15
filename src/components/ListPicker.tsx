import { Folder, Plus } from "lucide-react";
import TaskPicker from "./TaskPicker";
import type { List } from "../types/types";
import { t } from "i18next";

interface ListPickerProps {
  lists: List[] | [];
  label: string;
  value: string | undefined;
  onCreateList: () => void;
  onChange: (value: string | undefined) => void;
  onClose: () => void;
}

export default function ListPicker({
  lists,
  label,
  value,
  onCreateList,
  onChange,
  onClose,
}: ListPickerProps) {
  return (
    <TaskPicker
      title={label}
      icon={<Folder size={18} />}
      selected={lists.find((list) => list.id === value)?.name}
      onClose={onClose}
    >
      <div className="space-y-1">
        {lists.map((list) => (
          <button
            key={list.id}
            type="button"
            onClick={() => {
              onChange(list.id);
              onClose();
            }}
            className={`
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-2
              text-left
              text-sm
              transition
              ${value === list.id ? "bg-muted/10 font-medium" : "hover:bg-muted/5"}
            `}
          >
            <span className={`flex h-5 w-5 items-center ${list.color}`}>
              <Folder size={17} />
            </span>

            <span className="flex-1">{list.name}</span>

            {value === list.id && (
              <span className="text-xs">{t("common.selected")}</span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={onCreateList}
        type="button"
        className="
          mt-4
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-dashed
          border-muted
          px-4
          py-3
          text-sm
          font-medium
          hover:bg-muted/10
        "
      >
        <Plus size={17} />
        {t("lists.newListTitle")}
      </button>
    </TaskPicker>
  );
}
