import type { CardList, StoredLists } from "@/types";

const STORAGE_KEY = "bayarea-pokemon-lists-v1";

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function loadLists(): StoredLists {
  if (typeof window === "undefined") {
    return { lists: [], activeListId: null };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaultList: CardList = {
        id: createId(),
        name: "My Collection",
        cardIds: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const initial: StoredLists = { lists: [defaultList], activeListId: defaultList.id };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw) as StoredLists;
  } catch {
    return { lists: [], activeListId: null };
  }
}

export function saveLists(data: StoredLists) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function createList(name: string): CardList {
  return {
    id: createId(),
    name: name.trim() || "Untitled List",
    cardIds: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function addCardToList(lists: StoredLists, listId: string, cardId: string): StoredLists {
  const next = {
    ...lists,
    lists: lists.lists.map((list) => {
      if (list.id !== listId) return list;
      if (list.cardIds.includes(cardId)) return list;
      return {
        ...list,
        cardIds: [...list.cardIds, cardId],
        updatedAt: Date.now(),
      };
    }),
  };
  saveLists(next);
  return next;
}

export function removeCardFromList(lists: StoredLists, listId: string, cardId: string): StoredLists {
  const next = {
    ...lists,
    lists: lists.lists.map((list) => {
      if (list.id !== listId) return list;
      return {
        ...list,
        cardIds: list.cardIds.filter((id) => id !== cardId),
        updatedAt: Date.now(),
      };
    }),
  };
  saveLists(next);
  return next;
}

export function renameList(lists: StoredLists, listId: string, name: string): StoredLists {
  const next = {
    ...lists,
    lists: lists.lists.map((list) =>
      list.id === listId
        ? { ...list, name: name.trim() || list.name, updatedAt: Date.now() }
        : list
    ),
  };
  saveLists(next);
  return next;
}

export function deleteList(lists: StoredLists, listId: string): StoredLists {
  const remaining = lists.lists.filter((l) => l.id !== listId);
  const next: StoredLists = {
    lists: remaining,
    activeListId:
      lists.activeListId === listId
        ? remaining[0]?.id ?? null
        : lists.activeListId,
  };
  saveLists(next);
  return next;
}

export function setActiveList(lists: StoredLists, listId: string): StoredLists {
  const next = { ...lists, activeListId: listId };
  saveLists(next);
  return next;
}
