# Bay Area Pokémon TCG

**Santa Clara / Bay Area local collection tool — Proof of Concept**

Search Pokémon TCG cards, build multiple renameable lists, cycle through your collection, and see estimated totals. Everything is stored in your browser’s local storage — no accounts required.

## Features (POC)

- Search the full TCGdex card database
- View high-quality card images and details
- Create, rename, and delete multiple lists
- Add / remove cards from lists
- Cycle through cards in a list (prev / next)
- Estimated list total value (rarity-based for now)

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS**
- **TCGdex API** (free, no key) for card data & images
- Browser **localStorage** for lists

## Getting Started

```bash
# Clone
git clone https://github.com/Frankeeze/bayarea-pokemon-tcg.git
cd bayarea-pokemon-tcg

# Install
npm install

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/           # Next.js App Router pages
  components/    # UI components
  lib/           # TCGdex client, storage helpers, pricing estimate
  types/         # TypeScript interfaces
```

## Roadmap (after POC)

- Real market pricing (TCGplayer / PriceCharting)
- User accounts + cloud sync (Supabase)
- Local Bay Area events calendar
- Shop directory
- “Grade or Sell” helper
- Deck sharing & community feedback

## Notes

- Pricing shown is a **simple rarity-based estimate** for the POC. Live market prices will be added later.
- Lists live only in the browser you are using. Clearing site data will remove them.

## License

MIT · Not affiliated with The Pokémon Company or Nintendo.
