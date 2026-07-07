import { useLocation, useNavigate } from 'react-router-dom'
import { FORECAST_PANELS } from '../../data/forecastPanels'
import { TAIWAN_COUNTIES } from '../../data/taiwanCounties'
import { useSelectedCounty } from '../../hooks/useSelectedCounty'
import { useAppStore } from '../../store/appStore'

const PANEL_ANCHOR = '#forecast-panel'

export function CountyStickyNav() {
  const { selectedCounty, setSelectedCounty, hasCounty } = useSelectedCounty()
  const forecastPanel = useAppStore((s) => s.forecastPanel)
  const setForecastPanel = useAppStore((s) => s.setForecastPanel)
  const location = useLocation()
  const navigate = useNavigate()

  const openPanel = (panel: (typeof FORECAST_PANELS)[number]['id']) => {
    setForecastPanel(panel)
    if (location.pathname === '/') {
      document.querySelector(PANEL_ANCHOR)?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    navigate({ pathname: '/', hash: 'forecast-panel' })
  }

  return (
    <div className="cwa-county-sticky" role="navigation" aria-label="縣市選擇">
      <div className="cwa-county-sticky-inner">
        <label className="cwa-county-sticky-label" htmlFor="global-county-select">
          目前縣市
        </label>
        <select
          id="global-county-select"
          className="cwa-county-sticky-select"
          value={selectedCounty}
          onChange={(e) => setSelectedCounty(e.target.value)}
        >
          <option value="">全部（未選取）</option>
          {TAIWAN_COUNTIES.map((c) => (
            <option key={c.id} value={c.nameZh}>
              {c.nameZh}
            </option>
          ))}
        </select>
        <span className="cwa-county-sticky-hint">
          {hasCounty ? `顯示 ${selectedCounty} 相關資料` : '點選地圖或下拉選單以指定縣市'}
        </span>
        <nav className="cwa-county-sticky-links" aria-label="預報區塊">
          {FORECAST_PANELS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`cwa-county-sticky-link ${forecastPanel === p.id ? 'is-active' : ''}`}
              onClick={() => openPanel(p.id)}
              aria-current={forecastPanel === p.id ? 'page' : undefined}
            >
              {p.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
