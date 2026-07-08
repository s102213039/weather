import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'GET') return res.status(405).end()

  const key = process.env.MOENV_API_KEY
  if (!key) return res.status(500).json({ error: 'MOENV_API_KEY not configured' })

  const host = req.headers.host ?? 'localhost'
  const proto = req.headers['x-forwarded-proto'] ?? 'https'
  const params = new URL(req.url ?? '/', `${proto}://${host}`).searchParams
  params.set('api_key', key)
  params.set('format', 'json')
  if (!params.has('limit')) params.set('limit', '1000')

  const upstream = await fetch(`https://data.moenv.gov.tw/api/v2/aqx_p_432?${params}`)
  const body = await upstream.text()
  res.status(upstream.status)
  res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/json')
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
  res.send(body)
}
