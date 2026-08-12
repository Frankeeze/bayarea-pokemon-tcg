import type { Card } from "@/types";

/**
 * Simple rarity-based estimate for the POC.
 * Real market pricing (TCGplayer / PriceCharting) requires API keys
 * and will be added in a later version.
 */
const RARITY_BASE: Record<string, number> = {
  common: 0.15,
  uncommon: 0.4,
  rare: 1.5,
  "rare holo": 4,
  "double rare": 8,
  "ultra rare": 12,
  "illustration rare": 18,
  "special illustration rare": 45,
  "hyper rare": 35,
  "secret rare": 25,
  "amazing rare": 15,
  promo: 3,
};

export function estimateCardValue(card: Card): number {
  const rarity = (card.rarity || "common").toLowerCase();
  let base = RARITY_BASE[rarity] ?? 1;

  const popular = ["charizard", "pikachu", "mewtwo", "umbreon", "gengar", "rayquaza"];
  if (popular.some((p) => card.name.toLowerCase().includes(p))) {
    base *= 1.8;
  }

  if (card.variants?.holo) base *= 1.4;

  return Math.round(base * 100) / 100;
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function estimateListTotal(cards: Card[]): number {
  return cards.reduce((sum, card) => sum + estimateCardValue(card), 0);
}
