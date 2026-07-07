import type { BasicLocation, CountyForecastResponse, CountySummary, DistrictForecastResponse, TimeSlotForecast, WarningResponse } from '../types/weather'
import { COUNTY_DATASET_MAP } from '../data/countySvgMap'
import { normalizeCountyName } from '../data/taiwanCounties'

const SLOT_LABELS = ['今日白天', '今夜明晨', '明日白天']

function padWxCode(raw: string | undefined): string {
  const t = (raw ?? '01').trim()
  return t.length === 1 ? `0${t}` : t
}

function elementTimes(loc: BasicLocation, name: string) {
  return loc.weatherElement?.find((e) => e.elementName === name)?.time ?? []
}

export function parseCounty36h(response: CountyForecastResponse): CountySummary[] {
  const locations = response.records?.location ?? []
  return locations.map((loc) => {
    const wxTimes = elementTimes(loc, 'Wx')
    const minTs = elementTimes(loc, 'MinT')
    const maxTs = elementTimes(loc, 'MaxT')
    const popTs = elementTimes(loc, 'PoP')

    const slots: TimeSlotForecast[] = SLOT_LABELS.map((label, i) => ({
      label,
      wxText: wxTimes[i]?.parameter?.parameterName ?? '--',
      wxCode: padWxCode(wxTimes[i]?.parameter?.parameterValue),
      minT: minTs[i]?.parameter?.parameterName ?? '--',
      maxT: maxTs[i]?.parameter?.parameterName ?? '--',
      pop: popTs[i]?.parameter?.parameterName ?? '0',
    }))

    return { countyName: loc.locationName ?? '', slots }
  })
}

export function findCountySummary(all: CountySummary[], countyName: string): CountySummary | undefined {
  const key = normalizeCountyName(countyName)
  return all.find((c) => normalizeCountyName(c.countyName) === key)
}

export function resolveDistrictDatasetId(countyName: string): string {
  const key = normalizeCountyName(countyName)
  return COUNTY_DATASET_MAP[key] ?? 'F-D0047-091'
}

export function parseDistrictNames(response: DistrictForecastResponse): string[] {
  const groups = response.records?.Locations ?? []
  const names: string[] = []
  for (const g of groups) {
    for (const loc of g.Location ?? []) {
      if (loc.LocationName) names.push(loc.LocationName)
    }
  }
  return [...new Set(names)].sort((a, b) => a.localeCompare(b, 'zh-Hant'))
}

export function parseWarnings(response: WarningResponse): string[] {
  const locs = response.records?.location ?? []
  const msgs = new Set<string>()
  for (const l of locs) {
    if (l.phenomena && l.significance) {
      msgs.add(`${l.phenomena}${l.significance}`)
    }
  }
  return [...msgs]
}

export function weatherIconUrl(code: string): string {
  return `${import.meta.env.BASE_URL}weather/ic_weather_${padWxCode(code)}.svg`
}
