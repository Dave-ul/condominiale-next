export default function Loading() {
  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      {/* Header skeleton */}
      <div className="mb-10 pb-6 border-b" style={{ borderColor: 'var(--cream-dark)' }}>
        <div className="flex items-center gap-3 mb-3">
          <span style={{ width: 3, height: 22, backgroundColor: 'var(--gold)', display: 'block', flexShrink: 0 }} />
          <div className="h-7 w-64 animate-pulse" style={{ backgroundColor: 'var(--cream-dark)' }} />
        </div>
        <div className="h-3 w-32 ml-6 animate-pulse" style={{ backgroundColor: 'var(--cream-dark)' }} />
      </div>

      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ backgroundColor: 'var(--cream-dark)' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col p-6 bg-white">
            <div style={{ height: 3, backgroundColor: 'var(--gold)', marginBottom: 20, opacity: 0.3 }} />
            <div className="w-10 h-10 mb-4 animate-pulse" style={{ backgroundColor: 'var(--cream-dark)' }} />
            <div className="h-3 w-20 mb-3 animate-pulse" style={{ backgroundColor: 'var(--cream-dark)' }} />
            <div className="h-6 w-28 mb-2 animate-pulse" style={{ backgroundColor: 'var(--cream-dark)' }} />
            <div className="h-3 w-24 animate-pulse" style={{ backgroundColor: 'var(--cream-dark)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
