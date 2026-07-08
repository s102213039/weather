import type {
  CountyForecastResponse,
  DistrictForecastResponse,
  ObservationResponse,
  WarningResponse,
} from '../types/weather'
import type { AirQualityRecord } from '../types/aqi'
import { fetchJson } from './fetchJson'

type JsonRecord = Record<string, unknown>

export function fetchCounty36h(locationName?: string) {
  const q = locationName ? `?locationName=${encodeURIComponent(locationName)}` : ''
  return fetchJson<CountyForecastResponse>(`/api/cwa/F-C0032-001${q}`)
}

export function fetchDistrictForecast(dataId: string) {
  return fetchJson<DistrictForecastResponse>(`/api/cwa/${dataId}`)
}

export function fetchWarnings() {
  return fetchJson<WarningResponse>('/api/cwa/W-C0033-001')
}

export function fetchAirQuality() {
  return fetchJson<AirQualityRecord[]>('/api/moenv/')
}

export function fetchObservation() {
  return fetchJson<ObservationResponse>('/api/cwa/O-A0003-001')
}

export function fetchEarthquake(lang: 'zh' | 'en' = 'zh') {
  const dataId = lang === 'en' ? 'E-A0015-002' : 'E-A0015-001'
  return fetchJson<JsonRecord>(`/api/cwa/${dataId}`)
}

export function fetchTsunami() {
  return fetchJson<JsonRecord>('/api/cwa/E-A0014-001')
}

export function fetchTide() {
  return fetchJson<JsonRecord>('/api/cwa/F-A0021-001')
}

export function fetchSeaWeather() {
  return fetchJson<JsonRecord>('/api/cwa-file/F-A0012-001')
}

export function fetchSunrise() {
  return fetchJson<JsonRecord>('/api/cwa/A-B0062-001')
}

export function fetchMoon() {
  return fetchJson<JsonRecord>('/api/cwa/A-B0063-001')
}
