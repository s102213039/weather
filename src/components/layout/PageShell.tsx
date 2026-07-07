import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function PageShell({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-sm text-sky-700 no-underline hover:underline">
          ← 返回首頁
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-sky-900">{title}</h1>
        {description && <p className="mt-1 text-slate-600">{description}</p>}
      </div>
      {children}
    </div>
  )
}
