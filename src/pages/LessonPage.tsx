import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Btn, Card, PageTitle } from '../components/ui'
import SpeakButton from '../components/SpeakButton'
import { getLesson } from '../data/lessons'
import { useStore } from '../lib/store'
import { useStudyTimer } from '../lib/useStudyTimer'

export default function LessonPage() {
  const { id } = useParams()
  const lesson = id ? getLesson(id) : undefined
  const { logSession, ensureCards } = useStore()
  const timer = useStudyTimer()

  // Ghi nhận thời gian đọc bài khi rời trang
  useEffect(() => () => {
    if (!lesson?.content) return
    const { seconds, startedAt } = timer.stop()
    if (seconds >= 5) logSession({ kind: 'lesson', lessonId: lesson.id, startedAt, seconds })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id])

  if (!lesson) return <p>Không tìm thấy bài học. <Link className="underline" to="/chuong-trinh">Về danh mục</Link></p>
  if (!lesson.content) {
    return (
      <>
        <PageTitle sub={lesson.titleVi}>{lesson.title}</PageTitle>
        <Card><p className="text-sm">Bài này đang được soạn. Mục tiêu: {lesson.summaryVi}</p></Card>
      </>
    )
  }
  const { sections, vocab } = lesson.content

  return (
    <>
      <PageTitle sub={`${lesson.titleVi} · ${lesson.level} · ${lesson.minutes} phút`}>{lesson.title}</PageTitle>

      {sections.map((s) => (
        <Card key={s.heading.en} className="mb-4">
          <h2 className="font-bold">{s.heading.en}</h2>
          <p className="mb-2 text-sm text-slate-500">{s.heading.vi}</p>
          <div className="space-y-3">
            {s.body.map((b, i) => (
              <div key={i}>
                <p>{b.en}</p>
                <p className="text-sm text-slate-600">{b.vi}</p>
              </div>
            ))}
          </div>
          {s.workExample && (
            <div className="mt-3 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-3">
              <p className="text-xs font-semibold uppercase text-amber-800">Ví dụ trong công việc / Work example</p>
              <p className="mt-1 whitespace-pre-line text-sm">{s.workExample.en}</p>
              <p className="mt-1 text-sm text-slate-600">{s.workExample.vi}</p>
            </div>
          )}
        </Card>
      ))}

      <Card className="mb-4">
        <h2 className="mb-2 font-bold">Từ vựng / Vocabulary ({vocab.length})</h2>
        <ul className="divide-y divide-slate-100">
          {vocab.map((v) => (
            <li key={v.id} className="flex items-center justify-between gap-2 py-2">
              <div>
                <span className="font-semibold">{v.term}</span>{' '}
                <span className="text-sm text-slate-500">{v.ipa} · {v.pos}</span>
                <p className="text-sm">{v.meaningVi}</p>
              </div>
              <SpeakButton text={v.term} />
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <Link to="/on-tap" onClick={() => ensureCards(vocab.map((v) => v.id))}><Btn variant="ghost">Thêm vào lịch ôn</Btn></Link>
        </div>
      </Card>

      <Link to={`/bai/${lesson.id}/bai-tap`}><Btn>Làm bài tập</Btn></Link>
    </>
  )
}
