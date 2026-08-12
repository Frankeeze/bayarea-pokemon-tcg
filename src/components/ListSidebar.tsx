"use client";

import { useState } from "react";
import type { CardList } from "@/types";
import { formatPrice } from "@/lib/pricing";

interface Props {
  lists: CardList[];
  activeListId: string | null;
  totalValue: number;
  cardCount: number;
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export default function ListSidebar({
  lists,
  activeListId,
  totalValue,
  cardCount,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: Props) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  function handleCreate() {
    if (!newName.trim()) return;
    onCreate(newName.trim());
    setNewName("");
  }

  function startEdit(list: CardList) {
    setEditingId(list.id);
    setEditValue(list.name);
  }

  function commitEdit() {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
  }

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <h2 className="text-sm font-semibold text-zinc-300 mb-3">Your Lists</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="New list name"
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-yellow-500/50"
          />
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-md bg-zinc-700 px-3 py-1.5 text-sm text-white hover:bg-zinc-600"
          >
            +
          </button>
        </div>

        <ul className="space-y-1">
          {lists.map((list) => (
            <li key={list.id}>
              {editingId === list.id ? (
                <div className="flex gap-1">
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEdit();
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="flex-1 rounded border border-yellow-500/50 bg-zinc-950 px-2 py-1 text-sm text-white"
                  />
                </div>
              ) : (
                <div
                  className={`flex items-center gap-1 rounded-lg px-2 py-1.5 cursor-pointer group ${
                    activeListId === list.id
                      ? "bg-yellow-500/15 text-yellow-400"
                      : "hover:bg-zinc-800 text-zinc-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(list.id)}
                    className="flex-1 text-left text-sm truncate"
                  >
                    {list.name}
                    <span className="ml-1 text-xs opacity-60">
                      ({list.cardIds.length})
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(list)}
                    className="opacity-0 group-hover:opacity-100 text-xs text-zinc-500 hover:text-white px-1"
                    title="Rename"
                  >
                    ✎
                  </button>
                  {lists.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDelete(list.id)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-red-500 hover:text-red-400 px-1"
                      title="Delete"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {activeListId && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Active list</p>
          <p className="text-lg font-semibold text-white mt-1">
            {cardCount} cards
          </p>
          <p className="text-yellow-400 font-medium mt-1">
            ~{formatPrice(totalValue)}
          </p>
          <p className="text-[11px] text-zinc-600 mt-1">
            Estimated total (POC)
          </p>
        </div>
      )}
    </aside>
  );
}
