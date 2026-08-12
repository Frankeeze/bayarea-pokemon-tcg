"use client";

import type { CardBrief } from "@/types";
import { getCardImageUrl } from "@/lib/tcgdex";

interface Props {
  cards: CardBrief[];
  onSelect: (id: string) => void;
  onAdd?: (id: string) => void;
  activeListName?: string;
}

export default function CardGrid({ cards, onSelect, onAdd, activeListName }: Props) {
  if (cards.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-700 py-16 text-center text-zinc-500">
        Search for cards to get started
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {cards.map((card) => {
        const img = getCardImageUrl(card, "low");
        return (
          <div
            key={card.id}
            className="group relative rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden hover:border-yellow-500/50 transition"
          >
            <button
              type="button"
              onClick={() => onSelect(card.id)}
              className="w-full text-left"
            >
              <div className="aspect-[2.5/3.5] bg-zinc-800 relative">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img}
                    alt={card.name}
                    className="h-full w-full object-contain p-1"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-zinc-600">
                    No image
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-white truncate">{card.name}</p>
                <p className="text-[10px] text-zinc-500 truncate">{card.id}</p>
              </div>
            </button>
            {onAdd && (
              <button
                type="button"
                onClick={() => onAdd(card.id)}
                className="absolute top-2 right-2 rounded-full bg-yellow-500 text-zinc-950 text-xs font-bold w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
                title={activeListName ? `Add to ${activeListName}` : "Add to list"}
              >
                +
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
