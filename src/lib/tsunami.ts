import type { TsunamiReport } from '../types/phase3'

export type TsunamiResponse = {
  records?: {
    Tsunami?: Array<Record<string, unknown>>
  }
}

export function parseTsunamiReports(response: TsunamiResponse): TsunamiReport[] {
  const items = response.records?.Tsunami ?? []
  return items.map(parseOne)
}

function parseOne(raw: Record<string, unknown>): TsunamiReport {
  const info = raw.EarthquakeInfo as Record<string, unknown> | undefined
  const epic = info?.Epicenter as Record<string, unknown> | undefined
  const mag = info?.EarthquakeMagnitude as Record<string, unknown> | undefined

  return {
    tsunamiNo: Number(raw.TsunamiNo ?? 0),
    issueTime: String(raw.IssueTime ?? ''),
    reportNo: String(raw.ReportNo ?? ''),
    reportType: String(raw.ReportType ?? ''),
    reportColor: String(raw.ReportColor ?? ''),
    reportContent: String(raw.ReportContent ?? ''),
    web: raw.Web ? String(raw.Web) : undefined,
    originTime: info?.OriginTime ? String(info.OriginTime) : undefined,
    magnitude: mag?.MagnitudeValue != null ? Number(mag.MagnitudeValue) : undefined,
    epicenter: epic?.Location ? String(epic.Location) : undefined,
    depth: info?.FocalDepth != null ? Number(info.FocalDepth) : undefined,
  }
}
