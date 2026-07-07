export type WeatherParameter = {
  parameterName?: string
  parameterValue?: string
  parameterUnit?: string
}

export type BasicForecastTime = {
  startTime?: string
  endTime?: string
  parameter?: WeatherParameter
}

export type BasicWeatherElement = {
  elementName?: string
  time?: BasicForecastTime[]
}

export type BasicLocation = {
  locationName?: string
  weatherElement?: BasicWeatherElement[]
}

export type CountyForecastResponse = {
  success?: string
  records?: {
    datasetDescription?: string
    location?: BasicLocation[]
    Locations?: unknown[]
  }
}

export type DistrictLocation = {
  LocationName?: string
  WeatherElement?: Array<{
    ElementName?: string
    Time?: Array<{
      StartTime?: string
      DataTime?: string
      ElementValue?: Array<Record<string, string>>
    }>
  }>
}

export type DistrictForecastResponse = {
  success?: string
  records?: {
    Locations?: Array<{ Location?: DistrictLocation[] }>
  }
}

export type WarningLocation = {
  locationName?: string
  phenomena?: string
  significance?: string
  startTime?: string
  endTime?: string
}

export type WarningResponse = {
  success?: string
  records?: { location?: WarningLocation[] }
}

export type TimeSlotForecast = {
  label: string
  wxText: string
  wxCode: string
  minT: string
  maxT: string
  pop: string
}

export type CountySummary = {
  countyName: string
  slots: TimeSlotForecast[]
}

export type ObservationStation = {
  id: string
  name: string
  county: string
  town: string
  lat: number
  lng: number
  obsTime: string
  weather: string
  temp: string
  humidity: string
  windSpeed: string
  windDir: string
  rain: string
}

export type ObservationResponse = {
  success?: string
  records?: {
    Station?: Array<{
      StationName?: string
      StationId?: string
      ObsTime?: { DateTime?: string }
      GeoInfo?: {
        CountyName?: string
        TownName?: string
        Coordinates?: Array<{ CoordinateName?: string; CoordinateValue?: string }>
      }
      WeatherElement?: Record<string, string | number | { Precipitation?: string }>
    }>
  }
}

export type WarningDetail = {
  county: string
  hazards: string[]
}

export type DistrictDayForecast = {
  date: string
  wxText: string
  wxCode: string
  pop: string
  temp: string
}

export type DistrictSummary = {
  districtName: string
  days: DistrictDayForecast[]
}

export type ImageryType = 'sat' | 'radar' | 'rain' | 'uvi' | 'lightning' | 'temp'

export type ImageryConfig = {
  type: ImageryType
  label: string
  previewUrl: string
}
