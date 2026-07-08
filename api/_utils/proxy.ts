import type { VercelRequest, VercelResponse } from '@vercel/node'

const ALLOWED = [
  'http://localhost:5173',
  'https://s102213039.github.io',
]

export function applyCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin ?? ''
  const ok =
    ALLOWED.some((o) => origin.startsWith(o)) ||
    origin.endsWith('.vercel.app') ||
    !origin
  if (ok && origin) res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Vary', 'Origin')
}

export function preflight(req: VercelRequest, res: VercelResponse): boolean {
  applyCors(req, res)
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return true
  }
  return false
}

export async function pipeJson(res: VercelResponse, target: string) {
  const upstream = await fetch(target)
  const body = await upstream.text()
  res.status(upstream.status)
  res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/json')
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
  res.send(body)
}

export function requestUrl(req: VercelRequest): URL {
  const host = req.headers.host ?? 'localhost'
  const proto = req.headers['x-forwarded-proto'] ?? 'https'
  return new URL(req.url ?? '/', `${proto}://${host}`)
}
