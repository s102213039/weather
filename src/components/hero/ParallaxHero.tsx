import type { ReactNode } from 'react'

export function ParallaxHero({ children }: { children: ReactNode }) {
  return (
    <section className="cwa-hero relative overflow-hidden">
      <div className="cwa-sky-layers" aria-hidden>
        <span className="cwa-move-cloud cwa-move-cloud-1" />
        <span className="cwa-move-cloud cwa-move-cloud-2" />
        <span className="cwa-cloud-pattern cwa-cloud-pattern-1" />
        <span className="cwa-cloud-pattern cwa-cloud-pattern-2" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6">{children}</div>
    </section>
  )
}
