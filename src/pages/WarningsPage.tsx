import { useWarningsDetail } from '../hooks/useWeatherQueries'
import { PageShell } from '../components/layout/PageShell'

export function WarningsPage() {
  const { data = [], isLoading, error } = useWarningsDetail()

  return (
    <PageShell title="警特報" description="各縣市生效中的氣象警特報（W-C0033-001）">
      {isLoading && <p>載入中…</p>}
      {error && <p className="text-red-600">無法載入資料</p>}
      {!isLoading && !error && data.length === 0 && (
        <p className="rounded-lg bg-white p-6 text-center text-slate-600 shadow">目前無生效中的警特報</p>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {data.map((w) => (
          <div key={w.county} className="rounded-lg border-l-4 border-red-500 bg-white p-4 shadow">
            <h2 className="font-bold text-sky-900">{w.county}</h2>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
              {w.hazards.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
