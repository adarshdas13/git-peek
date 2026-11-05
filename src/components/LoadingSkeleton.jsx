export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Profile skeleton */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full animate-shimmer" />
          <div className="flex-1 space-y-4 w-full">
            <div className="h-8 animate-shimmer rounded-lg w-52" />
            <div className="h-4 animate-shimmer rounded w-80" />
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="h-10 animate-shimmer rounded-xl w-28" />
              <div className="h-10 animate-shimmer rounded-xl w-28" />
              <div className="h-10 animate-shimmer rounded-xl w-28" />
              <div className="h-10 animate-shimmer rounded-xl w-28" />
            </div>
          </div>
        </div>
      </div>

      {/* Metric skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <div className="h-6 animate-shimmer rounded w-10" />
            <div className="h-8 animate-shimmer rounded w-20" />
            <div className="h-3 animate-shimmer rounded w-28" />
          </div>
        ))}
      </div>

      {/* 4 Quick stats skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800/70 rounded-xl p-4 space-y-2">
            <div className="h-3 animate-shimmer rounded w-16" />
            <div className="h-5 animate-shimmer rounded w-24" />
          </div>
        ))}
      </div>

      {/* Spotlight and Tech Stack skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="h-5 animate-shimmer rounded w-36" />
          <div className="h-7 animate-shimmer rounded w-48" />
          <div className="h-4 animate-shimmer rounded w-full" />
          <div className="h-4 animate-shimmer rounded w-3/4" />
          <div className="h-4 animate-shimmer rounded w-40 pt-4" />
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="h-5 animate-shimmer rounded w-40" />
          <div className="space-y-3 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <div className="h-3 animate-shimmer rounded w-20" />
                  <div className="h-3 animate-shimmer rounded w-16" />
                </div>
                <div className="h-2 animate-shimmer rounded-full w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
