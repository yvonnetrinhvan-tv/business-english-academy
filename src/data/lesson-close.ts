import type { Lesson } from '../types'

export const closeLesson: Lesson = {
  id: 'finance-03',
  program: 'finance',
  order: 3,
  title: 'Month-end Close',
  titleVi: 'Khóa sổ cuối tháng',
  level: 'B2',
  minutes: 25,
  summaryVi: 'Lịch khóa sổ, bút toán dồn tích và điều chỉnh, đối chiếu, cách báo trạng thái và hỏi hạn.',
  content: {
    sections: [
      {
        heading: { en: '1. The close calendar', vi: '1. Lịch khóa sổ' },
        body: [
          { en: 'Most teams plan the close by working day: WD1 cut-off, WD2 accruals, WD3 reconciliations, WD5 reporting.', vi: 'Hầu hết đội kế toán lên lịch khóa sổ theo ngày làm việc: ngày 1 cắt kỳ, ngày 2 dồn tích, ngày 3 đối chiếu, ngày 5 báo cáo.' },
          { en: 'Cut-off means no more transactions go into the period after this time.', vi: 'Cắt kỳ nghĩa là sau thời điểm này không ghi thêm giao dịch vào kỳ đó.' },
          { en: 'Each task has an owner and a due date. Share the calendar with every contributor.', vi: 'Mỗi việc có người phụ trách và hạn. Chia sẻ lịch với mọi người tham gia.' },
        ],
        workExample: {
          en: 'The close calendar: WD1 – cut-off. WD2 – accruals and prepaid expenses. WD3 – bank and intercompany reconciliations. WD5 – management reports.',
          vi: 'Lịch khóa sổ gọn: mỗi ngày làm việc một nhóm việc.',
        },
      },
      {
        heading: { en: '2. Accruals, adjustments, reconciliations', vi: '2. Dồn tích, điều chỉnh, đối chiếu' },
        body: [
          { en: 'An accrual records an expense or revenue before the cash moves.', vi: 'Bút toán dồn tích ghi nhận chi phí hoặc doanh thu trước khi tiền di chuyển.' },
          { en: 'An adjusting entry corrects a balance at period end, for example depreciation or prepaid expenses.', vi: 'Bút toán điều chỉnh sửa số dư cuối kỳ, ví dụ khấu hao hoặc chi phí trả trước.' },
          { en: 'A reconciliation compares two sources, such as the bank statement and the ledger, and explains each difference.', vi: 'Đối chiếu so sánh hai nguồn, như sao kê ngân hàng và sổ cái, và giải thích từng chênh lệch.' },
          { en: 'Typical wording: "reconciliation of the bank account", "reconcile the ledger with the bank statement".', vi: 'Cách nói thường gặp: "đối chiếu tài khoản ngân hàng", "đối chiếu sổ cái với sao kê ngân hàng".' },
        ],
        workExample: {
          en: 'We accrued 40 million for December utilities because the invoice has not arrived. The bank reconciliation shows one reconciling item of 5 million: a cheque in transit.',
          vi: 'Dồn tích tiền điện chưa có hóa đơn; đối chiếu ngân hàng còn một khoản chênh lệch do séc đang chuyển.',
        },
      },
      {
        heading: { en: '3. Status updates and chasing', vi: '3. Báo trạng thái và nhắc việc' },
        body: [
          { en: 'Status update: "The close is on track. Accruals are done. Intercompany is still open."', vi: 'Báo trạng thái: "Khóa sổ đúng tiến độ. Dồn tích đã xong. Nội bộ tập đoàn còn mở."' },
          { en: 'Flag a risk early: "We are at risk of missing WD5 because the payroll file is late."', vi: 'Báo rủi ro sớm: "Chúng ta có nguy cơ trễ ngày 5 vì file lương nộp muộn."' },
          { en: 'Chase politely: "Could you send the accrual by end of day? We need it for the sign-off."', vi: 'Nhắc lịch sự: "Anh/chị gửi bút toán dồn tích trước cuối ngày được không? Chúng tôi cần để duyệt."' },
        ],
        workExample: {
          en: 'Hi team, quick update: accruals are posted. We are waiting for two reconciliations. Please send them by 5 pm so we can sign off on WD3.',
          vi: 'Email trạng thái: việc đã xong, việc còn chờ, hạn, mục đích.',
        },
      },
    ],
    vocab: [
      { id: 'mc-accrual', term: 'accrual', ipa: '/əˈkruːəl/', pos: 'n.', meaningVi: 'bút toán dồn tích', exampleEn: 'We booked an accrual for December rent.', exampleVi: 'Chúng tôi ghi dồn tích tiền thuê tháng 12.' },
      { id: 'mc-cut-off', term: 'cut-off', ipa: '/ˈkʌt ɔːf/', pos: 'n.', meaningVi: 'thời điểm cắt kỳ', exampleEn: 'The cut-off is 6 pm on the last day.', exampleVi: 'Cắt kỳ lúc 6 giờ chiều ngày cuối.' },
      { id: 'mc-adjusting', term: 'adjusting entry', ipa: '/əˈdʒʌstɪŋ ˈentri/', pos: 'n.', meaningVi: 'bút toán điều chỉnh', exampleEn: 'Post the adjusting entry before sign-off.', exampleVi: 'Hạch toán bút toán điều chỉnh trước khi duyệt.' },
      { id: 'mc-reconcile', term: 'reconcile with', ipa: '/ˈrekənsaɪl wɪð/', pos: 'phr. v.', meaningVi: 'đối chiếu với', exampleEn: 'Reconcile the ledger with the bank statement.', exampleVi: 'Đối chiếu sổ cái với sao kê ngân hàng.' },
      { id: 'mc-recon-of', term: 'reconciliation of', ipa: '/ˌrekənsɪliˈeɪʃn əv/', pos: 'phr.', meaningVi: 'việc đối chiếu (tài khoản nào)', exampleEn: 'The reconciliation of the cash account is due on WD3.', exampleVi: 'Đối chiếu tài khoản tiền đến hạn ngày làm việc thứ 3.' },
      { id: 'mc-prepaid', term: 'prepaid expense', ipa: '/ˌpriːˈpeɪd ɪkˈspens/', pos: 'n.', meaningVi: 'chi phí trả trước', exampleEn: 'Insurance is booked as a prepaid expense.', exampleVi: 'Bảo hiểm được ghi là chi phí trả trước.' },
      { id: 'mc-sign-off', term: 'sign-off', ipa: '/ˈsaɪn ɔːf/', pos: 'n.', meaningVi: 'sự phê duyệt cuối', exampleEn: 'We need your sign-off by Friday.', exampleVi: 'Chúng tôi cần anh/chị duyệt trước thứ Sáu.' },
      { id: 'mc-open-item', term: 'open item', ipa: '/ˈoʊpən ˈaɪtəm/', pos: 'n.', meaningVi: 'khoản còn mở, chưa xử lý', exampleEn: 'There are two open items on the list.', exampleVi: 'Còn hai khoản chưa xử lý trong danh sách.' },
      { id: 'mc-at-risk', term: 'at risk of', ipa: '/æt rɪsk əv/', pos: 'phr.', meaningVi: 'có nguy cơ', exampleEn: 'We are at risk of missing the deadline.', exampleVi: 'Chúng ta có nguy cơ trễ hạn.' },
      { id: 'mc-in-transit', term: 'in transit', ipa: '/ɪn ˈtrænzɪt/', pos: 'phr.', meaningVi: 'đang chuyển', exampleEn: 'The payment is in transit.', exampleVi: 'Khoản thanh toán đang chuyển.' },
    ],
    exercises: [
      { id: 'mc-q1', type: 'mcq', prompt: 'What does "cut-off" mean in a month-end close?', promptVi: 'Trong khóa sổ, "cut-off" nghĩa là gì?', options: ['The time after which no transactions go into the period', 'A bonus', 'A meeting', 'A new account'], answer: 0, explanationVi: 'Sau cắt kỳ, giao dịch thuộc kỳ sau.' },
      { id: 'mc-q2', type: 'mcq', prompt: 'Which entry records an expense before the invoice arrives?', promptVi: 'Bút toán nào ghi chi phí trước khi có hóa đơn?', options: ['Accrual', 'Refund', 'Receipt', 'Budget'], answer: 0, explanationVi: 'Accrual = dồn tích.' },
      { id: 'mc-q3', type: 'mcq', prompt: 'Which sentence is correct?', promptVi: 'Câu nào đúng?', options: ['Reconcile the ledger to the bank statement of.', 'Reconcile the ledger with the bank statement.', 'Reconcile with the ledger the bank.', 'Reconcile at the ledger bank.'], answer: 1, explanationVi: '"reconcile A with B".' },
      { id: 'mc-q4', type: 'mcq', prompt: 'How do you warn about a delay politely?', promptVi: 'Báo nguy cơ trễ lịch sự thế nào?', options: ['We are at risk of missing WD5 because the payroll file is late.', 'It is your fault.', 'Never mind.', 'We will fail.'], answer: 0, explanationVi: '"at risk of" + lý do cụ thể.' },
      { id: 'mc-f1', type: 'fill', prompt: 'We are at ___ of missing the deadline.', promptVi: 'Chúng ta có nguy cơ trễ hạn.', answers: ['risk'], hintVi: 'danh từ: rủi ro', explanationVi: '"at risk of + V-ing".' },
      { id: 'mc-f2', type: 'fill', prompt: 'Reconcile the ledger ___ the bank statement.', promptVi: 'Đối chiếu sổ cái với sao kê ngân hàng.', answers: ['with'], hintVi: 'giới từ', explanationVi: '"reconcile ... with ...".' },
      { id: 'mc-f3', type: 'fill', prompt: 'We need your ___ by Friday.', promptVi: 'Chúng tôi cần anh/chị phê duyệt trước thứ Sáu.', answers: ['sign-off'], hintVi: 'danh từ: phê duyệt cuối', explanationVi: '"sign-off" = phê duyệt cuối.' },
      { id: 'mc-o1', type: 'order', promptVi: 'Sắp xếp thành câu báo trạng thái.', words: ['The', 'close', 'is', 'on', 'track.', 'Accruals', 'are', 'done.'], answer: 'The close is on track. Accruals are done.', explanationVi: 'Trạng thái chung rồi chi tiết.' },
      { id: 'mc-o2', type: 'order', promptVi: 'Sắp xếp thành câu nhắc việc.', words: ['Could', 'you', 'send', 'the', 'accrual', 'by', 'end', 'of', 'day?'], answer: 'Could you send the accrual by end of day?', explanationVi: 'Could you + động từ + hạn.' },
      {
        id: 'mc-w1', type: 'writing',
        promptVi: 'Viết email 60–90 từ báo trạng thái khóa sổ: dồn tích đã hạch toán, còn chờ 2 đối chiếu, nhờ gửi trước 5 giờ chiều để duyệt ngày làm việc thứ 3.',
        scenarioEn: 'Write a close status email. Accruals are posted. Two reconciliations are still open. Ask the team to send them by 5 pm so you can sign off on WD3.',
        minWords: 50,
        requiredPhrases: [['accrual'], ['reconciliation'], ['5 pm', '5pm'], ['sign off', 'sign-off']],
        modelAnswer: 'Subject: Month-end close – status\n\nHi team,\n\nQuick update: the accruals are posted and the close is on track. We are still waiting for two reconciliations: the bank account and intercompany.\n\nCould you please send them by 5 pm today? We need them so we can sign off on WD3. If you see a problem, tell me early.\n\nThank you,\nMinh',
      },
    ],
  },
}
