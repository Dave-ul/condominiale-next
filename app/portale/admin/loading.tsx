export default function Loading() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl" aria-busy="true" aria-live="polite">
      <div
        className="mb-8 h-8 w-64 animate-pulse"
        style={{ backgroundColor: 'var(--cream-dark)' }}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 border bg-white"
            style={{ borderColor: 'var(--cream-dark)' }}
          >
            <div
              className="w-5 h-5 mb-3 animate-pulse"
              style={{ backgroundColor: 'var(--cream-dark)' }}
            />
            <div
              className="h-6 w-20 mb-2 animate-pulse"
              style={{ backgroundColor: 'var(--cream-dark)' }}
            />
            <div
              className="h-3 w-16 animate-pulse"
              style={{ backgroundColor: 'var(--cream-dark)' }}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[0, 1].map((i) => (
          <div key={i}>
            <div
              className="h-6 w-32 mb-4 animate-pulse"
              style={{ backgroundColor: 'var(--cream-dark)' }}
            />
            <div className="space-y-2">
              {[0, 1, 2].map((j) => (
                <div
                  key={j}
                  className="h-16 animate-pulse"
                  style={{ backgroundColor: 'var(--cream-dark)' }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
