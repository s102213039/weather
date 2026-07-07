import type { ReactNode } from 'react'
import { useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { useEarthquake, useTsunami } from '../hooks/usePhase3Queries'
import type { EarthquakeReport } from '../types/phase3'

const COLOR_MAP: Record<string, string> = {
  綠色: 'bg-green-100 text-green-800 border-green-400',
  黃色: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  橙色: 'bg-orange-100 text-orange-800 border-orange-400',
  紅色: 'bg-red-100 text-red-800 border-red-400',
}

function colorClass(c: string) {
  return COLOR_MAP[c] ?? 'bg-slate-100 text-slate-800 border-slate-300'
}

function fmtTime(iso: string) {
  return iso.replace('T', ' ').replace(/\+08:00$/, '')
}

export function EarthquakePage() {
  const [tab, setTab] = useState<'eq' | 'tsu'>('eq')
  const eq = useEarthquake()
  const tsu = useTsunami()
  const latest = eq.data?.[0]

  return (
    <PageShell title="地震資訊" description="有感地震報告與海嘯消息（E-A0015 / E-A0014）">
      <div className="mb-4 flex gap-2">
        <TabBtn active={tab === 'eq'} onClick={() => setTab('eq')}>
          地震報告
        </TabBtn>
        <TabBtn active={tab === 'tsu'} onClick={() => setTab('tsu')}>
          海嘯消息
        </TabBtn>
      </div>

      {tab === 'eq' && (
        <>
          {eq.isLoading && <p>載入中…</p>}
          {eq.error && <p className="text-red-600">無法載入地震資料</p>}
          {latest && <EarthquakeCard report={latest} />}
          {eq.data && eq.data.length > 1 && (
            <details className="mt-6 rounded-lg bg-white p-4 shadow">
              <summary className="cursor-pointer font-medium text-sky-900">
                歷史報告（{eq.data.length - 1} 筆）
              </summary>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {eq.data.slice(1, 11).map((r) => (
                  <li key={r.earthquakeNo}>
                    {fmtTime(r.originTime)} · 規模 {r.magnitude} · {r.epicenter}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </>
      )}

      {tab === 'tsu' && (
        <>
          {tsu.isLoading && <p>載入中…</p>}
          {tsu.error && <p className="text-red-600">無法載入海嘯資料</p>}
          {!tsu.isLoading && !tsu.error && (tsu.data?.length ?? 0) === 0 && (
            <p className="rounded-lg bg-white p-6 text-center text-slate-600 shadow">目前無海嘯消息</p>
          )}
          <div className="space-y-4">
            {tsu.data?.map((r) => (
              <div key={`${r.tsunamiNo}-${r.issueTime}`} className="rounded-lg bg-white p-4 shadow">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded border px-2 py-0.5 text-xs font-medium ${colorClass(r.reportColor)}`}>
                    {r.reportColor}
                  </span>
                  <span className="text-sm text-slate-500">{r.reportNo}</span>
                  <span className="text-sm text-slate-500">{fmtTime(r.issueTime)}</span>
                </div>
                <p className="mt-2 text-slate-800">{r.reportContent}</p>
                {r.magnitude != null && (
                  <p className="mt-2 text-sm text-slate-600">
                    震源：{r.epicenter ?? '—'} · 規模 {r.magnitude}
                    {r.depth != null ? ` · 深度 ${r.depth} km` : ''}
                  </p>
                )}
                {r.web && (
                  <a href={r.web} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-sky-700">
                    詳細報告 →
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </PageShell>
  )
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium ${
        active ? 'bg-sky-800 text-white' : 'bg-white text-sky-800 shadow hover:bg-sky-50'
      }`}
    >
      {children}
    </button>
  )
}

function EarthquakeCard({ report }: { report: EarthquakeReport }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded border px-2 py-0.5 text-xs font-medium ${colorClass(report.reportColor)}`}>
          {report.reportColor}
        </span>
        <span className="text-sm text-slate-500">{report.reportType}</span>
        <span className="text-sm text-slate-500">發布 {fmtTime(report.issueTime)}</span>
      </div>

      <p className="mt-3 text-lg font-medium text-sky-900">{report.reportContent}</p>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="發震時間" value={fmtTime(report.originTime)} />
        <Stat label="規模" value={`${report.magnitudeType} ${report.magnitude}`} />
        <Stat label="震源深度" value={`${report.depth} km`} />
        <Stat label="最大震度" value={report.maxIntensity} />
      </dl>

      <p className="mt-3 text-sm text-slate-600">{report.epicenter}</p>
      <p className="text-xs text-slate-400">
        震央 {report.lat}°N, {report.lng}°E
      </p>

      {(report.reportImageUri || report.shakemapImageUri) && (
        <div className="mt-4 flex flex-wrap gap-4">
          {report.reportImageUri && (
            <img src={report.reportImageUri} alt="地震報告圖" className="max-h-64 rounded border" />
          )}
          {report.shakemapImageUri && (
            <img src={report.shakemapImageUri} alt="震度分布圖" className="max-h-64 rounded border" />
          )}
        </div>
      )}

      {report.shakingAreas.length > 0 && (
        <div className="mt-6">
          <h2 className="font-bold text-sky-900">各縣市震度</h2>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {report.shakingAreas.map((a) => (
              <div key={a.county} className="rounded border border-slate-200 p-3 text-sm">
                <div className="font-medium">
                  {a.county} <span className="text-red-600">{a.areaIntensity}</span>
                </div>
                {a.stations.slice(0, 3).map((s) => (
                  <div key={s.name} className="text-slate-600">
                    {s.name} {s.intensity}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {report.web && (
        <a href={report.web} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm text-sky-700">
          氣象署詳細頁 →
        </a>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-slate-50 px-3 py-2">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  )
}
