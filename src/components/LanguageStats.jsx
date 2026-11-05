export default function LanguageStats({ repos }) {
  const langMap = {}
  repos.forEach((r) => {
    if (r.language && !r.fork) {
      langMap[r.language] = (langMap[r.language] || 0) + 1
    }
  })

  const sorted = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  const total = sorted.reduce((sum, [, count]) => sum + count, 0)
  const max = sorted[0]?.[1] || 1

  if (sorted.length === 0) return null

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md sticky top-24">
      <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center justify-between">
        <span>Language Breakdown</span>
        <span className="text-xs font-normal text-slate-400">{sorted.length} languages</span>
      </h3>
      <p className="text-xs text-slate-500 mb-5">Distribution across primary projects</p>

      <div className="space-y-4">
        {sorted.map(([lang, count]) => {
          const percent = ((count / total) * 100).toFixed(0)
          return (
            <div key={lang}>
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <span className="font-medium text-slate-200">{lang}</span>
                <span className="text-slate-400 font-mono">
                  {count} repo{count > 1 ? 's' : ''} · <span className="text-cyan-400 font-semibold">{percent}%</span>
                </span>
              </div>
              <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 transition-all duration-700"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
