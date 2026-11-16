import type { Lesson, ProgramId, VocabItem } from '../types'
import { emailLesson } from './lesson-email'
import { varianceLesson } from './lesson-variance'
import { greetingsLesson } from './lesson-greetings'
import { phoneLesson } from './lesson-phone'
import { schedulingLesson } from './lesson-scheduling'
import { meetingsLesson } from './lesson-meetings'
import { statementsLesson } from './lesson-statements'
import { closeLesson } from './lesson-close'
import { payablesLesson } from './lesson-payables'
import { cashflowLesson } from './lesson-cashflow'

type Planned = [title: string, titleVi: string, level: Lesson['level'], summaryVi: string]

const officePlan: Planned[] = [
  ['Workplace Greetings & Small Talk', 'Chào hỏi và trò chuyện xã giao', 'A2', 'Mở đầu và duy trì cuộc nói chuyện ngắn với đồng nghiệp.'],
  ['Phone Calls & Voicemail', 'Điện thoại và tin nhắn thoại', 'B1', 'Nhận, chuyển máy, để lại lời nhắn.'],
  ['Scheduling Meetings', 'Sắp xếp lịch họp', 'A2', 'Đề xuất, đổi và hủy lịch họp.'],
  ['Running Effective Meetings', 'Điều hành cuộc họp hiệu quả', 'B1', 'Mở họp, giữ đúng chương trình, chốt hành động.'],
  ['Writing Meeting Minutes', 'Viết biên bản họp', 'B1', 'Ghi quyết định, hành động, người phụ trách, hạn.'],
  ['Giving & Receiving Feedback', 'Góp ý và nhận góp ý', 'B2', 'Nêu góp ý cụ thể, nhận phản hồi bình tĩnh.'],
  ['Requests, Reminders & Follow-ups', 'Yêu cầu, nhắc việc, theo dõi', 'B1', 'Nhắc việc lịch sự mà vẫn rõ hạn.'],
  ['Handling Complaints Politely', 'Xử lý phàn nàn lịch sự', 'B2', 'Lắng nghe, xin lỗi, đề xuất giải pháp.'],
  ['Presenting Updates', 'Báo cáo cập nhật tiến độ', 'B1', 'Trình bày trạng thái, rủi ro, bước tiếp theo.'],
  ['Negotiating Deadlines', 'Thương lượng hạn chót', 'B2', 'Xin lùi hạn, đề nghị phương án thay thế.'],
  ['Cross-team Collaboration', 'Phối hợp liên phòng ban', 'B2', 'Phân vai, chia sẻ thông tin, giải quyết xung đột.'],
  ['Writing Reports & Summaries', 'Viết báo cáo và tóm tắt', 'B2', 'Tóm tắt một trang cho lãnh đạo.'],
  ['Business Travel & Hosting Visitors', 'Công tác và tiếp khách', 'A2', 'Đặt chỗ, đón tiếp, hướng dẫn khách.'],
  ['Job Interviews & Performance Reviews', 'Phỏng vấn và đánh giá hiệu suất', 'B2', 'Giới thiệu thành tích bằng số liệu.'],
]

const financePlan: Planned[] = [
  ['Financial Statements Basics', 'Nền tảng báo cáo tài chính', 'B1', 'Bảng cân đối, kết quả kinh doanh, lưu chuyển tiền tệ.'],
  ['Month-end Close', 'Khóa sổ cuối tháng', 'B2', 'Lịch khóa sổ, bút toán điều chỉnh, đối chiếu.'],
  ['Accounts Payable & Receivable', 'Công nợ phải trả và phải thu', 'B1', 'Hóa đơn, điều khoản thanh toán, nhắc nợ.'],
  ['Cash Flow & Working Capital', 'Dòng tiền và vốn lưu động', 'B2', 'Giải thích biến động tiền và vòng quay vốn.'],
  ['Forecasting & Rolling Forecast', 'Dự báo và dự báo cuốn chiếu', 'B2', 'Giả định, kịch bản, cập nhật dự báo.'],
  ['Cost Centers & Allocation', 'Trung tâm chi phí và phân bổ', 'B2', 'Phân bổ chi phí chung, tiêu thức phân bổ.'],
  ['Internal Controls Basics', 'Kiểm soát nội bộ cơ bản', 'B2', 'Phân tách nhiệm vụ, phê duyệt, đối chiếu.'],
  ['Audit Communication', 'Làm việc với kiểm toán', 'C1', 'Trả lời yêu cầu cung cấp tài liệu, giải trình số liệu.'],
  ['Revenue Recognition Terms', 'Thuật ngữ ghi nhận doanh thu', 'C1', 'Nghĩa vụ thực hiện, thời điểm ghi nhận.'],
  ['Tax & Compliance Terms', 'Thuật ngữ thuế và tuân thủ', 'B2', 'Kê khai, hạn nộp, rủi ro phạt.'],
  ['KPI & Management Reporting', 'KPI và báo cáo quản trị', 'B2', 'Chọn chỉ số, viết nhận xét ngắn.'],
  ['Capex vs Opex & Investment Cases', 'Chi đầu tư và chi hoạt động', 'C1', 'Hồ sơ đầu tư, thời gian hoàn vốn.'],
  ['Presenting to Executives', 'Báo cáo với ban điều hành', 'C1', 'Kết luận trước, số liệu hỗ trợ, đề xuất.'],
  ['Risk, Fraud & Control Deficiencies', 'Rủi ro, gian lận và thiếu sót kiểm soát', 'C1', 'Mô tả phát hiện, mức độ, khuyến nghị.'],
]

const toLessons = (program: ProgramId, plan: Planned[], prefix: string): Lesson[] =>
  plan.map(([title, titleVi, level, summaryVi], i) => ({
    id: `${prefix}-${String(i + 2).padStart(2, '0')}`,
    program,
    order: i + 2,
    title,
    titleVi,
    level,
    minutes: 25,
    summaryVi,
  }))

/** Bài đã có nội dung đầy đủ; thay mục danh mục cùng id. */
const full: Lesson[] = [
  greetingsLesson, phoneLesson, schedulingLesson, meetingsLesson,
  statementsLesson, closeLesson, payablesLesson, cashflowLesson,
]
const fullById = new Map(full.map((l) => [l.id, l]))
const withContent = (list: Lesson[]) => list.map((l) => fullById.get(l.id) ?? l)

export const lessons: Lesson[] = [
  emailLesson,
  ...withContent(toLessons('office', officePlan, 'office')),
  varianceLesson,
  ...withContent(toLessons('finance', financePlan, 'finance')),
]

export const lessonsByProgram = (p: ProgramId) => lessons.filter((l) => l.program === p)
export const getLesson = (id: string) => lessons.find((l) => l.id === id)

export const allVocab: (VocabItem & { lessonId: string })[] = lessons.flatMap((l) =>
  (l.content?.vocab ?? []).map((v) => ({ ...v, lessonId: l.id })),
)
export const getVocab = (id: string) => allVocab.find((v) => v.id === id)
