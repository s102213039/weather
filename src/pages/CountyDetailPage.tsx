import { useParams } from 'react-router-dom'
import { useCounty36h } from '../hooks/useWeatherQueries'
import { findCountySummary, weatherIconUrl } from '../lib/countyForecast'
import { PageShell } from '../components/layout/PageShell'

export function CountyDetailPage() {
  const { county = '' } = useParams()
  const name = decodeURIComponent(county)
  const { data: all = [], isLoading, error } = useCounty36h()
  const summary = findCountySummary(all, name)

  return (
    <PageShell title={name || '縣市詳情'} description="今明 36 小時三時段預報">
      {isLoading && <p>載入中…</p>}
      {error && <p className="text-red-600">無法載入資料</p>}
      {!summary && !isLoading && <p>找不到此縣市資料</p>}
      {summary && (
        <div className="grid gap-4 md:grid-cols-3">
          {summary.slots.map((slot) => (
            <div key={slot.label} className="rounded-lg bg-white p-4 text-center shadow">
              <div className="font-semibold text-sky-900">{slot.label}</div>
              <img src={weatherIconUrl(slot.wxCode)} alt="" className="mx-auto my-2 h-16 w-16" />
              <div className="text-lg">{slot.wxText}</div>
              <div className="text-slate-600">
                {slot.minT}–{slot.maxT}°C · 降雨 {slot.pop}%
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  )
}
