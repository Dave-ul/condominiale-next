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
            className="h-3 w-32 animate-pulse"
            style={{ backgroundColor: 'var(--cream-dark)' }}
          />
        </div>
        <div
          className="h-9 w-40 animate-pulse"
          style={{ backgroundColor: 'var(--cream-dark)' }}
        />
      </div>

      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 border bg-white"
            style={{ borderColor: 'var(--cream-dark)' }}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0 space-y-2">
                <div
                  className="h-4 w-1/3 animate-pulse"
                  style={{ backgroundColor: 'var(--cream-dark)' }}
                />
                <div
                  className="h-3 w-2/3 animate-pulse"
                  style={{ backgroundColor: 'var(--cream-dark)' }}
                />
              </div>
              <div
                className="h-8 w-24 animate-pulse"
                style={{ backgroundColor: 'var(--cream-dark)' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
