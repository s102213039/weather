import type { EarthquakeReport, ShakingArea, ShakingStation } from '../types/phase3'

export type EqResponse = {
  records?: {
    Earthquake?: Array<Record<string, unknown>>
  }
}

export function parseEarthquakeReports(response: EqResponse): EarthquakeReport[] {
  const items = response.records?.Earthquake ?? []
  return items.map(parseOne).filter((r): r is EarthquakeReport => r != null)
}

function parseOne(raw: Record<string, unknown>): EarthquakeReport | null {
  const info = raw.EarthquakeInfo as Record<string, unknown> | undefined
  if (!info) return null

  const epic = info.Epicenter as Record<string, unknown> | undefined
  const mag = info.EarthquakeMagnitude as Record<string, unknown> | undefined
  const intensity = raw.Intensity as Record<string, unknown> | undefined
  const areas = (intensity?.ShakingArea as Array<Record<string, unknown>>) ?? []

  let maxIntensity = ''
  const shakingAreas: ShakingArea[] = areas.map((a) => {
    const areaIntensity = String(a.AreaIntensity ?? '')
    if (!maxIntensity || intensityRank(areaIntensity) > intensityRank(maxIntensity)) {
      maxIntensity = areaIntensity
    }
    const stations = ((a.EqStation as Array<Record<string, unknown>>) ?? []).map(
      (s): ShakingStation => ({
        name: String(s.StationName ?? ''),
        intensity: String(s.SeismicIntensity ?? ''),
        distance: Number(s.EpicenterDistance ?? 0),
      }),
    )
    return {
      county: String(a.CountyName ?? a.AreaDesc ?? ''),
      areaIntensity,
      stations: stations.sort((x, y) => intensityRank(y.intensity) - intensityRank(x.intensity)),
    }
  })

  return {
    earthquakeNo: Number(raw.EarthquakeNo ?? 0),
    issueTime: String(raw.IssueTime ?? ''),
    reportType: String(raw.ReportType ?? ''),
    reportColor: String(raw.ReportColor ?? ''),
    reportContent: String(raw.ReportContent ?? ''),
    reportImageUri: raw.ReportImageURI ? String(raw.ReportImageURI) : undefined,
    shakemapImageUri: raw.ShakemapImageURI ? String(raw.ShakemapImageURI) : undefined,
    web: raw.Web ? String(raw.Web) : undefined,
    originTime: String(info.OriginTime ?? ''),
    magnitude: Number(mag?.MagnitudeValue ?? 0),
    magnitudeType: String(mag?.MagnitudeType ?? '芮氏規模'),
    depth: Number(info.FocalDepth ?? 0),
    epicenter: String(epic?.Location ?? ''),
    lat: Number(epic?.EpicenterLatitude ?? 0),
    lng: Number(epic?.EpicenterLongitude ?? 0),
    maxIntensity,
    shakingAreas,
  }
}

function intensityRank(s: string): number {
  const m = s.match(/(\d+)/)
  return m ? Number(m[1]) : 0
}
