import { useQuery } from '@tanstack/react-query'
import {
  fetchEarthquake,
  fetchMoon,
  fetchSeaWeather,
  fetchSunrise,
  fetchTide,
  fetchTsunami,
} from '../api/client'
import { parseEarthquakeReports } from '../lib/earthquake'
import type { EqResponse } from '../lib/earthquake'
import { parseTsunamiReports } from '../lib/tsunami'
import type { TsunamiResponse } from '../lib/tsunami'
import { parseTideLocations } from '../lib/tide'
import type { TideResponse } from '../lib/tide'
import { parseSeaWeather } from '../lib/seaWeather'
import type { FileApiResponse } from '../lib/seaWeather'
import { mergeAstronomy, parseMoonCounties, parseSunCounties } from '../lib/astronomy'
import type { MoonResponse, SunResponse } from '../lib/astronomy'
import { useAppStore } from '../store/appStore'

export function useEarthquake() {
  const lang = useAppStore((s) => s.lang)
  return useQuery({
    queryKey: ['earthquake', lang],
    queryFn: async () => parseEarthquakeReports((await fetchEarthquake(lang)) as EqResponse),
    staleTime: 5 * 60_000,
  })
}

export function useTsunami() {
  return useQuery({
    queryKey: ['tsunami'],
    queryFn: async () => parseTsunamiReports((await fetchTsunami()) as TsunamiResponse),
    staleTime: 5 * 60_000,
  })
}

export function useTide() {
  return useQuery({
    queryKey: ['tide'],
    queryFn: async () => parseTideLocations((await fetchTide()) as TideResponse),
    staleTime: 60 * 60_000,
  })
}

export function useSeaWeather() {
  return useQuery({
    queryKey: ['seaWeather'],
    queryFn: async () => parseSeaWeather((await fetchSeaWeather()) as FileApiResponse),
    staleTime: 30 * 60_000,
  })
}

export function useAstronomy() {
  return useQuery({
    queryKey: ['astronomy'],
    queryFn: async () => {
      const [sun, moon] = await Promise.all([fetchSunrise(), fetchMoon()])
      return mergeAstronomy(
        parseSunCounties(sun as SunResponse),
        parseMoonCounties(moon as MoonResponse),
      )
    },
    staleTime: 24 * 60 * 60_000,
  })
}
