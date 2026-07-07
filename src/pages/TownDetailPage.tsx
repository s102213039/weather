import { useParams } from 'react-router-dom'
import { useDistrictForecastsRaw } from '../hooks/useWeatherQueries'
import { findDistrict, districtDescription } from '../lib/districtForecast'
import { weatherIconUrl } from '../lib/countyForecast'
import { PageShell } from '../components/layout/PageShell'

export function TownDetailPage() {
  const { county = '', town = '' } = useParams()
  const countyName = decodeURIComponent(county)
  const townName = decodeURIComponent(town)
  const { data: response, summary, isLoading, error } = useDistrictForecastsRaw(countyName)
  const district = summary ? findDistrict(summary, townName) : undefined
  const description = response ? districtDescription(response, townName) : undefined

  return (
    <PageShell title={`${countyName} ${townName}`} description="鄉鎮一週預報（F-D0047）">
      {isLoading && <p>載入中…</p>}
      {error && <p className="text-red-600">無法載入資料</p>}
      {description && (
        <p className="mb-4 rounded-lg bg-sky-50 p-4 text-sm leading-relaxed text-slate-700">{description}</p>
      )}
      {district && (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
          {district.days.map((day) => (
            <div key={day.date} className="rounded-lg bg-white p-3 text-center shadow">
              <div className="text-sm font-medium text-sky-900">{day.date.slice(5)}</div>
              <img src={weatherIconUrl(day.wxCode)} alt="" className="mx-auto my-1 h-10 w-10" />
              <div className="text-sm">{day.wxText}</div>
              <div className="text-xs text-slate-600">
                {day.temp}°C · {day.pop}%
              </div>
            </div>
          ))}
        </div>
      )}
      {!district && !isLoading && <p>找不到此鄉鎮資料</p>}
    </PageShell>
  )
}
