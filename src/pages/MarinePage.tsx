import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { tideDayForDate } from '../lib/tide'
import { useSeaWeather, useTide } from '../hooks/usePhase3Queries'

function todayIso() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function fmtTime(iso: string) {
  return iso.replace('T', ' ').replace(/\+08:00$/, '').slice(0, 16)
}

export function MarinePage() {
  const [tab, setTab] = useState<'tide' | 'sea'>('tide')

  return (
    <PageShell title="海象／潮汐" description="潮汐預報（F-A0021）與海面天氣（F-A0012）">
      <div className="mb-4 flex gap-2">
        <TabBtn active={tab === 'tide'} onClick={() => setTab('tide')}>
          潮汐
        </TabBtn>
        <TabBtn active={tab === 'sea'} onClick={() => setTab('sea')}>
          海面天氣
        </TabBtn>
      </div>
      {tab === 'tide' ? <TideTab /> : <SeaTab />}
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

function TideTab() {
  const { data = [], isLoading, error } = useTide()
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim()
    if (!q) return data.slice(0, 30)
    return data.filter((l) => l.name.includes(q)).slice(0, 50)
  }, [data, query])

  const selected = data.find((l) => l.id === selectedId) ?? data[0]
  const today = todayIso()
  const day = selected ? tideDayForDate(selected, today) : undefined

  return (
    <>
      {isLoading && <p>載入中…</p>}
      {error && <p className="text-red-600">無法載入潮汐資料</p>}

      <div className="mb-4 flex flex-wrap gap-3">
        <label className="text-sm">
          搜尋地點
          <input
            type="search"
            className="ml-2 rounded border border-slate-300 px-2 py-1"
            placeholder="例：基隆、花蓮"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="text-sm">
          選擇測站
          <select
            className="ml-2 max-w-xs rounded border border-slate-300 px-2 py-1"
            value={selected?.id ?? ''}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {(query ? filtered : data).map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
        <span className="self-end text-sm text-slate-500">共 {data.length} 處</span>
      </div>

      {selected && (
        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="font-bold text-sky-900">{selected.name}</h2>
          <p className="text-xs text-slate-500">
            {selected.lat}°N, {selected.lng}°E
          </p>

          {day ? (
            <>
              <p className="mt-2 text-sm text-slate-600">
                {day.date}（農曆 {day.lunarDate}）· 潮差 {day.tideRange}
              </p>
              <table className="mt-3 w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="py-2">時間</th>
                    <th>潮況</th>
                    <th>潮高（cm，當地平均海面）</th>
                  </tr>
                </thead>
                <tbody>
                  {day.events.map((e) => (
                    <tr key={e.dateTime} className="border-b border-slate-100">
                      <td className="py-2">{fmtTime(e.dateTime)}</td>
                      <td>{e.type}</td>
                      <td>{e.heightCm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="mt-3 text-slate-600">今日（{today}）無潮汐資料，請選其他日期或地點。</p>
          )}

          {selected.days.length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-sky-700">其他預報日期</summary>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {selected.days
                  .filter((d) => d.date !== today)
                  .slice(0, 8)
                  .map((d) => (
                    <li key={d.date}>
                      {d.date} · {d.tideRange} · {d.events.map((e) => e.type).join('、')}
                    </li>
                  ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </>
  )
}

function SeaTab() {
  const { data = [], isLoading, error } = useSeaWeather()

  return (
    <>
      {isLoading && <p>載入中…</p>}
      {error && <p className="text-red-600">無法載入海面天氣資料</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {data.map((area) => (
          <div key={area.name} className="rounded-lg bg-white p-4 shadow">
            <h2 className="font-bold text-sky-900">{area.name}</h2>
            <div className="mt-2 space-y-3">
              {area.slots.slice(0, 3).map((s) => (
                <div key={s.start} className="border-b border-slate-100 pb-2 text-sm last:border-0">
                  <p className="text-xs text-slate-500">
                    {fmtTime(s.start)} — {fmtTime(s.end)}
                  </p>
                  <p className="font-medium">{s.weather}</p>
                  <p className="text-slate-600">
                    {s.windDir} · {s.windScale} · 浪高 {s.waveHeight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
