import { useMemo, useState } from 'react'
import { TAIWAN_COUNTIES, nearestCounty } from '../../data/taiwanCounties'
import { useSelectedCounty } from '../../hooks/useSelectedCounty'
import { useAirQuality, useCounty36h, useDistricts } from '../../hooks/useWeatherQueries'
import { findCountySummary, weatherIconUrl } from '../../lib/countyForecast'
import { aqiColor, nearestStation, toAirQualityUi } from '../../lib/aqi'
import { useAppStore } from '../../store/appStore'

export function WeatherCard() {
  const { selectedCounty, setSelectedCounty, hasCounty } = useSelectedCounty()

  const favoriteCounties = useAppStore((s) => s.favoriteCounties)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)

  const { data: allCounties = [], isLoading, error, dataUpdatedAt } = useCounty36h()
  const { data: districts = [] } = useDistricts(selectedCounty)
  const { data: aqiStations = [] } = useAirQuality()
  const [town, setTown] = useState('')

  const summary = useMemo(
    () => (hasCounty ? findCountySummary(allCounties, selectedCounty) : undefined),
    [allCounties, selectedCounty, hasCounty],
  )

  const countyMeta = TAIWAN_COUNTIES.find((c) => c.nameZh === selectedCounty)
  const aqi = useMemo(() => {
    if (!countyMeta || aqiStations.length === 0) return undefined
    const station = nearestStation(aqiStations, countyMeta.lat, countyMeta.lng)
    return station ? toAirQualityUi(station) : undefined
  }, [aqiStations, countyMeta])

  const isFavorite = hasCounty && favoriteCounties.includes(selectedCounty)
  const [today, ...nextDays] = summary?.slots ?? []

  const issued = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleString('zh-TW', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  const locate = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((pos) => {
      setSelectedCounty(nearestCounty(pos.coords.latitude, pos.coords.longitude).nameZh)
    })
  }

  return (
    <div className="cwa-weather-panel">
      <ul className="cwa-favorite-bar">
        {favoriteCounties.map((c) => (
          <li key={c}>
            <button type="button" className="cwa-fav-tag" onClick={() => setSelectedCounty(c)}>
              {c.replace('臺', '台').slice(0, 3)}
            </button>
          </li>
        ))}
      </ul>

      <div className="cwa-county-header">
        <div>
          <div className="cwa-county-name">{hasCounty ? selectedCounty : '請選擇縣市'}</div>
          <div className="cwa-county-datetime">
            {new Date().toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' })}
            {issued && <span className="ml-2 text-white/70">更新 {issued}</span>}
          </div>
        </div>
        <div className="cwa-county-actions">
          <button
            type="button"
            className="cwa-fn-btn"
            onClick={() => {
              useAppStore.getState().setForecastPanel('county')
              document.querySelector('#forecast-panel')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <i className="fa fa-plus" aria-hidden />
            <span>更多</span>
          </button>
          <button type="button" className="cwa-fn-btn" onClick={locate}>
            <i className="fa fa-map-marker" aria-hidden />
            <span>定位</span>
          </button>
          <button type="button" className="cwa-fn-btn" onClick={() => toggleFavorite(selectedCounty)} disabled={!hasCounty}>
            <i className={isFavorite ? 'icon-heart-fill' : 'icon-heart'} aria-hidden />
            <span>最愛</span>
          </button>
        </div>
      </div>

      {isLoading && <p className="text-sm text-white/90">載入預報中…</p>}
      {error && <p className="text-sm text-red-200">無法取得預報資料</p>}

      {!hasCounty && !isLoading && (
        <p className="cwa-panel-placeholder">點擊上方地圖或頂部導覽列選擇縣市，即可查看天氣預報與空品資訊。</p>
      )}

      {hasCounty && today && (
        <div className="cwa-today-tem">
          <div className="cwa-today-label">{today.label}</div>
          <img src={weatherIconUrl(today.wxCode)} alt="" className="cwa-today-icon" />
          <div className="cwa-today-wx">{today.wxText}</div>
          <div className="cwa-today-temp">
            <span className="low">{today.minT}°</span>
            <span className="sep"> – </span>
            <span className="high">{today.maxT}°</span>
            <span className="unit">C</span>
          </div>
          <div className="cwa-today-rain">
            <i className="fa fa-tint" aria-hidden />
            降雨機率 {today.pop}%
          </div>
        </div>
      )}

      {hasCounty && nextDays.length > 0 && (
        <div className="cwa-weather-days">
          {nextDays.map((slot) => (
            <div key={slot.label} className="cwa-col-day">
              <div className="day-label">{slot.label}</div>
              <img src={weatherIconUrl(slot.wxCode)} alt="" className="day-icon" />
              <div className="day-wx">{slot.wxText}</div>
              <div className="day-temp">
                {slot.minT}–{slot.maxT}°C
              </div>
              <div className="day-rain">雨 {slot.pop}%</div>
            </div>
          ))}
        </div>
      )}

      {hasCounty && (
      <form
        className="cwa-town-form"
        onSubmit={(e) => {
          e.preventDefault()
          if (town) {
            useAppStore.getState().setForecastPanel('town')
            document.getElementById('forecast-panel')?.scrollIntoView({ behavior: 'smooth' })
          }
        }}
      >
        <label htmlFor="home-select-town">鄉鎮預報</label>
        <select
          id="home-select-town"
          className="cwa-town-select"
          value={town}
          onChange={(e) => setTown(e.target.value)}
        >
          <option value="">請選擇鄉鎮</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <button type="submit" className="cwa-town-submit">
          確定
        </button>
      </form>
      )}

      {hasCounty && aqi && (
        <div className="cwa-weather-air">
          <div className="cwa-air-title">
            空氣品質監測（{aqi.station}）
          </div>
          <div className="cwa-airbar">
            <span className="cwa-air-aqi" style={{ backgroundColor: aqiColor(aqi.aqi) }}>
              AQI {aqi.aqi}
            </span>
            <span className="cwa-air-status">{aqi.status}</span>
            <span className="cwa-air-pm">PM2.5 {aqi.pm25}</span>
          </div>
        </div>
      )}

    </div>
  )
}
