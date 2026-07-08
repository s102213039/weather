import type { VercelRequest, VercelResponse } from '@vercel/node'
import { pipeJson, preflight, requestUrl } from '../../lib/proxy'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (preflight(req, res)) return
  if (req.method !== 'GET') return res.status(405).end()

  const key = process.env.CWA_API_KEY
  if (!key) return res.status(500).json({ error: 'CWA_API_KEY not configured' })

  const id = String(req.query.path ?? '')
  if (!id) return res.status(400).json({ error: 'missing dataset id' })

  const params = requestUrl(req).searchParams
  params.set('Authorization', key)
  params.set('format', 'JSON')

  const target = `https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/${id}?${params}`
  await pipeJson(res, target)
}
