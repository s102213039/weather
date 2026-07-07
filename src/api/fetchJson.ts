const BASE = import.meta.env.BASE_URL

function cacheUrl(apiPath: string): string | null {
  if (!import.meta.env.PROD) return null
  const [pathOnly] = apiPath.split('?')
  if (pathOnly.startsWith('/api/cwa/')) {
    const id = pathOnly.slice('/api/cwa/'.length)
    return `${BASE}api-cache/cwa/${id}.json`
  }
  if (pathOnly.startsWith('/api/cwa-file/')) {
    const id = pathOnly.slice('/api/cwa-file/'.length)
    return `${BASE}api-cache/cwa-file/${id}.json`
  }
  return null
}

export async function fetchJson<T>(url: string): Promise<T> {
  const cached = cacheUrl(url)
  const target = cached ?? url
  const res = await fetch(target)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}
