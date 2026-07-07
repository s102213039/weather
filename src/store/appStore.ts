import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { normalizeCountyName } from '../data/taiwanCounties'
import type { ForecastPanel } from '../data/forecastPanels'

type Lang = 'zh' | 'en'

type AppState = {
  selectedCounty: string
  favoriteCounties: string[]
  lang: Lang
  forecastPanel: ForecastPanel
  setSelectedCounty: (name: string) => void
  toggleFavorite: (name: string) => void
  setLang: (lang: Lang) => void
  setForecastPanel: (panel: ForecastPanel) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedCounty: '',
      favoriteCounties: [],
      lang: 'zh',
      forecastPanel: 'county',
      setSelectedCounty: (name) => {
        const trimmed = name.trim()
        if (!trimmed) return set({ selectedCounty: '' })
        set({ selectedCounty: normalizeCountyName(trimmed) })
      },
      toggleFavorite: (name) => {
        const key = normalizeCountyName(name)
        const cur = get().favoriteCounties
        set({
          favoriteCounties: cur.includes(key)
            ? cur.filter((c) => c !== key)
            : [...cur, key],
        })
      },
      setLang: (lang) => set({ lang }),
      setForecastPanel: (panel) => set({ forecastPanel: panel }),
    }),
    { name: 'cwa-spa-prefs' },
  ),
)
