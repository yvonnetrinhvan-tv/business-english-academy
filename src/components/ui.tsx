import type { ReactNode } from 'react'

export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <section className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>{children}</section>
)

export const Btn = ({
  children, onClick, variant = 'primary', disabled, type = 'button', 'aria-label': aria,
}: {
  children: ReactNode; onClick?: () => void; variant?: 'primary' | 'ghost' | 'danger'; disabled?: boolean
  type?: 'button' | 'submit'; 'aria-label'?: string
}) => {
  const styles = {
    primary: 'bg-brand-700 text-white hover:bg-brand-900',
    ghost: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
  }[variant]
  return (
    <button type={type} onClick={onClick} disabled={disabled} aria-label={aria}
      className={`rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-40 ${styles}`}>
      {children}
    </button>
  )
}

export const ProgressBar = ({ value, max, label }: { value: number; max: number; label: string }) => {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
      className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
      <div className="h-full bg-brand-600" style={{ width: `${pct}%` }} />
    </div>
  )
}

export const PageTitle = ({ children, sub }: { children: ReactNode; sub?: string }) => (
  <header className="mb-4">
    <h1 className="text-2xl font-bold text-slate-900">{children}</h1>
    {sub && <p className="mt-1 text-sm text-slate-600">{sub}</p>}
  </header>
)
