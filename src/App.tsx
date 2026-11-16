import { NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Programs from './pages/Programs'
import LessonPage from './pages/LessonPage'
import Review from './pages/Review'
import ExercisePage from './pages/ExercisePage'
import History from './pages/History'
import ImportPage from './pages/ImportPage'

const nav = [
  { to: '/', label: 'Tổng quan', icon: '🏠', end: true },
  { to: '/chuong-trinh', label: 'Chương trình', icon: '📚' },
  { to: '/on-tap', label: 'Ôn tập', icon: '🃏' },
  { to: '/nhap-tu', label: 'Nhập từ', icon: '📥' },
  { to: '/lich-su', label: 'Lịch sử', icon: '📈' },
]

export default function App() {
  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden md:flex md:w-56 md:flex-col md:gap-1 md:border-r md:border-slate-200 md:bg-white md:p-4">
        <div className="mb-4 text-sm font-bold leading-tight text-brand-700">
          Business &amp; Professional English Academy
        </div>
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) =>
            `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand-100 text-brand-900' : 'text-slate-600 hover:bg-slate-100'}`}>
            <span className="mr-2">{n.icon}</span>{n.label}
          </NavLink>
        ))}
      </aside>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-24 pt-6 md:pb-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chuong-trinh" element={<Programs />} />
          <Route path="/bai/:id" element={<LessonPage />} />
          <Route path="/bai/:id/bai-tap" element={<ExercisePage />} />
          <Route path="/on-tap" element={<Review />} />
          <Route path="/nhap-tu" element={<ImportPage />} />
          <Route path="/lich-su" element={<History />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) =>
            `flex flex-1 flex-col items-center py-2 text-xs ${isActive ? 'font-semibold text-brand-700' : 'text-slate-500'}`}>
            <span className="text-lg">{n.icon}</span>{n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
