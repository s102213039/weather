import { useMemo } from 'react'
import rawSvg from '../../assets/taiwan-map-raw.svg?raw'
import { SVG_ID_TO_COUNTY, COUNTY_TO_SVG_ID } from '../../data/countySvgMap'
import { MAP_ICON_POSITIONS } from '../../data/mapIconPositions'
import { useCounty36h } from '../../hooks/useWeatherQueries'
import { findCountySummary, weatherIconUrl } from '../../lib/countyForecast'
import { useSelectedCounty } from '../../hooks/useSelectedCounty'

function extractPaths(svg: string) {
  const re = /<g id="(C[^"]+)">[\s\S]*?<path[^>]*\sd="([^"]+)"/g
  const paths: Array<{ id: string; d: string }> = []
  let m: RegExpExecArray | null
  while ((m = re.exec(svg))) paths.push({ id: m[1], d: m[2] })
  return paths
}

export function TaiwanMap() {
  const { selectedCounty, setSelectedCounty, hasCounty } = useSelectedCounty()
  const { data: allCounties = [] } = useCounty36h()
  const paths = useMemo(() => extractPaths(rawSvg), [])
  const selectedSvgId = hasCounty ? COUNTY_TO_SVG_ID[selectedCounty] : undefined

  return (
    <div className="cwa-map-theme relative mx-auto w-full max-w-md">
      <svg viewBox="0 0 400 535" className="cwa-map-svg h-auto w-full" role="img" aria-label="台灣縣市天氣地圖">
        {paths.map(({ id, d }) => {
          const county = SVG_ID_TO_COUNTY[id]
          if (!county) return null
          const active = id === selectedSvgId
          return (
            <path
              key={id}
              d={d}
              className={`cwa-map-path ${active ? 'is-active' : ''}`}
              onClick={() => setSelectedCounty(county)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedCounty(county)
              }}
              tabIndex={0}
              role="button"
              aria-label={`${county}天氣`}
              aria-pressed={active}
            />
          )
        })}
      </svg>

      <div className="cwa-weather-data pointer-events-none absolute inset-0">
        {Object.entries(MAP_ICON_POSITIONS).map(([svgId, pos]) => {
          const county = SVG_ID_TO_COUNTY[svgId]
          if (!county) return null
          const summary = findCountySummary(allCounties, county)
          const slot = summary?.slots[0]
          if (!slot) return null
          const active = svgId === selectedSvgId
          return (
            <button
              key={svgId}
              type="button"
              className={`cwa-icon-zone pointer-events-auto ${active ? 'is-active' : ''}`}
              style={{ left: pos.left, top: pos.top }}
              onClick={() => setSelectedCounty(county)}
              title={`${county} ${slot.wxText} ${slot.minT}–${slot.maxT}°C`}
            >
              {active && <span className="cwa-icon-zone-city">{county.replace('市', '').replace('縣', '')}</span>}
              {active && (
                <span className="cwa-icon-zone-temp">
                  {slot.minT}–{slot.maxT}°
                </span>
              )}
              <img src={weatherIconUrl(slot.wxCode)} alt="" className="cwa-map-weather-icon" />
              {active && slot.pop !== '0' && (
                <span className="cwa-icon-zone-rain">降雨 {slot.pop}%</span>
              )}
            </button>
          )
        })}
      </div>

      <p className="cwa-map-hint pointer-events-none absolute bottom-1 right-2 text-xs text-white/80">
        <i className="icon-warn mr-1" aria-hidden />
        點擊地圖看其他縣市
      </p>
    </div>
  )
}
