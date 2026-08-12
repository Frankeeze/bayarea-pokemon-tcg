"use client";

import { useState, useEffect } from "react";
import type { Card } from "@/types";
import { getCardImageUrl } from "@/lib/tcgdex";
import { estimateCardValue, formatPrice } from "@/lib/pricing";

interface Props {
  cards: Card[];
  listName: string;
  onRemove?: (id: string) => void;
  onSelect?: (card: Card) => void;
}

export default function CardCycler({ cards, listName, onRemove, onSelect }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [cards.length, listName]);

  if (cards.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-700 py-20 text-center text-zinc-500">
        This list is empty. Search for cards and add them.
      </div>
    );
  }

  const card = cards[index];
  const img = getCardImageUrl(card, "high");
  const value = estimateCardValue(card);

  function prev() {
    setIndex((i) => (i === 0 ? cards.length - 1 : i - 1));
  }

  function next() {
    setIndex((i) => (i === cards.length - 1 ? 0 : i + 1));
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-300">
          Cycling · {listName}
        </h3>
        <span className="text-xs text-zinc-500">
          {index + 1} / {cards.length}
        </span>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => onSelect?.(card)}
          className="relative w-full max-w-xs aspect-[2.5/3.5] bg-zinc-800 rounded-xl overflow-hidden shadow-xl hover:ring-2 hover:ring-yellow-500/40 transition"
        >
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img}
              alt={card.name}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-600">
              No image
            </div>
          )}
        </button>

        <div className="text-center">
          <p className="text-lg font-semibold text-white">{card.name}</p>
          <p className="text-sm text-zinc-400">
            {card.set?.name} · #{card.localId}
          </p>
          <p className="text-yellow-400 text-sm mt-1">{formatPrice(value)}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prev}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={next}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700"
          >
            Next →
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(card.id)}
              className="rounded-lg bg-red-900/60 px-4 py-2 text-sm text-red-300 hover:bg-red-800/60"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
