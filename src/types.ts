export type ProgramId = 'office' | 'finance'

export interface Program {
  id: ProgramId
  name: string
  nameVi: string
  description: string
}

export interface VocabItem {
  id: string
  term: string
  ipa: string
  pos: string // n., v., adj., adv., phr.
  meaningVi: string
  exampleEn: string
  exampleVi: string
}

export interface BilingualText {
  en: string
  vi: string
}

export interface LessonSection {
  heading: BilingualText
  body: BilingualText[] // mỗi phần tử là một đoạn song ngữ
  workExample?: BilingualText // ví dụ ứng dụng trong công việc
}

export type Exercise =
  | { id: string; type: 'mcq'; prompt: string; promptVi: string; options: string[]; answer: number; explanationVi: string }
  | { id: string; type: 'fill'; prompt: string; promptVi: string; /** dùng ___ cho chỗ trống */ answers: string[]; hintVi: string; explanationVi: string }
  | { id: string; type: 'order'; promptVi: string; words: string[]; /** câu đúng, ghép từ words */ answer: string; explanationVi: string }
  | { id: string; type: 'writing'; promptVi: string; scenarioEn: string; minWords: number; requiredPhrases: string[][]; modelAnswer: string }

export interface Lesson {
  id: string
  program: ProgramId
  order: number
  title: string
  titleVi: string
  level: 'A2' | 'B1' | 'B2' | 'C1'
  minutes: number
  summaryVi: string
  /** Có nội dung đầy đủ hay mới chỉ là danh mục */
  content?: {
    sections: LessonSection[]
    vocab: VocabItem[]
    exercises: Exercise[]
  }
}

export type Grade = 'again' | 'hard' | 'good' | 'easy'

export interface CardState {
  vocabId: string
  ease: number // hệ số dễ nhớ, tối thiểu 1.3
  intervalDays: number
  reps: number
  lapses: number
  due: string // ISO
  lastReviewed?: string
}

export type SessionKind = 'lesson' | 'flashcards' | 'exercises'

export interface StudySession {
  id: string
  kind: SessionKind
  lessonId?: string
  startedAt: string // ISO
  seconds: number // thời lượng thực tế
  score?: number // số câu đúng
  total?: number // tổng số câu
}

export interface ProgressState {
  version: 1
  cards: Record<string, CardState>
  sessions: StudySession[]
  completedLessons: string[]
  dailyGoalMinutes: number
  writings: Record<string, string> // exerciseId -> bài viết mới nhất
}
