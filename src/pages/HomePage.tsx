import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { panelFromHash } from '../data/forecastPanels'
import { ParallaxHero } from '../components/hero/ParallaxHero'
import { WeatherCard } from '../components/hero/WeatherCard'
import { TaiwanMap } from '../components/hero/TaiwanMap'
import { ImagerySidebar } from '../components/home/ImagerySidebar'
import { HomeForecastSections } from '../components/home/ForecastSections'
import { useAppStore } from '../store/appStore'

export function HomePage() {
  const location = useLocation()
  const setForecastPanel = useAppStore((s) => s.setForecastPanel)

  useEffect(() => {
    const panel = panelFromHash(location.hash)
    if (panel) setForecastPanel(panel)
    if (location.hash === '#forecast-panel' || panel) {
      requestAnimationFrame(() => {
        document.querySelector('#forecast-panel')?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [location.hash, setForecastPanel])

  return (
    <>
      <ParallaxHero>
        <div className="cwa-hero-grid">
          <div className="cwa-hero-imagery-slot">
            <ImagerySidebar />
          </div>
          <div className="cwa-hero-card-slot">
            <WeatherCard />
          </div>
          <div className="cwa-hero-map-zone">
            <TaiwanMap />
          </div>
        </div>
      </ParallaxHero>

      <div className="cwa-content-layout">
        <div className="cwa-imagery-below-slot">
          <ImagerySidebar />
        </div>
        <HomeForecastSections />
      </div>
    </>
  )
}
