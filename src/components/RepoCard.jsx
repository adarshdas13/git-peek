import { useState } from 'react'
import RepoDrawer from './RepoDrawer'

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516',
  'C++': '#f34b7d', C: '#555555', 'C#': '#178600', PHP: '#4F5D95',
  Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB', HTML: '#e34c26',
  CSS: '#563d7c', Shell: '#89e051', Lua: '#000080', Vue: '#41b883',
  Svelte: '#ff3e00', Scala: '#c22d40', Elixir: '#6e4a7e', Haskell: '#5e5086',
  R: '#198CE7', SCSS: '#c6538c',
}

function getTimeAgo(dateStr, referenceTime) {
  if (!dateStr) return ''
  const targetTime = new Date(dateStr).getTime()
  const refTime = referenceTime || targetTime
  const diff = Math.max(0, refTime - targetTime)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

export default function RepoCard({ repo, owner, referenceTime, index }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const langColor = LANG_COLORS[repo.language] || '#94a3b8'

  return (
    <>
      <div
        onClick={() => setDrawerOpen(true)}
        className="group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/20"
        style={{ animationDelay: `${index * 0.04}s` }}
      >
        {/* Subtle hover gradient glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Top section */}
        <div className="relative flex items-start justify-between gap-3 mb-2.5">
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold text-slate-100 group-hover:text-cyan-400 truncate transition-colors">
              {repo.name}
            </h4>
            {repo.archived && (
              <span className="inline-block mt-1 text-[11px] bg-amber-950/40 text-amber-400 border border-amber-800/30 px-2 py-0.5 rounded-md font-medium">
                Archived
              </span>
            )}
          </div>

          {repo.visibility === 'private' ? (
            <span className="shrink-0 text-xs bg-slate-800/60 text-slate-400 border border-slate-700/50 px-2 py-0.5 rounded-md">
              Private
            </span>
          ) : (
            <span className="shrink-0 text-xs bg-slate-800/40 text-slate-400 border border-slate-700/40 px-2 py-0.5 rounded-md">
              Public
            </span>
          )}
        </div>

        {/* Description */}
        <p className="relative text-sm text-slate-400 line-clamp-2 mb-4 min-h-[2.5rem] leading-relaxed">
          {repo.description || 'No description provided'}
        </p>

        {/* Footer info & stats */}
        <div className="relative flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3.5">
            {repo.language && (
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: langColor }} />
                {repo.language}
              </span>
            )}
            <span className="flex items-center gap-1 hover:text-amber-400 transition-colors">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {repo.stargazers_count.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {repo.forks_count.toLocaleString()}
            </span>
          </div>
          <span className="text-slate-500 text-[11px] font-mono">
            {getTimeAgo(repo.updated_at, referenceTime)}
          </span>
        </div>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="relative flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-800/40">
            {repo.topics.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[11px] bg-slate-800/50 text-slate-300 border border-slate-700/40 px-2 py-0.5 rounded-md"
              >
                #{t}
              </span>
            ))}
            {repo.topics.length > 3 && (
              <span className="text-[11px] text-slate-500">+{repo.topics.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {drawerOpen && (
        <RepoDrawer repo={repo} owner={owner} onClose={() => setDrawerOpen(false)} />
      )}
    </>
  )
}
