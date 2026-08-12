"use client";

import { useState, FormEvent } from "react";

interface Props {
  onSearch: (query: string) => void;
  loading?: boolean;
}

export default function SearchBar({ onSearch, loading }: Props) {
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search cards (e.g. Charizard, Pikachu, Umbreon)..."
        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/60"
      />
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
