export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="animate-fade-in-up flex flex-col items-center justify-center py-20 px-4">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl" />
        <div className="relative w-20 h-20 bg-slate-900 border border-rose-500/30 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-950/40">
          <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-100 mb-2">User Not Found</h3>
      <p className="text-slate-400 text-center max-w-md mb-6 text-sm leading-relaxed">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer shadow-md hover:border-cyan-500/40"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
