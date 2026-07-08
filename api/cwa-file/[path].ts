import type { VercelRequest, VercelResponse } from '@vercel/node'

function allowCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin ?? ''
  if (
    origin.startsWith('https://s102213039.github.io') ||
    origin.endsWith('.vercel.app') ||
    origin === 'http://localhost:5173'
  ) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Vary', 'Origin')
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  allowCors(req, res)
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'GET') return res.status(405).end()

  const key = process.env.CWA_API_KEY
  if (!key) return res.status(500).json({ error: 'CWA_API_KEY not configured' })

  const id = String(req.query.path ?? '')
  if (!id) return res.status(400).json({ error: 'missing dataset id' })

  const host = req.headers.host ?? 'localhost'
  const proto = req.headers['x-forwarded-proto'] ?? 'https'
  const params = new URL(req.url ?? '/', `${proto}://${host}`).searchParams
  params.set('Authorization', key)
  params.set('format', 'JSON')

  const upstream = await fetch(
    `https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/${id}?${params}`,
  )
  const body = await upstream.text()
  res.status(upstream.status)
  res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/json')
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
  res.send(body)
}
