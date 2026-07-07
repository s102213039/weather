export type TaiwanCounty = {
  id: string
  nameZh: string
  nameEn: string
  lat: number
  lng: number
}

export const TAIWAN_COUNTIES: TaiwanCounty[] = [
  { id: 'keelung', nameZh: '基隆市', nameEn: 'Keelung City', lat: 25.17, lng: 121.9 },
  { id: 'taipei', nameZh: '臺北市', nameEn: 'Taipei City', lat: 25.06, lng: 121.52 },
  { id: 'new_taipei', nameZh: '新北市', nameEn: 'New Taipei City', lat: 24.88, lng: 121.62 },
  { id: 'taoyuan', nameZh: '桃園市', nameEn: 'Taoyuan City', lat: 24.9, lng: 121.16 },
  { id: 'hsinchu_city', nameZh: '新竹市', nameEn: 'Hsinchu City', lat: 24.82, lng: 120.82 },
  { id: 'hsinchu_county', nameZh: '新竹縣', nameEn: 'Hsinchu County', lat: 24.64, lng: 121.16 },
  { id: 'miaoli', nameZh: '苗栗縣', nameEn: 'Miaoli County', lat: 24.43, lng: 120.86 },
  { id: 'taichung', nameZh: '臺中市', nameEn: 'Taichung City', lat: 24.14, lng: 120.82 },
  { id: 'changhua', nameZh: '彰化縣', nameEn: 'Changhua County', lat: 23.93, lng: 120.44 },
  { id: 'nantou', nameZh: '南投縣', nameEn: 'Nantou County', lat: 23.8, lng: 120.94 },
  { id: 'yunlin', nameZh: '雲林縣', nameEn: 'Yunlin County', lat: 23.69, lng: 120.35 },
  { id: 'chiayi_city', nameZh: '嘉義市', nameEn: 'Chiayi City', lat: 23.48, lng: 120.45 },
  { id: 'chiayi_county', nameZh: '嘉義縣', nameEn: 'Chiayi County', lat: 23.35, lng: 120.65 },
  { id: 'tainan', nameZh: '臺南市', nameEn: 'Tainan City', lat: 23.08, lng: 120.26 },
  { id: 'kaohsiung', nameZh: '高雄市', nameEn: 'Kaohsiung City', lat: 22.83, lng: 120.54 },
  { id: 'pingtung', nameZh: '屏東縣', nameEn: 'Pingtung County', lat: 22.42, lng: 120.65 },
  { id: 'yilan', nameZh: '宜蘭縣', nameEn: 'Yilan County', lat: 24.66, lng: 121.77 },
  { id: 'hualien', nameZh: '花蓮縣', nameEn: 'Hualien County', lat: 23.76, lng: 121.45 },
  { id: 'taitung', nameZh: '臺東縣', nameEn: 'Taitung County', lat: 22.76, lng: 121.05 },
  { id: 'penghu', nameZh: '澎湖縣', nameEn: 'Penghu County', lat: 23.55, lng: 119.65 },
  { id: 'kinmen', nameZh: '金門縣', nameEn: 'Kinmen County', lat: 24.45, lng: 118.35 },
  { id: 'lienchiang', nameZh: '連江縣', nameEn: 'Lienchiang County', lat: 26.15, lng: 119.95 },
]

const MAP_BOUNDS = { minLat: 21.85, maxLat: 25.35, minLng: 118.35, maxLng: 122.05 }

/** 經緯度 → 官網 SVG viewBox 400×535 */
export function projectToSvg(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 400
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 535
  return { x, y }
}

export function normalizeCountyName(name: string): string {
  return name.trim().replace(/台/g, '臺')
}

export function nearestCounty(lat: number, lng: number): TaiwanCounty {
  let best = TAIWAN_COUNTIES[0]
  let bestD = Infinity
  for (const c of TAIWAN_COUNTIES) {
    const d = (c.lat - lat) ** 2 + (c.lng - lng) ** 2
    if (d < bestD) {
      bestD = d
      best = c
    }
  }
  return best
}
