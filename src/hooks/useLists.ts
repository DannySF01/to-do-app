import { useEffect, useState } from "react";
import type { List } from "../types/types";

const DEFAULT_LISTS: List[] = [
  {
    id: "personal",
    name: "Personal",
    color: "text-violet-500",
  },
  {
    id: "work",
    name: "Work",
    color: "text-blue-500",
  },
  {
    id: "study",
    name: "Study",
    color: "text-amber-500",
  },
  {
    id: "wishlist",
    name: "Wishlist",
    color: "text-rose-500",
  },
];

export function useLists() {
  const [lists, setLists] = useState<List[]>(DEFAULT_LISTS);

  useEffect(() => {
    const stored = localStorage.getItem("lists");

    if (!stored) return;

    try {
      const parsed: List[] = JSON.parse(stored);
      setLists(parsed);
    } catch {
      console.error("Failed to load lists");
    }
  }, []);

  const persistLists = (lists: List[]) => {
    localStorage.setItem("lists", JSON.stringify(lists));
  };

  const addList = (name: string) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return { success: false, reason: "empty" as const };
    }

    const exists = lists.some(
      (list) => list.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (exists) {
      return { success: false, reason: "exists" as const };
    }

    const newList: List = {
      id: trimmedName.toLowerCase(),
      name: trimmedName,
      color: "text-muted",
    };

    setLists((prev) => {
      const updated = [...prev, newList];
      persistLists(updated);
      return updated;
    });

    return { success: true as const };
  };

  const editList = (id: string, name: string) => {
    setLists((prev) => {
      const updated = prev.map((list) =>
        list.id === id ? { ...list, name } : list,
      );
      persistLists(updated);
      return updated;
    });
  };

  const removeList = (id: string) => {
    setLists((prev) => {
      const updated = prev.filter((list) => list.id !== id);
      persistLists(updated);
      return updated;
    });
  };

  return {
    lists,
    addList,
    editList,
    removeList,
  };
}
