export type AirQualityRecord = {
  sitename?: string
  county?: string
  aqi?: string
  status?: string
  pollutant?: string
  'pm2.5'?: string
  pm10?: string
  latitude?: string
  longitude?: string
}

export type AirQualityUi = {
  station: string
  aqi: string
  status: string
  pm25: string
}
