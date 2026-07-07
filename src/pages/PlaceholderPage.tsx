import { Link } from 'react-router-dom'

export function PlaceholderPage({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-sky-900">{title}</h1>
      <p className="mt-3 text-slate-600">{description}</p>
      <Link to="/" className="mt-6 inline-block text-sky-700 underline">
        返回首頁
      </Link>
    </div>
  )
}
