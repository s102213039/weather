import type { ImageryConfig, ImageryType } from '../types/weather'

/**
 * 圖資預覽來自氣象署官網 CDN（與 V8 首頁相同），非 Open Data JSON API。
 * 官網會定期更新檔名；失效時對照 https://www.cwa.gov.tw/V8/C/ 原始碼中的 /Data/ 路徑。
 */
export const IMAGERY_CONFIG: Record<ImageryType, ImageryConfig> = {
  sat: {
    type: 'sat',
    label: '衛星雲圖',
    previewUrl: 'https://www.cwa.gov.tw/Data/satellite/LCC_TRGB_1000/LCC_TRGB_1000_forPreview.jpg',
  },
  radar: {
    type: 'radar',
    label: '雷達迴波',
    previewUrl: 'https://www.cwa.gov.tw/Data/radar/CV1_TW_1000_forPreview.png',
  },
  rain: {
    type: 'rain',
    label: '雨量分布',
    previewUrl: 'https://www.cwa.gov.tw/Data/rainfall/QZJ_forPreview.jpg',
  },
  uvi: {
    type: 'uvi',
    label: '紫外線',
    previewUrl: 'https://www.cwa.gov.tw/Data/UVI/UVI_forPreview.png',
  },
  lightning: {
    type: 'lightning',
    label: '即時閃電',
    previewUrl: 'https://www.cwa.gov.tw/Data/lightning/lightning_s_forPreview.jpg',
  },
  temp: {
    type: 'temp',
    label: '溫度分布',
    previewUrl: 'https://www.cwa.gov.tw/Data/temperature/temp_forPreview.jpg',
  },
}

export function imageryImageUrl(type: ImageryType): string {
  const base = IMAGERY_CONFIG[type]?.previewUrl
  if (!base) return ''
  return `${base}?_=${Date.now()}`
}
