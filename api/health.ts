import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    ok: true,
    hasCwa: Boolean(process.env.CWA_API_KEY),
    hasMoenv: Boolean(process.env.MOENV_API_KEY),
    method: req.method,
  })
}
