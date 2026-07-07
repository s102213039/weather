import type { AirQualityRecord, AirQualityUi } from '../types/aqi'

function toRad(n: number) {
  return (n * Math.PI) / 180
}

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export function nearestStation(
  stations: AirQualityRecord[],
  lat: number,
  lng: number,
): AirQualityRecord | undefined {
  let best: AirQualityRecord | undefined
  let bestD = Infinity
  for (const s of stations) {
    const slat = Number(s.latitude)
    const slng = Number(s.longitude)
    if (!Number.isFinite(slat) || !Number.isFinite(slng)) continue
    const d = haversineKm(lat, lng, slat, slng)
    if (d < bestD) {
      bestD = d
      best = s
    }
  }
  return best
}

export function toAirQualityUi(station: AirQualityRecord): AirQualityUi {
  return {
    station: station.sitename ?? '--',
    aqi: station.aqi ?? '--',
    status: station.status ?? '--',
    pm25: station['pm2.5'] ?? '--',
  }
}

export function aqiColor(aqi: string): string {
  const n = Number(aqi)
  if (!Number.isFinite(n)) return '#999'
  if (n <= 50) return '#00b050'
  if (n <= 100) return '#ffff00'
  if (n <= 150) return '#ff7e00'
  if (n <= 200) return '#ff0000'
  if (n <= 300) return '#8f3f97'
  return '#7e0023'
}
