export default function Loading() {
  return (
    <div className="p-6 lg:p-8" aria-busy="true" aria-live="polite">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div
            className="h-8 w-40 animate-pulse mb-2"
            style={{ backgroundColor: 'var(--cream-dark)' }}
          />
          <div
            className="h-3 w-40 animate-pulse"
            style={{ backgroundColor: 'var(--cream-dark)' }}
          />
        </div>
        <div
          className="h-9 w-40 animate-pulse"
          style={{ backgroundColor: 'var(--cream-dark)' }}
        />
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-7 w-20 animate-pulse"
            style={{ backgroundColor: 'var(--cream-dark)' }}
          />
        ))}
      </div>

      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 border bg-white"
            style={{ borderColor: 'var(--cream-dark)' }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0 space-y-2">
                <div
                  className="h-4 w-1/2 animate-pulse"
                  style={{ backgroundColor: 'var(--cream-dark)' }}
                />
                <div
                  className="h-3 w-3/4 animate-pulse"
                  style={{ backgroundColor: 'var(--cream-dark)' }}
                />
              </div>
              <div
                className="h-5 w-20 animate-pulse"
                style={{ backgroundColor: 'var(--cream-dark)' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
