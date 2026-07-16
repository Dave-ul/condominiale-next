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

      <div className="flex gap-2 flex-wrap mb-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-7 w-20 animate-pulse"
            style={{ backgroundColor: 'var(--cream-dark)' }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-5 border bg-white"
            style={{ borderColor: 'var(--cream-dark)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 animate-pulse"
                style={{ backgroundColor: 'var(--cream-dark)' }}
              />
              <div
                className="h-5 w-12 animate-pulse"
                style={{ backgroundColor: 'var(--cream-dark)' }}
              />
            </div>
            <div
              className="h-4 w-3/4 mb-2 animate-pulse"
              style={{ backgroundColor: 'var(--cream-dark)' }}
            />
            <div
              className="h-3 w-1/3 mb-4 animate-pulse"
              style={{ backgroundColor: 'var(--cream-dark)' }}
            />
            <div
              className="h-3 w-16 animate-pulse"
              style={{ backgroundColor: 'var(--cream-dark)' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
