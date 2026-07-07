#!/usr/bin/env node
/**
 * 建置前預取 CWA API（GitHub Pages 無 dev proxy、且 CWA 無 CORS）。
 * ponytail: 資料僅在 CI 建置時更新；排程 redeploy 可刷新。
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'public', 'api-cache')

const cwaKey = process.env.CWA_API_KEY ?? ''
if (!cwaKey) {
  console.error('CWA_API_KEY is required for prefetch')
  process.exit(1)
}

const DISTRICT_IDS = [
  'F-D0047-003', 'F-D0047-007', 'F-D0047-011', 'F-D0047-015', 'F-D0047-019',
  'F-D0047-023', 'F-D0047-027', 'F-D0047-031', 'F-D0047-035', 'F-D0047-039',
  'F-D0047-043', 'F-D0047-047', 'F-D0047-051', 'F-D0047-055', 'F-D0047-059',
  'F-D0047-061', 'F-D0047-065', 'F-D0047-069', 'F-D0047-073', 'F-D0047-077',
  'F-D0047-081', 'F-D0047-085',
]

const REST_IDS = [
  'F-C0032-001',
  'W-C0033-001',
  'O-A0003-001',
  'E-A0015-001',
  'E-A0015-002',
  'E-A0014-001',
  'F-A0021-001',
  'A-B0062-001',
  'A-B0063-001',
  ...DISTRICT_IDS,
]

const FILE_IDS = ['F-A0012-001']

async function fetchCwaRest(id) {
  const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${id}?Authorization=${encodeURIComponent(cwaKey)}&format=JSON`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`)
  return res.text()
}

async function fetchCwaFile(id) {
  const url = `https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/${id}?Authorization=${encodeURIComponent(cwaKey)}&format=JSON`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`)
  return res.text()
}

async function writeJson(dir, id, body) {
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, `${id}.json`), body)
}

async function main() {
  const cwaDir = path.join(outDir, 'cwa')
  const fileDir = path.join(outDir, 'cwa-file')

  for (const id of REST_IDS) {
    process.stdout.write(`prefetch ${id}… `)
    const body = await fetchCwaRest(id)
    await writeJson(cwaDir, id, body)
    console.log('ok')
  }

  for (const id of FILE_IDS) {
    process.stdout.write(`prefetch file ${id}… `)
    const body = await fetchCwaFile(id)
    await writeJson(fileDir, id, body)
    console.log('ok')
  }

  console.log('prefetch done')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
