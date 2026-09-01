// Shown while a route's loader is still in flight (a client-side nav landing on data
// that isn't cached yet). Keeps the same shell/nav on screen instead of a blank cream
// flash, and never appears during a normal SSR page load since the loader has already
// resolved by the time that HTML is sent.
export function PageSkeleton({ tiles = 6 }: { tiles?: number }) {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 animate-pulse">
      <div className="h-9 sm:h-11 w-64 max-w-full bg-border" />
      <div className="mt-4 h-4 w-96 max-w-full bg-border" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: tiles }).map((_, i) => (
          <div key={i} className="h-36 border border-border bg-border/40" />
        ))}
      </div>
    </main>
  );
}
