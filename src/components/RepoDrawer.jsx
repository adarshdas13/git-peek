import { useEffect, useState, useRef } from 'react'
import { fetchLanguages, fetchReadme } from '../api/github'

export default function RepoDrawer({ repo, owner, onClose }) {
  const [languages, setLanguages] = useState(null)
  const [readme, setReadme] = useState(null)
  const [loadingReadme, setLoadingReadme] = useState(true)
  const backdropRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    fetchLanguages(owner, repo.name).then(setLanguages)
    fetchReadme(owner, repo.name)
      .then(setReadme)
      .finally(() => setLoadingReadme(false))
  }, [owner, repo.name])

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const totalBytes = languages ? Object.values(languages).reduce((a, b) => a + b, 0) : 0

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex justify-end"
      onClick={(e) => e.target === backdropRef.current && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-xs" />

      {/* Drawer */}
      <div className="relative w-full max-w-2xl bg-slate-950 border-l border-slate-800 overflow-y-auto animate-fade-in-up shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 p-6 flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-xl font-bold text-slate-100 truncate">{repo.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{owner}/{repo.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-cyan-400"
              title="Open on GitHub"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-100 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          {repo.description && (
            <p className="text-slate-300 text-sm leading-relaxed">{repo.description}</p>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBox icon="⭐" label="Stars" value={repo.stargazers_count} />
            <StatBox icon="🍴" label="Forks" value={repo.forks_count} />
            <StatBox icon="👁" label="Watchers" value={repo.watchers_count} />
            <StatBox icon="🐛" label="Issues" value={repo.open_issues_count} />
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
            {repo.license?.spdx_id && (
              <DetailItem label="License" value={repo.license.spdx_id} />
            )}
            <DetailItem label="Default Branch" value={repo.default_branch} />
            <DetailItem label="Created" value={new Date(repo.created_at).toLocaleDateString()} />
            <DetailItem label="Last Push" value={new Date(repo.pushed_at).toLocaleDateString()} />
            {repo.size > 0 && (
              <DetailItem
                label="Size"
                value={repo.size > 1024 ? `${(repo.size / 1024).toFixed(1)} MB` : `${repo.size} KB`}
              />
            )}
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 hover:border-cyan-500/40 transition-colors"
              >
                <span className="text-slate-400">Homepage</span>
                <span className="text-cyan-400 truncate ml-2 font-medium">🔗 Visit</span>
              </a>
            )}
          </div>

          {/* Languages */}
          {languages && totalBytes > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Languages</h4>
              <div className="flex h-2.5 rounded-full overflow-hidden bg-slate-800 mb-3">
                {Object.entries(languages).map(([lang, bytes]) => (
                  <div
                    key={lang}
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${(bytes / totalBytes) * 100}%`,
                      backgroundColor: getLangColor(lang),
                    }}
                    title={`${lang}: ${((bytes / totalBytes) * 100).toFixed(1)}%`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {Object.entries(languages).map(([lang, bytes]) => (
                  <span key={lang} className="flex items-center gap-1.5 text-xs text-slate-300">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getLangColor(lang) }} />
                    {lang}
                    <span className="text-slate-500">{((bytes / totalBytes) * 100).toFixed(1)}%</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Topics */}
          {repo.topics && repo.topics.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">Topics</h4>
              <div className="flex flex-wrap gap-2">
                {repo.topics.map((t) => (
                  <span key={t} className="text-xs bg-slate-900 text-cyan-300 border border-slate-800 px-3 py-1 rounded-full">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* README */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">README</h4>
            {loadingReadme ? (
              <div className="space-y-2">
                <div className="h-4 animate-shimmer rounded w-3/4" />
                <div className="h-4 animate-shimmer rounded w-1/2" />
                <div className="h-4 animate-shimmer rounded w-5/6" />
              </div>
            ) : readme ? (
              <pre className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs md:text-sm text-slate-300 whitespace-pre-wrap overflow-x-auto max-h-96 font-mono leading-relaxed">
                {readme}
              </pre>
            ) : (
              <p className="text-slate-500 text-xs italic">No README found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBox({ icon, label, value }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-center">
      <div className="text-base mb-0.5">{icon}</div>
      <div className="text-lg font-bold text-slate-100">{value.toLocaleString()}</div>
      <div className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider">{label}</div>
    </div>
  )
}

function DetailItem({ label, value }) {
  return (
    <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-200 font-medium">{value}</span>
    </div>
  )
}

function getLangColor(lang) {
  const colors = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
    Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516',
    'C++': '#f34b7d', C: '#555555', 'C#': '#178600', PHP: '#4F5D95',
    Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB', HTML: '#e34c26',
    CSS: '#563d7c', Shell: '#89e051', Vue: '#41b883', Svelte: '#ff3e00',
    SCSS: '#c6538c', Lua: '#000080', Scala: '#c22d40',
  }
  return colors[lang] || '#94a3b8'
}
