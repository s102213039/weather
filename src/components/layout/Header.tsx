import { Link, NavLink } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'

const NAV = [
  { to: '/', label: '首頁' },
  {
    label: '預報',
    children: [
      { to: '/forecast/county', label: '縣市預報總覽' },
      { to: '/forecast/town', label: '鄉鎮預報總覽' },
      { to: '/forecast/week', label: '一週天氣預報' },
    ],
  },
  { to: '/observation', label: '觀測' },
  { to: '/warnings', label: '警特報' },
  { to: '/earthquake', label: '地震' },
  { to: '/marine', label: '海象' },
  { to: '/astronomy', label: '天文' },
]

export function Header() {
  const lang = useAppStore((s) => s.lang)
  const setLang = useAppStore((s) => s.setLang)

  return (
    <header className="cwa-header shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
        <Link to="/" className="flex items-center gap-2 text-white no-underline">
          <i className="icon-cwb-logo text-2xl" aria-hidden />
          <span className="text-lg font-bold tracking-wide">中央氣象署</span>
        </Link>

        <nav className="hidden flex-wrap items-center gap-1 lg:flex" aria-label="主選單">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className="rounded px-3 py-2 text-sm text-white/95 hover:bg-white/10"
                >
                  {item.label}
                </button>
                <div className="invisible absolute left-0 top-full min-w-40 rounded bg-white py-1 text-slate-800 shadow-lg group-hover:visible group-focus-within:visible">
                  {item.children.map((c) => (
                    <NavLink
                      key={c.to}
                      to={c.to}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm no-underline hover:bg-sky-50 ${isActive ? 'font-semibold text-sky-700' : 'text-slate-700'}`
                      }
                    >
                      {c.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to!}
                className={({ isActive }) =>
                  `rounded px-3 py-2 text-sm no-underline ${isActive ? 'bg-white/20 text-white' : 'text-white/95 hover:bg-white/10'}`
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded border border-white/40 px-2 py-1 text-xs text-white"
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
          >
            {lang === 'zh' ? 'EN' : '中'}
          </button>
        </div>
      </div>
    </header>
  )
}
