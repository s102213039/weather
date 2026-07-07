import type { TideDay, TideEvent, TideLocation } from '../types/phase3'

export type TideResponse = {
  records?: {
    TideForecasts?: Array<Record<string, unknown>>
  }
}

export function parseTideLocations(response: TideResponse): TideLocation[] {
  const items = response.records?.TideForecasts ?? []
  return items.map(parseLocation).sort((a, b) => a.name.localeCompare(b.name, 'zh-TW'))
}

function parseLocation(raw: Record<string, unknown>): TideLocation {
  const periods = raw.TimePeriods as Record<string, unknown> | undefined
  const daily = (periods?.Daily as Array<Record<string, unknown>>) ?? []

  const days: TideDay[] = daily.map((d) => {
    const events = ((d.Time as Array<Record<string, unknown>>) ?? []).map(
      (t): TideEvent => ({
        dateTime: String(t.DateTime ?? ''),
        type: String(t.Tide ?? ''),
        heightCm: String(
          (t.TideHeights as Record<string, string> | undefined)?.AboveLocalMSL ?? '',
        ),
      }),
    )
    return {
      date: String(d.Date ?? ''),
      lunarDate: String(d.LunarDate ?? ''),
      tideRange: String(d.TideRange ?? ''),
      events: events.sort((a, b) => a.dateTime.localeCompare(b.dateTime)),
    }
  })

  return {
    id: String(raw.LocationId ?? ''),
    name: String(raw.LocationName ?? ''),
    lat: Number(raw.Latitude ?? 0),
    lng: Number(raw.Longitude ?? 0),
    days: days.sort((a, b) => a.date.localeCompare(b.date)),
  }
}

export function tideDayForDate(loc: TideLocation, isoDate: string): TideDay | undefined {
  return loc.days.find((d) => d.date === isoDate)
}
