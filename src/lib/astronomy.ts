import { normalizeCountyName } from '../data/taiwanCounties'
import type { AstronomyCounty, MoonDay, SunDay } from '../types/phase3'

export type SunResponse = {
  records?: {
    locations?: {
      location?: Array<Record<string, unknown>>
    }
  }
}

export type MoonResponse = {
  records?: {
    locations?: {
      location?: Array<Record<string, unknown>>
    }
  }
}

export function parseSunCounties(response: SunResponse): Map<string, SunDay[]> {
  const locs = response.records?.locations?.location ?? []
  const map = new Map<string, SunDay[]>()
  for (const loc of locs) {
    const county = normalizeCountyName(String(loc.CountyName ?? ''))
    const days = ((loc.time as Array<Record<string, string>>) ?? []).map(parseSunDay)
    map.set(county, days)
  }
  return map
}

export function parseMoonCounties(response: MoonResponse): Map<string, MoonDay[]> {
  const locs = response.records?.locations?.location ?? []
  const map = new Map<string, MoonDay[]>()
  for (const loc of locs) {
    const county = normalizeCountyName(String(loc.CountyName ?? ''))
    const days = ((loc.time as Array<Record<string, string>>) ?? []).map(parseMoonDay)
    map.set(county, days)
  }
  return map
}

export function mergeAstronomy(
  sun: Map<string, SunDay[]>,
  moon: Map<string, MoonDay[]>,
): AstronomyCounty[] {
  const counties = new Set([...sun.keys(), ...moon.keys()])
  return [...counties]
    .sort((a, b) => a.localeCompare(b, 'zh-TW'))
    .map((countyName) => ({
      countyName,
      sunDays: sun.get(countyName) ?? [],
      moonDays: moon.get(countyName) ?? [],
    }))
}

function parseSunDay(raw: Record<string, string>): SunDay {
  return {
    date: raw.Date ?? '',
    civilTwilightBegin: raw.BeginCivilTwilightTime ?? '',
    sunrise: raw.SunRiseTime ?? '',
    sunriseAz: raw.SunRiseAZ ?? '',
    transit: raw.SunTransitTime ?? '',
    transitAlt: raw.SunTransitAlt ?? '',
    sunset: raw.SunSetTime ?? '',
    sunsetAz: raw.SunSetAZ ?? '',
    civilTwilightEnd: raw.EndCivilTwilightTime ?? '',
  }
}

function parseMoonDay(raw: Record<string, string>): MoonDay {
  return {
    date: raw.Date ?? '',
    moonRise: raw.MoonRiseTime ?? '',
    moonRiseAz: raw.MoonRiseAZ ?? '',
    moonTransit: raw.MoonTransitTime ?? '',
    moonTransitAlt: raw.MoonTransitAlt ?? '',
    moonSet: raw.MoonSetTime ?? '',
    moonSetAz: raw.MoonSetAZ ?? '',
  }
}

export function dayForDate<T extends { date: string }>(days: T[], isoDate: string): T | undefined {
  return days.find((d) => d.date === isoDate)
}

/** ponytail: linear scan; dataset is ~180 days per county */
export function nearestDay<T extends { date: string }>(days: T[], isoDate: string): T | undefined {
  if (!days.length) return undefined
  const exact = dayForDate(days, isoDate)
  if (exact) return exact
  let best = days[0]
  let bestDiff = Math.abs(days[0].date.localeCompare(isoDate))
  for (const d of days) {
    const diff = Math.abs(d.date.localeCompare(isoDate))
    if (diff < bestDiff) {
      best = d
      bestDiff = diff
    }
  }
  return best
}

export function daysFromDate<T extends { date: string }>(days: T[], isoDate: string, count: number): T[] {
  const idx = days.findIndex((d) => d.date >= isoDate)
  const start = idx >= 0 ? idx : Math.max(0, days.length - count)
  return days.slice(start, start + count)
}
