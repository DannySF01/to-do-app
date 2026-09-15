import { useEffect, useMemo, useState } from "react";
import type { List } from "../types/types";
import { useTranslation } from "react-i18next";

interface StoredList {
  id: string;
  name?: string;
  color: string;
  isDefault?: boolean;
}

const DEFAULT_LIST_META: Omit<StoredList, "name">[] = [
  { id: "personal", color: "text-violet-500", isDefault: true },
  { id: "work", color: "text-blue-500", isDefault: true },
  { id: "study", color: "text-amber-500", isDefault: true },
  { id: "wishlist", color: "text-rose-500", isDefault: true },
];

export function useLists() {
  const { t } = useTranslation();

  const resolveName = useMemo(
    () =>
      (list: StoredList): List => ({
        ...list,
        name: list.isDefault
          ? t(`lists.default.${list.id}`)
          : (list.name ?? ""),
      }),
    [t],
  );

  const defaultLists = useMemo<StoredList[]>(() => DEFAULT_LIST_META, []);

  const [storedLists, setStoredLists] = useState<StoredList[]>(defaultLists);

  useEffect(() => {
    const stored = localStorage.getItem("lists");
    if (!stored) return;

    try {
      const parsed: StoredList[] = JSON.parse(stored);
      setStoredLists(parsed);
    } catch {
      console.error("Failed to load lists");
    }
  }, []);

  const lists = useMemo(
    () => storedLists.map(resolveName),
    [storedLists, resolveName],
  );

  const persistLists = (updated: StoredList[]) => {
    localStorage.setItem("lists", JSON.stringify(updated));
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

    const newList: StoredList = {
      id: trimmedName.toLowerCase(),
      name: trimmedName,
      color: "text-muted",
    };

    setStoredLists((prev) => {
      const updated = [...prev, newList];
      persistLists(updated);
      return updated;
    });

    return { success: true as const };
  };

  const editList = (id: string, name: string) => {
    const target = storedLists.find((list) => list.id === id);
    if (target?.isDefault) {
      return { success: false, reason: "default" as const };
    }

    setStoredLists((prev) => {
      const updated = prev.map((list) =>
        list.id === id ? { ...list, name } : list,
      );
      persistLists(updated);
      return updated;
    });

    return { success: true as const };
  };

  const removeList = (id: string) => {
    const target = storedLists.find((list) => list.id === id);
    if (target?.isDefault) {
      return { success: false, reason: "default" as const };
    }

    setStoredLists((prev) => {
      const updated = prev.filter((list) => list.id !== id);
      persistLists(updated);
      return updated;
    });

    return { success: true as const };
  };

  return {
    lists,
    addList,
    editList,
    removeList,
  };
}
