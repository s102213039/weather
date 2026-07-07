export type ForecastPanel = 'county' | 'town' | 'week' | 'obs'

export const FORECAST_PANELS: { id: ForecastPanel; label: string }[] = [
  { id: 'county', label: '縣市預報總覽' },
  { id: 'town', label: '鄉鎮預報總覽' },
  { id: 'week', label: '一週天氣預報' },
  { id: 'obs', label: '最新天氣觀測' },
]

export const FORECAST_PANEL_HASH: Record<ForecastPanel, string> = {
  county: 'forecast-county',
  town: 'forecast-town',
  week: 'forecast-week',
  obs: 'forecast-obs',
}

export function panelFromHash(hash: string): ForecastPanel | null {
  const key = hash.replace(/^#/, '')
  const hit = FORECAST_PANELS.find((p) => FORECAST_PANEL_HASH[p.id] === key)
  return hit?.id ?? null
}
