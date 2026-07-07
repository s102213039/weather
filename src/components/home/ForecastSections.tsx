import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { normalizeCountyName } from '../../data/taiwanCounties'
import { useSelectedCounty } from '../../hooks/useSelectedCounty'
import { useCounty36h, useDistrictForecasts, useObservation } from '../../hooks/useWeatherQueries'
import { weatherIconUrl } from '../../lib/countyForecast'
import { useAppStore } from '../../store/appStore'

function SectionHead({ id, title, desc }: { id: string; title: string; desc: string }) {
  return (
    <header id={id} className="cwa-section-head scroll-mt-36">
      <h2>{title}</h2>
      <p>{desc}</p>
    </header>
  )
}

function CountyGate({ children }: { children: ReactNode }) {
  const { hasCounty } = useSelectedCounty()
  if (!hasCounty) {
    return (
      <p className="cwa-empty-hint">
        請於頂部吸頂導覽列選擇縣市，或點擊地圖上的縣市區域，即可顯示此區塊資料。
      </p>
    )
  }
  return children
}

function countyDesc(prefix: string, selectedCounty: string, hasCounty: boolean) {
  return hasCounty ? `${selectedCounty} · ${prefix}` : prefix
}

export function CountyForecastSection() {
  const { selectedCounty, hasCounty } = useSelectedCounty()
  const { data = [], isLoading, error } = useCounty36h()
  const filtered = hasCounty
    ? data.filter((c) => normalizeCountyName(c.countyName) === normalizeCountyName(selectedCounty))
    : []

  return (
    <section className="cwa-home-section">
      <SectionHead
        id="forecast-county"
        title="縣市預報總覽"
        desc={countyDesc('今明 36 小時三時段預報', selectedCounty, hasCounty)}
      />
      <CountyGate>
        {isLoading && <p>載入中…</p>}
        {error && <p className="text-red-600">無法載入資料</p>}
        {!isLoading && filtered.length === 0 && <p className="cwa-empty-hint">查無此縣市預報資料</p>}
        {filtered.length > 0 && (
          <div className="cwa-table-wrap">
            <table className="cwa-data-table">
              <thead>
                <tr>
                  <th>縣市</th>
                  <th>時段</th>
                  <th>天氣</th>
                  <th>溫度</th>
                  <th>降雨機率</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) =>
                  c.slots.map((slot, i) => (
                    <tr key={`${c.countyName}-${slot.label}`}>
                      {i === 0 && (
                        <td rowSpan={c.slots.length} className="font-medium">
                          <Link to={`/county/${encodeURIComponent(c.countyName)}`}>{c.countyName}</Link>
                        </td>
                      )}
                      <td className="text-center">{slot.label}</td>
                      <td>
                        <div className="cwa-wx-cell">
                          <img src={weatherIconUrl(slot.wxCode)} alt="" />
                          {slot.wxText}
                        </div>
                      </td>
                      <td className="text-center">
                        {slot.minT}–{slot.maxT}°C
                      </td>
                      <td className="text-center">{slot.pop}%</td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        )}
      </CountyGate>
    </section>
  )
}

export function TownForecastSection() {
  const { selectedCounty, hasCounty } = useSelectedCounty()
  const { data = [], isLoading, error } = useDistrictForecasts(selectedCounty)

  return (
    <section className="cwa-home-section">
      <SectionHead id="forecast-town" title="鄉鎮預報總覽" desc={countyDesc('各鄉鎮一週預報摘要', selectedCounty, hasCounty)} />
      <CountyGate>
        {isLoading && <p>載入中…</p>}
        {error && <p className="text-red-600">無法載入資料</p>}
        <div className="cwa-town-grid grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {data.map((d) => {
            const today = d.days[0]
            return (
              <Link
                key={d.districtName}
                to={`/town/${encodeURIComponent(selectedCounty)}/${encodeURIComponent(d.districtName)}`}
                className="cwa-town-card"
              >
                <div className="font-semibold">{d.districtName}</div>
                {today && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
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
      </CountyGate>
    </section>
  )
}

export function WeekForecastSection() {
  const { selectedCounty, hasCounty } = useSelectedCounty()
  const { data = [], isLoading, error } = useDistrictForecasts(selectedCounty)
  const dates = data[0]?.days.map((d) => d.date) ?? []

  return (
    <section className="cwa-home-section">
      <SectionHead id="forecast-week" title="一週天氣預報" desc={countyDesc('各鄉鎮未來 7 日', selectedCounty, hasCounty)} />
      <CountyGate>
        {isLoading && <p>載入中…</p>}
        {error && <p className="text-red-600">無法載入資料</p>}
        {data.length > 0 && (
          <div className="cwa-table-wrap">
            <table className="cwa-data-table text-xs md:text-sm">
              <thead>
                <tr>
                  <th className="text-left">鄉鎮</th>
                  {dates.map((d) => (
                    <th key={d} className="text-center">
                      {d.slice(5)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.districtName}>
                    <td className="font-medium whitespace-nowrap">{row.districtName}</td>
                    {dates.map((d) => {
                      const day = row.days.find((x) => x.date === d)
                      if (!day) return <td key={d} className="text-center">--</td>
                      return (
                        <td key={d} className="text-center">
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
      </CountyGate>
    </section>
  )
}

export function ObservationSection() {
  const { selectedCounty, hasCounty } = useSelectedCounty()
  const { data = [], isLoading, error } = useObservation()

  const filtered = data.filter(
    (s) => normalizeCountyName(s.county) === normalizeCountyName(selectedCounty),
  )

  return (
    <section className="cwa-home-section">
      <SectionHead id="forecast-obs" title="最新天氣觀測" desc={countyDesc('自動氣象站 10 分鐘觀測', selectedCounty, hasCounty)} />
      <CountyGate>
        {isLoading && <p>載入中…</p>}
        {error && <p className="text-red-600">無法載入資料</p>}
        <p className="mb-2 text-sm text-slate-500">共 {filtered.length} 站</p>
        <div className="cwa-table-wrap">
          <table className="cwa-data-table">
            <thead>
              <tr>
                <th className="text-left">測站</th>
                <th>縣市</th>
                <th>鄉鎮</th>
                <th>天氣</th>
                <th>溫度</th>
                <th>濕度</th>
                <th>風速</th>
                <th>雨量</th>
                <th>觀測時間</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td className="font-medium">{s.name}</td>
                  <td className="text-center">{s.county}</td>
                  <td className="text-center">{s.town}</td>
                  <td className="text-center">{s.weather}</td>
                  <td className="text-center">{s.temp}°C</td>
                  <td className="text-center">{s.humidity}%</td>
                  <td className="text-center">{s.windSpeed} m/s</td>
                  <td className="text-center">{s.rain}</td>
                  <td className="text-center text-xs text-slate-500">
                    {s.obsTime.replace('T', ' ').slice(0, 16)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CountyGate>
    </section>
  )
}

export function HomeForecastSections() {
  const forecastPanel = useAppStore((s) => s.forecastPanel)

  return (
    <div id="forecast-panel" className="cwa-forecast-sections scroll-mt-36">
      {forecastPanel === 'county' && <CountyForecastSection />}
      {forecastPanel === 'town' && <TownForecastSection />}
      {forecastPanel === 'week' && <WeekForecastSection />}
      {forecastPanel === 'obs' && <ObservationSection />}
    </div>
  )
}
