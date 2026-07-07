import type { ObservationResponse, ObservationStation } from '../types/weather'

type RawStation = NonNullable<NonNullable<ObservationResponse['records']>['Station']>[number]

function coord(station: RawStation, name: string): number {
  const coords = station.GeoInfo?.Coordinates ?? []
  const hit = coords.find((c) => c.CoordinateName === name)
  return Number(hit?.CoordinateValue ?? NaN)
}

function weatherField(
  we: Record<string, string | number | { Precipitation?: string }> | undefined,
  key: string,
): string {
  const v = we?.[key]
  if (v == null) return '--'
  if (typeof v === 'object' && 'Precipitation' in v) return String(v.Precipitation ?? '--')
  return String(v)
}

export function parseObservationStations(response: ObservationResponse): ObservationStation[] {
  const stations = response.records?.Station ?? []
  return stations.map((s) => ({
    id: s.StationId ?? '',
    name: s.StationName ?? '',
    county: s.GeoInfo?.CountyName ?? '',
    town: s.GeoInfo?.TownName ?? '',
    lat: coord(s, 'Latitude'),
    lng: coord(s, 'Longitude'),
    obsTime: s.ObsTime?.DateTime ?? '',
    weather: weatherField(s.WeatherElement, 'Weather'),
    temp: weatherField(s.WeatherElement, 'AirTemperature'),
    humidity: weatherField(s.WeatherElement, 'RelativeHumidity'),
    windSpeed: weatherField(s.WeatherElement, 'WindSpeed'),
    windDir: weatherField(s.WeatherElement, 'WindDirection'),
    rain: weatherField(s.WeatherElement, 'Now'),
  }))
}
