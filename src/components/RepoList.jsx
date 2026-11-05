import { useState, useMemo } from 'react'
import RepoCard from './RepoCard'

const SORT_OPTIONS = [
  { key: 'stars', label: '⭐ Most Stars' },
  { key: 'updated', label: '🕐 Recently Updated' },
  { key: 'name', label: '🔤 Alphabetical' },
  { key: 'forks', label: '🍴 Most Forks' },
]

export default function RepoList({ repos, owner, referenceTime }) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('stars')
  const [langFilter, setLangFilter] = useState('all')
  const [showCount, setShowCount] = useState(12)

  const languages = useMemo(() => {
    const langs = new Set()
    repos.forEach((r) => r.language && langs.add(r.language))
    return ['all', ...Array.from(langs).sort()]
  }, [repos])

  const filtered = useMemo(() => {
    let result = repos.filter((r) => !r.fork)

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q))
      )
    }

    if (langFilter !== 'all') {
      result = result.filter((r) => r.language === langFilter)
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stargazers_count - a.stargazers_count
        case 'forks':
          return b.forks_count - a.forks_count
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return result
  }, [repos, search, sortBy, langFilter])

  const visible = filtered.slice(0, showCount)
  const hasMore = showCount < filtered.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-2">
            Repositories
            <span className="text-xs md:text-sm font-semibold bg-slate-800/80 text-cyan-400 px-2.5 py-0.5 rounded-full border border-slate-700/60">
              {filtered.length}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Showing non-forked open source projects
          </p>
        </div>
      </div>

      {/* Filter & Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search repositories..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-500 text-sm outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
          />
        </div>

        {/* Language selector */}
        <select
          value={langFilter}
          onChange={(e) => setLangFilter(e.target.value)}
          className="px-3.5 py-2.5 bg-slate-900/60 border border-slate-800/80 rounded-xl text-slate-300 text-sm outline-none focus:border-cyan-500/50 cursor-pointer transition-colors"
        >
          {languages.map((l) => (
            <option key={l} value={l} className="bg-slate-900 text-slate-200">
              {l === 'all' ? '🌐 All Languages' : l}
            </option>
          ))}
        </select>

        {/* Sort selector */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3.5 py-2.5 bg-slate-900/60 border border-slate-800/80 rounded-xl text-slate-300 text-sm outline-none focus:border-cyan-500/50 cursor-pointer transition-colors"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key} className="bg-slate-900 text-slate-200">
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Repo grid */}
      {visible.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 border border-slate-800/50 rounded-2xl">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <p className="text-base font-medium text-slate-300">No repositories matched your filters</p>
          <p className="text-xs text-slate-500 mt-1">Try clearing your search query or language filter</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {visible.map((repo, i) => (
              <RepoCard
                key={repo.id}
                repo={repo}
                owner={owner}
                referenceTime={referenceTime}
                index={i}
              />
            ))}
          </div>

          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={() => setShowCount((c) => c + 12)}
                className="px-7 py-2.5 bg-slate-800/60 hover:bg-slate-700/70 border border-slate-700/60 hover:border-cyan-500/40 text-slate-200 text-sm font-medium rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-cyan-500/10"
              >
                Load More Repositories ({filtered.length - showCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
