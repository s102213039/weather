import { useSelectedCounty } from '../hooks/useSelectedCounty'
import { useDistrictForecasts } from '../hooks/useWeatherQueries'
import { weatherIconUrl } from '../lib/countyForecast'
import { PageShell } from '../components/layout/PageShell'

export function WeekForecastPage() {
  const { selectedCounty, hasCounty } = useSelectedCounty()
  const { data = [], isLoading, error } = useDistrictForecasts(selectedCounty)
  const dates = data[0]?.days.map((d) => d.date) ?? []

  return (
    <PageShell title="一週天氣預報" description="依全域選取縣市顯示各鄉鎮 7 日預報">
      {!hasCounty && (
        <p className="cwa-empty-hint">請於頂部吸頂導覽列選擇縣市後再查看此頁資料。</p>
      )}
      {isLoading && <p>載入中…</p>}
      {error && <p className="text-red-600">無法載入資料</p>}
      {hasCounty && data.length > 0 && (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="min-w-full text-xs md:text-sm">
            <thead className="bg-sky-800 text-white">
              <tr>
                <th className="px-2 py-2 text-left">鄉鎮</th>
                {dates.map((d) => (
                  <th key={d} className="px-2 py-2 text-center">
                    {d.slice(5)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.districtName} className="border-t border-slate-100">
                  <td className="px-2 py-2 font-medium whitespace-nowrap">{row.districtName}</td>
                  {dates.map((d) => {
                    const day = row.days.find((x) => x.date === d)
                    if (!day) return <td key={d} className="px-2 py-2 text-center">--</td>
                    return (
                      <td key={d} className="px-2 py-2 text-center">
                        <img src={weatherIconUrl(day.wxCode)} alt="" className="mx-auto h-7 w-7" />
                        <div>{day.temp}°</div>
                        <div className="text-slate-500">{day.pop}%</div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  )
}
