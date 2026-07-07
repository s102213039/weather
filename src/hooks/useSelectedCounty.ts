import { useAppStore } from '../store/appStore'

/** 全域縣市：空字串 = 全部／未選取 */
export function useSelectedCounty() {
  const selectedCounty = useAppStore((s) => s.selectedCounty)
  const setSelectedCounty = useAppStore((s) => s.setSelectedCounty)
  return {
    selectedCounty,
    setSelectedCounty,
    hasCounty: selectedCounty.length > 0,
  }
}
