import { Link } from 'react-router-dom'
import { useSelectedCounty } from '../hooks/useSelectedCounty'
import { useDistrictForecasts } from '../hooks/useWeatherQueries'
import { weatherIconUrl } from '../lib/countyForecast'
import { PageShell } from '../components/layout/PageShell'

export function TownForecastPage() {
  const { selectedCounty, hasCounty } = useSelectedCounty()
  const { data = [], isLoading, error } = useDistrictForecasts(selectedCounty)

  return (
    <PageShell title="鄉鎮預報總覽" description="依全域選取縣市顯示各鄉鎮預報摘要">
      {!hasCounty && (
        <p className="cwa-empty-hint">請於頂部吸頂導覽列選擇縣市後再查看此頁資料。</p>
      )}
      {isLoading && <p>載入中…</p>}
      {error && <p className="text-red-600">無法載入資料</p>}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {data.map((d) => {
          const today = d.days[0]
          return (
            <Link
              key={d.districtName}
              to={`/town/${encodeURIComponent(selectedCounty)}/${encodeURIComponent(d.districtName)}`}
              className="rounded-lg bg-white p-4 shadow no-underline hover:ring-2 hover:ring-sky-300"
            >
              <div className="font-semibold text-sky-900">{d.districtName}</div>
              {today && (
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                  <img src={weatherIconUrl(today.wxCode)} alt="" className="h-8 w-8" />
                  <span>
                    {today.wxText} · {today.temp}°C · 雨 {today.pop}%
                  </span>
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </PageShell>
  )
}
