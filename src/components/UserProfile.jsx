import { useState, useEffect, useMemo } from 'react'

export default function UserProfile({ user, repos, fetchedAt, onBack }) {
  const joined = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // ── Computed stats using pure reference timestamp ──
  const stats = useMemo(() => {
    const nonForkRepos = repos.filter((r) => !r.fork)
    const totalStars = nonForkRepos.reduce((s, r) => s + r.stargazers_count, 0)
    const totalForks = nonForkRepos.reduce((s, r) => s + r.forks_count, 0)
    const avgStars = nonForkRepos.length ? (totalStars / nonForkRepos.length).toFixed(1) : '0'

    // Most used language
    const langMap = {}
    nonForkRepos.forEach((r) => {
      if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1
    })
    const sortedLangs = Object.entries(langMap).sort((a, b) => b[1] - a[1])
    const topLang = sortedLangs[0]

    // Pure reference timestamp (from async fetch timestamp or deterministic API updated_at/created_at)
    const refTimestamp = fetchedAt || (user.updated_at ? new Date(user.updated_at).getTime() : new Date(user.created_at).getTime())
    const createdTimestamp = new Date(user.created_at).getTime()
    const ageMs = Math.max(0, refTimestamp - createdTimestamp)
    const ageDays = Math.floor(ageMs / 86400000)
    const ageYears = Math.floor(ageDays / 365)
    const ageMonths = Math.floor((ageDays % 365) / 30)

    // Follower ratio
    const ratio = user.following > 0 ? (user.followers / user.following).toFixed(1) : '∞'

    // Crown Jewel (most starred repo)
    const topRepo = [...nonForkRepos].sort((a, b) => b.stargazers_count - a.stargazers_count)[0]

    // Recent activity (repos pushed in last 30 days of the snapshot)
    const thirtyDaysAgo = refTimestamp - 30 * 86400000
    const recentlyActive = nonForkRepos.filter(
      (r) => new Date(r.pushed_at).getTime() > thirtyDaysAgo
    ).length

    // Languages breakdown
    const topLanguages = sortedLangs.slice(0, 6)
    const langTotal = topLanguages.reduce((sum, [, count]) => sum + count, 0)
    const langMax = topLanguages[0]?.[1] || 1

    return {
      totalStars,
      totalForks,
      avgStars,
      topLang,
      ageDays,
      ageYears,
      ageMonths,
      ratio,
      topRepo,
      recentlyActive,
      repoCount: nonForkRepos.length,
      topLanguages,
      langTotal,
      langMax,
    }
  }, [repos, user, fetchedAt])

  // ── Animated counters ──
  const [animatedFollowers, setAnimatedFollowers] = useState(0)
  const [animatedStars, setAnimatedStars] = useState(0)

  useEffect(() => {
    const duration = 750
    const steps = 25
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedFollowers(Math.round(user.followers * eased))
      setAnimatedStars(Math.round(stats.totalStars * eased))
      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [user.followers, stats.totalStars])

  // Influence score
  const influenceScore = useMemo(() => {
    const s =
      Math.log2(user.followers + 1) * 10 +
      Math.log2(stats.totalStars + 1) * 8 +
      Math.log2(user.public_repos + 1) * 5 +
      Math.min(stats.ageDays / 365, 10) * 3
    return Math.min(Math.round(s), 100)
  }, [user, stats])

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors group cursor-pointer"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        New Search
      </button>

      {/* ── Main Profile Header Card ── */}
      <div className="relative overflow-hidden bg-slate-900/70 border border-slate-800/80 rounded-3xl p-7 md:p-9 backdrop-blur-xl shadow-2xl shadow-indigo-950/20">
        {/* Ambient background glows */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-7">
          {/* Avatar with gradient border & hireable tag */}
          <div className="relative shrink-0">
            <div className="absolute -inset-1 bg-linear-to-tr from-cyan-500 via-indigo-500 to-violet-500 rounded-full opacity-70 blur-xs" />
            <img
              src={user.avatar_url}
              alt={user.login}
              className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-2 border-slate-900 object-cover"
            />
            {user.hireable && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-md shadow-emerald-500/20">
                Hireable
              </span>
            )}
          </div>

          {/* Details & meta */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
                {user.name || user.login}
              </h2>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
              >
                @{user.login}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {user.bio && (
              <p className="text-slate-300 text-sm md:text-base mb-4 max-w-2xl leading-relaxed">
                {user.bio}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 mb-5 text-xs md:text-sm text-slate-400">
              {user.company && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {user.company}
                </span>
              )}
              {user.location && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {user.location}
                </span>
              )}
              {user.blog && (
                <a
                  href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
                >
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Website
                </a>
              )}
              <span className="flex items-center gap-1.5 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Joined {joined}
              </span>
            </div>

            {/* Quick Stat Badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2.5">
              <StatBadge label="Followers" value={animatedFollowers} icon="👥" highlight="cyan" />
              <StatBadge label="Following" value={user.following} icon="➡️" />
              <StatBadge label="Repositories" value={user.public_repos} icon="📦" />
              <StatBadge label="Total Stars" value={animatedStars} icon="⭐" highlight="amber" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Metrics & Developer Insights ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Influence Score */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col items-center justify-center text-center backdrop-blur-md">
          <div className="relative w-20 h-20 mb-2.5">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 88 88">
              <circle cx="44" cy="44" r="38" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-800/80" />
              <circle
                cx="44"
                cy="44"
                r="38"
                fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="238.76"
                strokeDashoffset={238.76 - (238.76 * influenceScore) / 100}
                style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-extrabold text-slate-100">{influenceScore}</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Influence Score</span>
        </div>

        {/* Account Tenure */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="text-2xl mb-1.5">⏱️</div>
            <div className="text-2xl font-bold text-slate-100">
              {stats.ageYears > 0 ? `${stats.ageYears}y ${stats.ageMonths}m` : `${stats.ageMonths}m`}
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider">Coding on GitHub</span>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Over <span className="text-cyan-400 font-medium">{stats.ageDays.toLocaleString()}</span> days active
          </div>
        </div>

        {/* Primary Language */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="text-2xl mb-1.5">⚡</div>
            <div className="text-2xl font-bold text-slate-100 truncate">
              {stats.topLang ? stats.topLang[0] : 'N/A'}
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider">Top Technology</span>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            {stats.topLang ? (
              <>Powering <span className="text-indigo-400 font-medium">{stats.topLang[1]}</span> repositories</>
            ) : (
              'No repositories found'
            )}
          </div>
        </div>

        {/* Follower Ratio */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="text-2xl mb-1.5">
              {Number(stats.ratio) >= 2 ? '🚀' : Number(stats.ratio) >= 1 ? '📈' : '🌱'}
            </div>
            <div className="text-2xl font-bold text-slate-100">{stats.ratio}x</div>
            <span className="text-xs text-slate-500 uppercase tracking-wider">Follower Multiplier</span>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            {Number(stats.ratio) >= 5
              ? 'High reach creator'
              : Number(stats.ratio) >= 2
              ? 'Strong community leader'
              : Number(stats.ratio) >= 1
              ? 'Growing presence'
              : 'Active contributor'}
          </div>
        </div>
      </div>

      {/* ── Secondary Quick Metrics ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MiniMetric icon="🍴" label="Total Forks" value={stats.totalForks.toLocaleString()} />
        <MiniMetric icon="📊" label="Avg Stars / Repo" value={stats.avgStars} />
        <MiniMetric icon="🔥" label="Active Recently" value={`${stats.recentlyActive} repos`} />
        <MiniMetric icon="🏆" label="Top Starred Project" value={stats.topRepo?.name || '—'} truncate />
      </div>

      {/* ── Detailed Profile Analytics: Crown Jewel Spotlight & Language Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crown Jewel Project Spotlight */}
        <div className="bg-linear-to-br from-indigo-950/40 via-slate-900/70 to-slate-900/70 border border-indigo-500/20 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-base">👑</span>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Crown Jewel Project
                </span>
              </div>
              {stats.topRepo?.language && (
                <span className="text-xs font-medium text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-0.5 rounded-full">
                  {stats.topRepo.language}
                </span>
              )}
            </div>

            {stats.topRepo ? (
              <>
                <a
                  href={stats.topRepo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors inline-flex items-center gap-2">
                    {stats.topRepo.name}
                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </h3>
                </a>
                <p className="text-sm text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {stats.topRepo.description || 'No project description provided'}
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-500 mt-2">No public repositories available</p>
            )}
          </div>

          {stats.topRepo && (
            <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-slate-800/60 text-xs text-slate-400">
              <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                ⭐ {stats.topRepo.stargazers_count.toLocaleString()} stars
              </span>
              <span className="flex items-center gap-1.5">
                🍴 {stats.topRepo.forks_count.toLocaleString()} forks
              </span>
              {stats.topRepo.open_issues_count > 0 && (
                <span className="flex items-center gap-1.5">
                  🐛 {stats.topRepo.open_issues_count} open issues
                </span>
              )}
            </div>
          )}
        </div>

        {/* Tech Stack & Language Distribution */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-slate-100">Tech Stack Breakdown</h3>
            <span className="text-xs text-slate-500">{stats.repoCount} public repos analyzed</span>
          </div>
          <p className="text-xs text-slate-400 mb-5">Primary programming languages across developer's work</p>

          {stats.topLanguages.length > 0 ? (
            <div className="space-y-3.5">
              {stats.topLanguages.map(([lang, count]) => {
                const percent = ((count / stats.langTotal) * 100).toFixed(0)
                return (
                  <div key={lang}>
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="font-medium text-slate-200">{lang}</span>
                      <span className="text-slate-400 font-mono">
                        {count} repo{count > 1 ? 's' : ''} · <span className="text-cyan-400 font-semibold">{percent}%</span>
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-cyan-400 via-sky-400 to-indigo-500 transition-all duration-700"
                        style={{ width: `${(count / stats.langMax) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              No language data available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatBadge({ label, value, icon, highlight }) {
  const highlightStyles =
    highlight === 'cyan'
      ? 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30'
      : highlight === 'amber'
      ? 'text-amber-400 border-amber-500/30 bg-amber-950/30'
      : 'text-slate-200 border-slate-800 bg-slate-900/60'

  return (
    <div className={`flex items-center gap-2 rounded-xl px-3.5 py-2 border ${highlightStyles}`}>
      <span className="text-sm">{icon}</span>
      <span className="text-lg font-bold">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
      <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
  )
}

function MiniMetric({ icon, label, value, truncate }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800/70 rounded-xl px-4 py-3">
      <div className="flex items-center gap-1.5 mb-1 text-slate-400">
        <span className="text-xs">{icon}</span>
        <span className="text-xs">{label}</span>
      </div>
      <div className={`text-sm font-semibold text-slate-200 ${truncate ? 'truncate' : ''}`}>
        {value}
      </div>
    </div>
  )
}
