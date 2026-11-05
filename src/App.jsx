import { useState } from 'react'
import SearchBar from './components/SearchBar'
import UserProfile from './components/UserProfile'
import LoadingSkeleton from './components/LoadingSkeleton'
import ErrorMessage from './components/ErrorMessage'
import { useGitHub } from './hooks/useGitHub'

export default function App() {
  const { user, repos, fetchedAt, loading, error, searchUser, clearSearch } = useGitHub()
  const [lastQuery, setLastQuery] = useState('')

  const handleSearch = (username) => {
    setLastQuery(username)
    searchUser(username)
  }

  const showLanding = !user && !loading && !error

  return (
    <div className="min-h-screen relative flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Ambient background glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[128px]" />
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[140px]" />
      </div>

      {/* Header without GitHub API link */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={() => { clearSearch(); setLastQuery('') }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-all duration-300">
              <svg className="w-5 h-5 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-base font-bold text-slate-100 leading-none tracking-tight">GitPeek</h1>
              <p className="text-[11px] text-cyan-400 font-medium leading-none mt-1">Profile Analyzer</p>
            </div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* Landing Hero */}
        {showLanding && (
          <div className="flex flex-col items-center justify-center min-h-[62vh] animate-fade-in-up text-center">
            {/* Center icon badge */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-3xl blur-2xl opacity-40 scale-125" />
              <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700/80 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-glow">
                <svg className="w-10 h-10 md:w-12 md:h-12 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </div>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 max-w-3xl leading-tight">
              Analyze Any GitHub Profile{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                in Seconds
              </span>
            </h2>
            <p className="text-slate-400 text-base md:text-lg mb-8 max-w-lg leading-relaxed">
              Search any developer to analyze their influence score, coding longevity, repository impact, and tech stack.
            </p>

            <SearchBar onSearch={handleSearch} loading={loading} />

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              <span className="text-xs text-slate-500 font-medium">Trending developers:</span>
              {['torvalds', 'gaearon', 'sindresorhus', 'shadcn', 'antfu'].map((name) => (
                <button
                  key={name}
                  onClick={() => handleSearch(name)}
                  className="text-xs text-slate-300 hover:text-cyan-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 px-3 py-1 rounded-full transition-all cursor-pointer font-mono"
                >
                  @{name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search bar when viewing results */}
        {!showLanding && (
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>
        )}

        {loading && <LoadingSkeleton />}

        {error && (
          <ErrorMessage
            message={error}
            onRetry={lastQuery ? () => handleSearch(lastQuery) : undefined}
          />
        )}

        {/* Active Profile Analysis View */}
        {user && !loading && (
          <UserProfile
            user={user}
            repos={repos}
            fetchedAt={fetchedAt}
            onBack={clearSearch}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-900 py-6 mt-auto">
        <p className="text-center text-xs text-slate-600 font-medium">
          GitPeek · GitHub Profile Analyzer
        </p>
      </footer>
    </div>
  )
}
