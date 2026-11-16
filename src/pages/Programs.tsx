import { Link } from 'react-router-dom'
import { Card, PageTitle } from '../components/ui'
import { programs } from '../data/programs'
import { lessonsByProgram } from '../data/lessons'
import { useStore } from '../lib/store'

export default function Programs() {
  const { state } = useStore()
  return (
    <>
      <PageTitle sub="30 bài, chia đều 2 chương trình. Bài có nhãn “Sẵn sàng” đã có nội dung đầy đủ.">Chương trình học</PageTitle>
      {programs.map((p) => {
        const list = lessonsByProgram(p.id)
        const done = list.filter((l) => state.completedLessons.includes(l.id)).length
        return (
          <section key={p.id} className="mb-8" aria-labelledby={`p-${p.id}`}>
            <h2 id={`p-${p.id}`} className="text-lg font-bold">{p.name}</h2>
            <p className="text-sm text-slate-600">{p.nameVi} · {done}/{list.length} bài</p>
            <p className="mb-3 text-sm text-slate-600">{p.description}</p>
            <ol className="grid gap-2">
              {list.map((l) => {
                const ready = !!l.content
                const body = (
                  <Card className={ready ? 'hover:border-brand-600' : 'opacity-70'}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{l.order}. {l.title}</p>
                        <p className="text-sm text-slate-600">{l.titleVi}</p>
                        <p className="mt-1 text-xs text-slate-500">{l.summaryVi}</p>
                      </div>
                      <div className="shrink-0 text-right text-xs">
                        <span className="rounded bg-slate-100 px-2 py-0.5">{l.level}</span>
                        <p className={`mt-1 font-medium ${state.completedLessons.includes(l.id) ? 'text-emerald-700' : ready ? 'text-brand-700' : 'text-slate-500'}`}>
                          {state.completedLessons.includes(l.id) ? '✓ Hoàn thành' : ready ? 'Sẵn sàng' : 'Sắp có'}
                        </p>
                      </div>
                    </div>
                  </Card>
                )
                return <li key={l.id}>{ready ? <Link to={`/bai/${l.id}`}>{body}</Link> : body}</li>
              })}
            </ol>
          </section>
        )
      })}
    </>
  )
}
