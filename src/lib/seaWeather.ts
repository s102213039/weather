import type { SeaWeatherArea, SeaWeatherSlot } from '../types/phase3'

export type FileApiResponse = {
  cwaopendata?: {
    Dataset?: {
      Locations?: {
        Location?: Array<Record<string, unknown>>
      }
    }
  }
}

export function parseSeaWeather(response: FileApiResponse): SeaWeatherArea[] {
  const locs = response.cwaopendata?.Dataset?.Locations?.Location ?? []
  return locs.map(parseArea)
}

function parseArea(raw: Record<string, unknown>): SeaWeatherArea {
  const elements = (raw.WeatherElement as Array<Record<string, unknown>>) ?? []
  const byStart = new Map<string, Partial<SeaWeatherSlot>>()

  for (const el of elements) {
    const name = String(el.ElementName ?? '')
    const times = (el.Time as Array<Record<string, unknown>>) ?? []
    for (const t of times) {
      const start = String(t.StartTime ?? '')
      const end = String(t.EndTime ?? '')
      const slot = byStart.get(start) ?? { start, end, weather: '', windDir: '', windScale: '', waveHeight: '' }
      slot.end = end
      const val = t.ElementValue as Record<string, string> | undefined
      if (!val) continue
      if (name === '天氣現象') slot.weather = val.Weather ?? ''
      if (name === '風向描述') slot.windDir = val.WindDirectionDescription ?? ''
      if (name === '蒲福風級描述') slot.windScale = val.BeaufortScaleDescription ?? ''
      if (name === '浪高描述') slot.waveHeight = val.WaveHeightDescription ?? ''
      byStart.set(start, slot)
    }
  }

  const slots = [...byStart.values()]
    .map((s) => s as SeaWeatherSlot)
    .sort((a, b) => a.start.localeCompare(b.start))

  return { name: String(raw.LocationName ?? ''), slots }
}
