import type { Card, CardBrief } from "@/types";

const BASE_URL = "https://api.tcgdex.net/v2/en";

export async function searchCards(query: string, limit = 40): Promise<CardBrief[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams({
    name: query.trim(),
  });

  const res = await fetch(`${BASE_URL}/cards?${params.toString()}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TCGdex search failed: ${res.status}`);
  }

  const data: CardBrief[] = await res.json();
  return data.slice(0, limit);
}

export async function getCard(id: string): Promise<Card | null> {
  const res = await fetch(`${BASE_URL}/cards/${id}`, {
    next: { revalidate: 86400 },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`TCGdex get card failed: ${res.status}`);
  }

  return res.json();
}

export function getCardImageUrl(card: { image?: string }, quality: "high" | "low" = "high") {
  if (!card.image) return null;
  return `${card.image}/${quality}.webp`;
}

export async function getCardsByIds(ids: string[]): Promise<Card[]> {
  const unique = Array.from(new Set(ids));
  const results = await Promise.all(
    unique.map(async (id) => {
      try {
        return await getCard(id);
      } catch {
        return null;
      }
    })
  );
  return results.filter((c): c is Card => c !== null);
}
