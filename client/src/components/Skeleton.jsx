export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className}`}
      style={{ backgroundColor: '#1a1a1a' }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-[#2a2a2a] overflow-hidden bg-[#111111] transition-all duration-200">
      <div className="h-24 bg-[#1a1a1a] animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 bg-[#1a1a1a] rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-[#1a1a1a] rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-[#1a1a1a] rounded animate-pulse" />
      </div>
    </div>
  );
}


export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] animate-pulse" />
        <div className="h-4 w-24 bg-[#1a1a1a] rounded animate-pulse" />
      </div>
    </div>
  );
}
