import { useMemo } from 'react'
import { normalizeCountyName } from '../data/taiwanCounties'
import { useSelectedCounty } from '../hooks/useSelectedCounty'
import { useObservation } from '../hooks/useWeatherQueries'
import { PageShell } from '../components/layout/PageShell'

export function ObservationPage() {
  const { selectedCounty, hasCounty } = useSelectedCounty()
  const { data = [], isLoading, error } = useObservation()

  const filtered = useMemo(() => {
    if (!hasCounty) return []
    const key = normalizeCountyName(selectedCounty)
    return data.filter((s) => normalizeCountyName(s.county) === key)
  }, [data, hasCounty, selectedCounty])

  return (
    <PageShell title="最新天氣觀測" description="依全域選取縣市顯示自動氣象站觀測">
      {!hasCounty && (
        <p className="cwa-empty-hint">請於頂部吸頂導覽列選擇縣市後再查看此頁資料。</p>
      )}
      {hasCounty && <p className="mb-4 text-sm text-slate-500">共 {filtered.length} 站</p>}
      {isLoading && <p>載入中…</p>}
      {error && <p className="text-red-600">無法載入資料</p>}
      {filtered.length > 0 && (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-sky-800 text-white">
              <tr>
                <th className="px-3 py-2 text-left">測站</th>
                <th className="px-3 py-2">縣市</th>
                <th className="px-3 py-2">鄉鎮</th>
                <th className="px-3 py-2">天氣</th>
                <th className="px-3 py-2">溫度</th>
                <th className="px-3 py-2">濕度</th>
                <th className="px-3 py-2">風速</th>
                <th className="px-3 py-2">雨量</th>
                <th className="px-3 py-2">觀測時間</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium">{s.name}</td>
                  <td className="px-3 py-2 text-center">{s.county}</td>
                  <td className="px-3 py-2 text-center">{s.town}</td>
                  <td className="px-3 py-2 text-center">{s.weather}</td>
                  <td className="px-3 py-2 text-center">{s.temp}°C</td>
                  <td className="px-3 py-2 text-center">{s.humidity}%</td>
                  <td className="px-3 py-2 text-center">{s.windSpeed} m/s</td>
                  <td className="px-3 py-2 text-center">{s.rain}</td>
                  <td className="px-3 py-2 text-center text-xs text-slate-500">
                    {s.obsTime.replace('T', ' ').slice(0, 16)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  )
}
