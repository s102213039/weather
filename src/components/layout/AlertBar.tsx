import { useWarnings } from '../../hooks/useWeatherQueries'

export function AlertBar() {
  const { data: warnings = [] } = useWarnings()

  if (warnings.length === 0) return null

  return (
    <div className="cwa-alert-bar" role="alert">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-2 text-sm">
        <i className="icon-cwb-warn text-lg" aria-hidden />
        {warnings.map((w) => (
          <span key={w} className="rounded bg-white/15 px-2 py-0.5">
            {w}
          </span>
        ))}
      </div>
    </div>
  )
}
