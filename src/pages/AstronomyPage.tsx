import { useMemo } from 'react'
import { TAIWAN_COUNTIES } from '../data/taiwanCounties'
import { PageShell } from '../components/layout/PageShell'
import { dayForDate, daysFromDate, nearestDay } from '../lib/astronomy'
import { useAstronomy } from '../hooks/usePhase3Queries'
import { useAppStore } from '../store/appStore'

function todayIso() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function AstronomyPage() {
  const county = useAppStore((s) => s.selectedCounty)
  const setCounty = useAppStore((s) => s.setSelectedCounty)
  const { data = [], isLoading, error } = useAstronomy()

  const record = useMemo(() => data.find((c) => c.countyName === county), [data, county])
  const today = todayIso()
  const sunToday = record ? dayForDate(record.sunDays, today) : undefined
  const moonToday = record ? dayForDate(record.moonDays, today) : undefined
  const sun = sunToday ?? (record ? nearestDay(record.sunDays, today) : undefined)
  const moon = moonToday ?? (record ? nearestDay(record.moonDays, today) : undefined)
  const usingFallback = Boolean(record && (!sunToday || !moonToday))

  const upcomingSun = useMemo(
    () => (record ? daysFromDate(record.sunDays, today, 7) : []),
    [record, today],
  )
  const upcomingMoon = useMemo(
    () => (record ? daysFromDate(record.moonDays, today, 7) : []),
    [record, today],
  )

  return (
    <PageShell title="天文" description="日出日落（A-B0062）與月相時刻（A-B0063）">
      <label className="mb-4 block text-sm">
        縣市
        <select
          className="ml-2 rounded border border-slate-300 px-2 py-1"
          value={county}
          onChange={(e) => setCounty(e.target.value)}
        >
          {TAIWAN_COUNTIES.map((c) => (
            <option key={c.id} value={c.nameZh}>
              {c.nameZh}
            </option>
          ))}
        </select>
      </label>

      {isLoading && <p>載入中…</p>}
      {usingFallback && record && (
        <p className="mb-4 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          氣象署資料尚無 {today} 當日紀錄，以下顯示最接近的可用日期（資料至{' '}
          {record.sunDays.at(-1)?.date ?? '—'}）。
        </p>
      )}
      {error && <p className="text-red-600">無法載入天文資料</p>}

      {!isLoading && !error && !record && (
        <p className="text-slate-600">找不到 {county} 的天文資料</p>
      )}

      {record && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg bg-white p-4 shadow">
            <h2 className="font-bold text-sky-900">
              {sunToday ? '今日' : '參考日'}日出日落（{sun?.date ?? today}）
            </h2>
            {sun ? (
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <Row label="民用曙光始" value={sun.civilTwilightBegin} />
                <Row label="日出" value={`${sun.sunrise}（方位 ${sun.sunriseAz}°）`} />
                <Row label="日中" value={`${sun.transit}（仰角 ${sun.transitAlt}）`} />
                <Row label="日落" value={`${sun.sunset}（方位 ${sun.sunsetAz}°）`} />
                <Row label="民用暮光終" value={sun.civilTwilightEnd} />
              </dl>
            ) : (
              <p className="mt-2 text-slate-600">今日無日出資料</p>
            )}
          </section>

          <section className="rounded-lg bg-white p-4 shadow">
            <h2 className="font-bold text-sky-900">
              {moonToday ? '今日' : '參考日'}月出月沒（{moon?.date ?? today}）
            </h2>
            {moon ? (
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <Row label="月出" value={moon.moonRise ? `${moon.moonRise}（方位 ${moon.moonRiseAz}°）` : '—'} />
                <Row
                  label="過中天"
                  value={moon.moonTransit ? `${moon.moonTransit}（仰角 ${moon.moonTransitAlt}）` : '—'}
                />
                <Row label="月沒" value={moon.moonSet ? `${moon.moonSet}（方位 ${moon.moonSetAz}°）` : '—'} />
              </dl>
            ) : (
              <p className="mt-2 text-slate-600">今日無月相資料</p>
            )}
          </section>

          <section className="rounded-lg bg-white p-4 shadow lg:col-span-2">
            <h2 className="font-bold text-sky-900">未來一週日出日落</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-slate-500">
                  <tr>
                    <th className="py-2 pr-4">日期</th>
                    <th className="pr-4">日出</th>
                    <th className="pr-4">日落</th>
                    <th>月出</th>
                    <th>月沒</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingSun.map((s, i) => {
                    const m = upcomingMoon[i]
                    return (
                      <tr key={s.date} className="border-t border-slate-100">
                        <td className="py-2 pr-4">{s.date}</td>
                        <td className="pr-4">{s.sunrise}</td>
                        <td className="pr-4">{s.sunset}</td>
                        <td className="pr-4">{m?.moonRise || '—'}</td>
                        <td>{m?.moonSet || '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </PageShell>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-slate-50 px-3 py-2">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  )
}
