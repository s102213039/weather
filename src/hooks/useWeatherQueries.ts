import { useQuery } from '@tanstack/react-query'
import { fetchAirQuality, fetchCounty36h, fetchDistrictForecast, fetchObservation, fetchWarnings } from '../api/client'
import { parseCounty36h, parseDistrictNames, parseWarnings, resolveDistrictDatasetId } from '../lib/countyForecast'
import { parseDistrictForecasts } from '../lib/districtForecast'
import { parseObservationStations } from '../lib/observation'
import { parseWarningDetails } from '../lib/warnings'

export function useCounty36h() {
  return useQuery({
    queryKey: ['county36h'],
    queryFn: async () => parseCounty36h(await fetchCounty36h()),
    staleTime: 30 * 60_000,
  })
}

export function useDistricts(countyName: string) {
  const dataId = resolveDistrictDatasetId(countyName)
  return useQuery({
    queryKey: ['districts', countyName, dataId],
    queryFn: async () => parseDistrictNames(await fetchDistrictForecast(dataId)),
    enabled: countyName.length > 0,
    staleTime: 30 * 60_000,
  })
}

export function useDistrictForecasts(countyName: string) {
  const dataId = resolveDistrictDatasetId(countyName)
  return useQuery({
    queryKey: ['districtForecasts', countyName, dataId],
    queryFn: async () => parseDistrictForecasts(await fetchDistrictForecast(dataId)),
    enabled: countyName.length > 0,
    staleTime: 30 * 60_000,
  })
}

export function useDistrictForecastsRaw(countyName: string) {
  const dataId = resolveDistrictDatasetId(countyName)
  const query = useQuery({
    queryKey: ['districtForecastsRaw', countyName, dataId],
    queryFn: () => fetchDistrictForecast(dataId),
    enabled: countyName.length > 0,
    staleTime: 30 * 60_000,
  })
  return {
    ...query,
    summary: query.data ? parseDistrictForecasts(query.data) : undefined,
    data: query.data,
  }
}

export function useAirQuality() {
  return useQuery({
    queryKey: ['aqi'],
    queryFn: fetchAirQuality,
    staleTime: 60 * 60_000,
  })
}

export function useWarnings() {
  return useQuery({
    queryKey: ['warnings'],
    queryFn: async () => parseWarnings(await fetchWarnings()),
    staleTime: 5 * 60_000,
  })
}

export function useWarningsDetail() {
  return useQuery({
    queryKey: ['warningsDetail'],
    queryFn: async () => parseWarningDetails(await fetchWarnings()),
    staleTime: 5 * 60_000,
  })
}

export function useObservation() {
  return useQuery({
    queryKey: ['observation'],
    queryFn: async () => parseObservationStations(await fetchObservation()),
    staleTime: 10 * 60_000,
  })
}
