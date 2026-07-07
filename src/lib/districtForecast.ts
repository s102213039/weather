import type { DistrictForecastResponse, DistrictDayForecast, DistrictSummary } from '../types/weather'

type RawElement = {
  ElementName?: string
  Time?: Array<{
    StartTime?: string
    DataTime?: string
    ElementValue?: Array<Record<string, string>>
  }>
}

function timeKey(t: { StartTime?: string; DataTime?: string }) {
  return (t.StartTime ?? t.DataTime ?? '').slice(0, 10)
}

function pickValue(values: Array<Record<string, string>> | undefined, keys: string[]): string {
  if (!values?.[0]) return '--'
  for (const k of keys) {
    const v = values[0][k]
    if (v) return v
  }
  return '--'
}

function padWxCode(raw: string | undefined): string {
  const t = (raw ?? '01').trim()
  return t.length === 1 ? `0${t}` : t
}

function findElement(elements: RawElement[], names: string[]): RawElement | undefined {
  return elements.find((e) => names.includes(e.ElementName ?? ''))
}

function resolveTemp(
  elements: RawElement[],
  date: string,
): string {
  const avgEl = findElement(elements, ['溫度', '平均溫度'])
  const maxEl = findElement(elements, ['最高溫度'])
  const minEl = findElement(elements, ['最低溫度'])

  const avgTime = avgEl?.Time?.find((t) => timeKey(t) === date)
  const avg = pickValue(avgTime?.ElementValue, ['Temperature'])

  const maxTime = maxEl?.Time?.find((t) => timeKey(t) === date)
  const minTime = minEl?.Time?.find((t) => timeKey(t) === date)
  const max = pickValue(maxTime?.ElementValue, ['MaxTemperature'])
  const min = pickValue(minTime?.ElementValue, ['MinTemperature'])

  if (max !== '--' && min !== '--') return `${min}–${max}`
  if (avg !== '--') return avg
  if (max !== '--') return max
  if (min !== '--') return min
  return '--'
}

function buildDayMap(elements: RawElement[]) {
  const wxEl = findElement(elements, ['天氣現象'])
  const popEl = findElement(elements, ['3小時降雨機率', '12小時降雨機率'])

  const days = new Map<string, DistrictDayForecast>()

  for (const t of wxEl?.Time ?? []) {
    const date = timeKey(t)
    if (!date) continue
    const val = t.ElementValue?.[0]
    days.set(date, {
      date,
      wxText: val?.Weather ?? '--',
      wxCode: padWxCode(val?.WeatherCode),
      pop: '0',
      temp: '--',
    })
  }

  for (const t of popEl?.Time ?? []) {
    const date = timeKey(t)
    const day = days.get(date)
    if (day) {
      day.pop = pickValue(t.ElementValue, ['ProbabilityOfPrecipitation'])
    }
  }

  for (const day of days.values()) {
    day.temp = resolveTemp(elements, day.date)
  }

  return [...days.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 7)
}

export function parseDistrictForecasts(response: DistrictForecastResponse): DistrictSummary[] {
  const groups = response.records?.Locations ?? []
  const out: DistrictSummary[] = []

  for (const g of groups) {
    for (const loc of g.Location ?? []) {
      const name = loc.LocationName
      if (!name) continue
      const elements = (loc.WeatherElement ?? []) as RawElement[]
      out.push({ districtName: name, days: buildDayMap(elements) })
    }
  }

  return out.sort((a, b) => a.districtName.localeCompare(b.districtName, 'zh-Hant'))
}

export function findDistrict(
  all: DistrictSummary[],
  districtName: string,
): DistrictSummary | undefined {
  return all.find((d) => d.districtName === districtName)
}

export function districtDescription(response: DistrictForecastResponse, districtName: string): string | undefined {
  for (const g of response.records?.Locations ?? []) {
    for (const loc of g.Location ?? []) {
      if (loc.LocationName !== districtName) continue
      const descEl = (loc.WeatherElement as RawElement[] | undefined)?.find(
        (e) => e.ElementName === '天氣預報綜合描述',
      )
      const first = descEl?.Time?.[0]?.ElementValue?.[0]
      return first?.WeatherDescription
    }
  }
  return undefined
}
