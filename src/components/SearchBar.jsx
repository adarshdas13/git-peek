import { useState } from 'react'

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) onSearch(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        {/* Glow ambient highlight */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-cyan-400 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-30 group-focus-within:opacity-50 blur-md transition-all duration-500" />

        <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl overflow-hidden focus-within:border-cyan-400/80 transition-all duration-300 shadow-xl shadow-black/40">
          {/* Search icon */}
          <div className="pl-5 pr-2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any GitHub developer (e.g. torvalds)..."
            className="flex-1 py-4 px-2 bg-transparent text-slate-100 placeholder-slate-500 text-base md:text-lg outline-none"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="m-2 px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 font-bold rounded-xl transition-all duration-300 disabled:cursor-not-allowed disabled:text-slate-600 cursor-pointer shadow-md hover:shadow-cyan-500/25 active:scale-95"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin text-slate-950" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Searching</span>
              </div>
            ) : (
              'Explore'
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
