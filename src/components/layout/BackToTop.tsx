import { useEffect, useState } from 'react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-sky-700 text-white shadow-lg hover:bg-sky-800"
      aria-label="回到頂部"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <i className="icon-arrow-up text-xl" aria-hidden />
    </button>
  )
}
