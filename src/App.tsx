import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AlertBar } from './components/layout/AlertBar'
import { BackToTop } from './components/layout/BackToTop'
import { CountyStickyNav } from './components/layout/CountyStickyNav'
import { Header } from './components/layout/Header'
import { CountyDetailPage } from './pages/CountyDetailPage'
import { CountyForecastPage } from './pages/CountyForecastPage'
import { HomePage } from './pages/HomePage'
import { ObservationPage } from './pages/ObservationPage'
import { TownDetailPage } from './pages/TownDetailPage'
import { TownForecastPage } from './pages/TownForecastPage'
import { WarningsPage } from './pages/WarningsPage'
import { WeekForecastPage } from './pages/WeekForecastPage'
import { AstronomyPage } from './pages/AstronomyPage'
import { EarthquakePage } from './pages/EarthquakePage'
import { MarinePage } from './pages/MarinePage'
import './index.css'

const qc = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
        <div className="min-h-screen bg-slate-100">
          <Header />
          <AlertBar />
          <CountyStickyNav />
          <main className="cwa-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/forecast/county" element={<CountyForecastPage />} />
              <Route path="/forecast/town" element={<TownForecastPage />} />
              <Route path="/forecast/week" element={<WeekForecastPage />} />
              <Route path="/observation" element={<ObservationPage />} />
              <Route path="/warnings" element={<WarningsPage />} />
              <Route path="/county/:county" element={<CountyDetailPage />} />
              <Route path="/town/:county/:town" element={<TownDetailPage />} />
              <Route path="/earthquake" element={<EarthquakePage />} />
              <Route path="/marine" element={<MarinePage />} />
              <Route path="/astronomy" element={<AstronomyPage />} />
            </Routes>
          </main>
          <BackToTop />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
