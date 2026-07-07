import type { WarningResponse, WarningDetail } from '../types/weather'

export function parseWarningDetails(response: WarningResponse): WarningDetail[] {
  const locs = response.records?.location ?? []
  const out: WarningDetail[] = []

  for (const l of locs) {
    const hazards = (l as { hazardConditions?: { hazards?: Array<{ phenomenon?: string; significance?: string }> } })
      .hazardConditions?.hazards
    if (hazards?.length) {
      out.push({
        county: l.locationName ?? '',
        hazards: hazards.map((h) => `${h.phenomenon ?? ''}${h.significance ?? ''}`.trim()).filter(Boolean),
      })
    } else if (l.phenomena && l.significance) {
      out.push({ county: l.locationName ?? '', hazards: [`${l.phenomena}${l.significance}`] })
    }
  }

  return out.filter((w) => w.hazards.length > 0)
}
