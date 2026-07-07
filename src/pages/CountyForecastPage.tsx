import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { normalizeCountyName } from '../data/taiwanCounties'
import { useSelectedCounty } from '../hooks/useSelectedCounty'
import { useCounty36h } from '../hooks/useWeatherQueries'
import { weatherIconUrl } from '../lib/countyForecast'
import { PageShell } from '../components/layout/PageShell'

export function CountyForecastPage() {
  const { selectedCounty, hasCounty } = useSelectedCounty()
  const { data = [], isLoading, error } = useCounty36h()

  const filtered = useMemo(() => {
    if (!hasCounty) return []
    const key = normalizeCountyName(selectedCounty)
    return data.filter((c) => normalizeCountyName(c.countyName) === key)
  }, [data, hasCounty, selectedCounty])

  return (
    <PageShell title="縣市預報總覽" description="依全域選取縣市顯示 36 小時三時段預報">
      {!hasCounty && (
        <p className="cwa-empty-hint">請於頂部吸頂導覽列選擇縣市後再查看此頁資料。</p>
      )}
      {isLoading && <p>載入中…</p>}
      {error && <p className="text-red-600">無法載入資料</p>}
      {hasCounty && filtered.length === 0 && !isLoading && <p>查無資料</p>}
      {filtered.length > 0 && (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-sky-800 text-white">
              <tr>
                <th className="px-3 py-2 text-left">縣市</th>
                <th className="px-3 py-2">時段</th>
                <th className="px-3 py-2">天氣</th>
                <th className="px-3 py-2">溫度</th>
                <th className="px-3 py-2">降雨機率</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) =>
                c.slots.map((slot, i) => (
                  <tr key={`${c.countyName}-${slot.label}`} className="border-t border-slate-100">
                    {i === 0 && (
                      <td className="px-3 py-2 font-medium" rowSpan={c.slots.length}>
                        <Link to={`/county/${encodeURIComponent(c.countyName)}`} className="text-sky-800">
                          {c.countyName}
                        </Link>
                      </td>
                    )}
                    <td className="px-3 py-2 text-center">{slot.label}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <img src={weatherIconUrl(slot.wxCode)} alt="" className="h-8 w-8" />
                        {slot.wxText}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center">
                      {slot.minT}–{slot.maxT}°C
                    </td>
                    <td className="px-3 py-2 text-center">{slot.pop}%</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  )
}
