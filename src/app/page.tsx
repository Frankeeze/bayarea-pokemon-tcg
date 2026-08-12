"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CardGrid from "@/components/CardGrid";
import CardModal from "@/components/CardModal";
import ListSidebar from "@/components/ListSidebar";
import CardCycler from "@/components/CardCycler";
import { searchCards, getCard, getCardsByIds } from "@/lib/tcgdex";
import {
  loadLists,
  createList,
  addCardToList,
  removeCardFromList,
  renameList,
  deleteList,
  setActiveList,
} from "@/lib/storage";
import { estimateListTotal } from "@/lib/pricing";
import type { Card, CardBrief, StoredLists } from "@/types";

type ViewMode = "search" | "cycle";

export default function HomePage() {
  const [stored, setStored] = useState<StoredLists>({ lists: [], activeListId: null });
  const [searchResults, setSearchResults] = useState<CardBrief[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [listCards, setListCards] = useState<Card[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [view, setView] = useState<ViewMode>("search");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStored(loadLists());
  }, []);

  const activeList = useMemo(
    () => stored.lists.find((l) => l.id === stored.activeListId) ?? null,
    [stored]
  );

  useEffect(() => {
    if (!activeList || activeList.cardIds.length === 0) {
      setListCards([]);
      return;
    }

    let cancelled = false;
    setListLoading(true);

    getCardsByIds(activeList.cardIds)
      .then((cards) => {
        if (!cancelled) {
          const ordered = activeList.cardIds
            .map((id) => cards.find((c) => c.id === id))
            .filter((c): c is Card => !!c);
          setListCards(ordered);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load list cards");
      })
      .finally(() => {
        if (!cancelled) setListLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeList]);

  const totalValue = useMemo(() => estimateListTotal(listCards), [listCards]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchLoading(true);
    setError(null);
    setView("search");
    try {
      const results = await searchCards(query);
      setSearchResults(results);
      if (results.length === 0) setError("No cards found. Try a different name.");
    } catch {
      setError("Search failed. Check your connection and try again.");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSelectCard = useCallback(async (id: string) => {
    setError(null);
    try {
      const card = await getCard(id);
      if (card) setSelectedCard(card);
    } catch {
      setError("Could not load card details");
    }
  }, []);

  const handleAdd = useCallback(
    (cardId: string) => {
      if (!stored.activeListId) return;
      setStored((prev) => addCardToList(prev, prev.activeListId!, cardId));
    },
    [stored.activeListId]
  );

  const handleRemove = useCallback(
    (cardId: string) => {
      if (!stored.activeListId) return;
      setStored((prev) => removeCardFromList(prev, prev.activeListId!, cardId));
      setSelectedCard((prev) => (prev?.id === cardId ? null : prev));
    },
    [stored.activeListId]
  );

  const isInActiveList = selectedCard
    ? activeList?.cardIds.includes(selectedCard.id) ?? false
    : false;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <ListSidebar
            lists={stored.lists}
            activeListId={stored.activeListId}
            totalValue={totalValue}
            cardCount={listCards.length}
            onSelect={(id) => setStored((prev) => setActiveList(prev, id))}
            onCreate={(name) => {
              const list = createList(name);
              setStored((prev) => {
                const next = {
                  lists: [...prev.lists, list],
                  activeListId: list.id,
                };
                if (typeof window !== "undefined") {
                  localStorage.setItem(
                    "bayarea-pokemon-lists-v1",
                    JSON.stringify(next)
                  );
                }
                return next;
              });
            }}
            onRename={(id, name) =>
              setStored((prev) => renameList(prev, id, name))
            }
            onDelete={(id) => setStored((prev) => deleteList(prev, id))}
          />

          <div className="flex-1 space-y-5 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <SearchBar onSearch={handleSearch} loading={searchLoading} />
              </div>
              <div className="flex rounded-lg border border-zinc-700 overflow-hidden text-sm">
                <button
                  type="button"
                  onClick={() => setView("search")}
                  className={`px-4 py-2 ${
                    view === "search"
                      ? "bg-yellow-500 text-zinc-950 font-semibold"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setView("cycle")}
                  className={`px-4 py-2 ${
                    view === "cycle"
                      ? "bg-yellow-500 text-zinc-950 font-semibold"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Cycle List
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {view === "search" ? (
              <CardGrid
                cards={searchResults}
                onSelect={handleSelectCard}
                onAdd={handleAdd}
                activeListName={activeList?.name}
              />
            ) : listLoading ? (
              <div className="py-20 text-center text-zinc-500">Loading list...</div>
            ) : (
              <CardCycler
                cards={listCards}
                listName={activeList?.name ?? "List"}
                onRemove={handleRemove}
                onSelect={(c) => setSelectedCard(c)}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-900 py-4 text-center text-xs text-zinc-600">
        Proof of Concept · Data from TCGdex · Lists stored locally in your browser
      </footer>

      <CardModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onAdd={handleAdd}
        onRemove={handleRemove}
        isInActiveList={isInActiveList}
      />
    </div>
  );
}
