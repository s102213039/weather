import type { VercelRequest, VercelResponse } from '@vercel/node'
import { pipeJson, preflight, requestUrl } from '../lib/proxy'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (preflight(req, res)) return
  if (req.method !== 'GET') return res.status(405).end()

  const key = process.env.MOENV_API_KEY
  if (!key) return res.status(500).json({ error: 'MOENV_API_KEY not configured' })

  const params = requestUrl(req).searchParams
  params.set('api_key', key)
  params.set('format', 'json')
  if (!params.has('limit')) params.set('limit', '1000')

  const target = `https://data.moenv.gov.tw/api/v2/aqx_p_432?${params}`
  await pipeJson(res, target)
}
