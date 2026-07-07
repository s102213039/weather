import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

function apiProxyPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'cwa-api-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? ''
        if (
          !url.startsWith('/api/cwa/') &&
          !url.startsWith('/api/cwa-file/') &&
          !url.startsWith('/api/moenv/')
        ) {
          next()
          return
        }

        try {
          if (url.startsWith('/api/cwa-file/')) {
            const path = url.replace('/api/cwa-file/', '').split('?')[0]
            const search = url.includes('?') ? url.slice(url.indexOf('?')) : ''
            const target = `https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/${path}${search}${search ? '&' : '?'}Authorization=${encodeURIComponent(env.CWA_API_KEY ?? '')}&format=JSON`
            await pipeJson(target, req, res)
            return
          }

          if (url.startsWith('/api/cwa/')) {
            const path = url.replace('/api/cwa/', '').split('?')[0]
            const search = url.includes('?') ? url.slice(url.indexOf('?')) : ''
            const target = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${path}${search}${search ? '&' : '?'}Authorization=${encodeURIComponent(env.CWA_API_KEY ?? '')}&format=JSON`
            await pipeJson(target, req, res)
            return
          }

          const search = url.includes('?') ? url.slice(url.indexOf('?')) : ''
          const moenvKey = encodeURIComponent(env.MOENV_API_KEY ?? '')
          const target = `https://data.moenv.gov.tw/api/v2/aqx_p_432${search}${search ? '&' : '?'}api_key=${moenvKey}&format=json&limit=1000`
          await pipeJson(target, req, res)
        } catch (err) {
          res.statusCode = 502
          res.end(JSON.stringify({ error: String(err) }))
        }
      })
    },
  }
}

async function pipeJson(
  target: string,
  req: IncomingMessage,
  res: ServerResponse,
) {
  const upstream = await fetch(target, { method: req.method ?? 'GET' })
  const body = await upstream.text()
  res.statusCode = upstream.status
  res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/json')
  res.end(body)
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: process.env.GITHUB_ACTIONS === 'true' ? '/weather/' : '/',
    plugins: [react(), tailwindcss(), apiProxyPlugin(env)],
    server: { port: 5173 },
  }
})
