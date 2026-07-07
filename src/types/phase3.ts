export type EarthquakeReport = {
  earthquakeNo: number
  issueTime: string
  reportType: string
  reportColor: string
  reportContent: string
  reportImageUri?: string
  shakemapImageUri?: string
  web?: string
  originTime: string
  magnitude: number
  magnitudeType: string
  depth: number
  epicenter: string
  lat: number
  lng: number
  maxIntensity: string
  shakingAreas: ShakingArea[]
}

export type ShakingArea = {
  county: string
  areaIntensity: string
  stations: ShakingStation[]
}

export type ShakingStation = {
  name: string
  intensity: string
  distance: number
}

export type TsunamiReport = {
  tsunamiNo: number
  issueTime: string
  reportNo: string
  reportType: string
  reportColor: string
  reportContent: string
  web?: string
  originTime?: string
  magnitude?: number
  epicenter?: string
  depth?: number
}

export type TideEvent = {
  dateTime: string
  type: string
  heightCm: string
}

export type TideDay = {
  date: string
  lunarDate: string
  tideRange: string
  events: TideEvent[]
}

export type TideLocation = {
  id: string
  name: string
  lat: number
  lng: number
  days: TideDay[]
}

export type SeaWeatherSlot = {
  start: string
  end: string
  weather: string
  windDir: string
  windScale: string
  waveHeight: string
}

export type SeaWeatherArea = {
  name: string
  slots: SeaWeatherSlot[]
}

export type SunDay = {
  date: string
  civilTwilightBegin: string
  sunrise: string
  sunriseAz: string
  transit: string
  transitAlt: string
  sunset: string
  sunsetAz: string
  civilTwilightEnd: string
}

export type MoonDay = {
  date: string
  moonRise: string
  moonRiseAz: string
  moonTransit: string
  moonTransitAlt: string
  moonSet: string
  moonSetAz: string
}

export type AstronomyCounty = {
  countyName: string
  sunDays: SunDay[]
  moonDays: MoonDay[]
}
