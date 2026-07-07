import { useCallback, useEffect, useState } from 'react'
import { IMAGERY_CONFIG, imageryImageUrl } from '../../data/imagery'
import type { ImageryType } from '../../types/weather'

function ImageryLightbox({ type, onClose }: { type: ImageryType; onClose: () => void }) {
  const config = IMAGERY_CONFIG[type]
  const [src, setSrc] = useState(() => imageryImageUrl(type))

  useEffect(() => {
    setSrc(imageryImageUrl(type))
  }, [type])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="cwa-lightbox" role="dialog" aria-modal="true" aria-label={config.label}>
      <button type="button" className="cwa-lightbox-backdrop" onClick={onClose} aria-label="關閉" />
      <div className="cwa-lightbox-panel">
        <div className="cwa-lightbox-head">
          <h3>{config.label}</h3>
          <div className="flex gap-2">
            <button type="button" className="cwa-lightbox-btn" onClick={() => setSrc(imageryImageUrl(type))}>
              重新整理
            </button>
            <button type="button" className="cwa-lightbox-btn" onClick={onClose}>
              關閉
            </button>
          </div>
        </div>
        <img src={src} alt={config.label} className="cwa-lightbox-img" referrerPolicy="no-referrer" />
        <p className="cwa-lightbox-note">氣象署官網即時圖層（CDN）</p>
      </div>
    </div>
  )
}

export function ImagerySidebar() {
  const [lightbox, setLightbox] = useState<ImageryType | null>(null)
  const [tick, setTick] = useState(0)
  const close = useCallback(() => setLightbox(null), [])

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 5 * 60_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <>
      <aside className="cwa-imagery-sidebar" aria-label="圖資專區">
        <h2 className="cwa-imagery-title">圖資專區</h2>
        <p className="cwa-imagery-desc">點圖放大 · 每 5 分鐘更新</p>
        <ul className="cwa-imagery-list">
          {Object.values(IMAGERY_CONFIG).map((item) => (
            <li key={item.type}>
              <button
                type="button"
                className="cwa-imagery-item"
                onClick={() => setLightbox(item.type)}
                title={`${item.label}（點擊放大）`}
              >
                <img
                  src={`${item.previewUrl}?_=${tick}`}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {lightbox && <ImageryLightbox type={lightbox} onClose={close} />}
    </>
  )
}
