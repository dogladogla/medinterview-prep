export default function Loading() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading">
      <div className="bg-muted h-8 w-64 animate-pulse rounded-md" />
      <div className="bg-muted h-4 w-full max-w-xl animate-pulse rounded-md" />
      <div className="grid gap-3 pt-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="bg-muted h-32 animate-pulse rounded-xl" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
