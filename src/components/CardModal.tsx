"use client";

import type { Card } from "@/types";
import { getCardImageUrl } from "@/lib/tcgdex";
import { estimateCardValue, formatPrice } from "@/lib/pricing";

interface Props {
  card: Card | null;
  onClose: () => void;
  onAdd?: (id: string) => void;
  onRemove?: (id: string) => void;
  isInActiveList?: boolean;
}

export default function CardModal({
  card,
  onClose,
  onAdd,
  onRemove,
  isInActiveList,
}: Props) {
  if (!card) return null;

  const img = getCardImageUrl(card, "high");
  const estimated = estimateCardValue(card);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300 hover:bg-zinc-700"
        >
          Close
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="flex items-center justify-center bg-zinc-900 rounded-xl p-4">
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img}
                alt={card.name}
                className="max-h-[420px] w-auto object-contain drop-shadow-xl"
              />
            ) : (
              <div className="text-zinc-600">No image available</div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{card.name}</h2>
              <p className="text-sm text-zinc-400 mt-1">
                {card.set?.name} · #{card.localId}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {card.rarity && (
                <span className="rounded-full bg-zinc-800 px-3 py-1 text-yellow-400">
                  {card.rarity}
                </span>
              )}
              {card.types?.map((t) => (
                <span key={t} className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-300">
                  {t}
                </span>
              ))}
              {card.hp && (
                <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-300">
                  HP {card.hp}
                </span>
              )}
            </div>

            <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-3">
              <p className="text-xs text-zinc-500 uppercase tracking-wide">
                Estimated value (POC)
              </p>
              <p className="text-xl font-semibold text-yellow-400 mt-1">
                {formatPrice(estimated)}
              </p>
              <p className="text-[11px] text-zinc-600 mt-1">
                Rarity-based estimate · Real market prices coming later
              </p>
            </div>

            {card.description && (
              <p className="text-sm text-zinc-400 leading-relaxed">{card.description}</p>
            )}

            {card.attacks && card.attacks.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-zinc-300 mb-2">Attacks</h3>
                <ul className="space-y-2">
                  {card.attacks.map((atk, i) => (
                    <li key={i} className="text-sm text-zinc-400">
                      <span className="font-medium text-white">{atk.name}</span>
                      {atk.damage && (
                        <span className="ml-2 text-yellow-500">{atk.damage}</span>
                      )}
                      {atk.effect && (
                        <p className="text-xs text-zinc-500 mt-0.5">{atk.effect}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {isInActiveList && onRemove ? (
                <button
                  type="button"
                  onClick={() => onRemove(card.id)}
                  className="rounded-lg bg-red-600/90 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
                >
                  Remove from list
                </button>
              ) : (
                onAdd && (
                  <button
                    type="button"
                    onClick={() => onAdd(card.id)}
                    className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-yellow-400"
                  >
                    Add to list
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
