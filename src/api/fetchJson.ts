/** 生產環境 GitHub Pages 時指向 Vercel API；本機與 Vercel 全站部署則留空（同源） */
const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '')

export async function fetchJson<T>(url: string): Promise<T> {
  const target = url.startsWith('/api/') ? `${API_BASE}${url}` : url
  const res = await fetch(target)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}
