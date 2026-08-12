export default function Header() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Bay Area Pokémon TCG
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Santa Clara · Local Collection Tool · Proof of Concept
          </p>
        </div>
        <div className="text-xs text-zinc-500 hidden sm:block">
          Lists saved in your browser
        </div>
      </div>
    </header>
  );
}
