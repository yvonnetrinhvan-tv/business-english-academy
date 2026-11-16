import type { Lesson } from '../types'

export const payablesLesson: Lesson = {
  id: 'finance-04',
  program: 'finance',
  order: 4,
  title: 'Accounts Payable & Receivable',
  titleVi: 'Công nợ phải trả và phải thu',
  level: 'B1',
  minutes: 25,
  summaryVi: 'Hóa đơn, điều khoản thanh toán, nhắc nợ lịch sự, hỏi về khoản chưa thanh toán.',
  content: {
    sections: [
      {
        heading: { en: '1. Invoices and payment terms', vi: '1. Hóa đơn và điều khoản thanh toán' },
        body: [
          { en: 'Accounts payable (AP) is money you owe suppliers. Accounts receivable (AR) is money customers owe you.', vi: 'Công nợ phải trả (AP) là tiền bạn nợ nhà cung cấp. Công nợ phải thu (AR) là tiền khách hàng nợ bạn.' },
          { en: 'Payment terms state when to pay: "net 30" means payment is due 30 days after the invoice date.', vi: 'Điều khoản thanh toán nêu hạn trả: "net 30" là trả trong 30 ngày kể từ ngày hóa đơn.' },
          { en: 'An early payment discount, such as "2/10 net 30", gives 2% off if you pay within 10 days.', vi: 'Chiết khấu thanh toán sớm, như "2/10 net 30", giảm 2% nếu trả trong 10 ngày.' },
        ],
        workExample: {
          en: 'Invoice INV-2209, dated 1 June, net 30. Due date: 1 July. Amount due: 120 million.',
          vi: 'Một hóa đơn: số, ngày, điều khoản, hạn, số tiền.',
        },
      },
      {
        heading: { en: '2. Payment reminders', vi: '2. Nhắc thanh toán' },
        body: [
          { en: 'Stage 1 – friendly: "This is a reminder that invoice INV-2209 is due on 1 July."', vi: 'Bước 1 – thân thiện: "Xin nhắc hóa đơn INV-2209 đến hạn ngày 1/7."' },
          { en: 'Stage 2 – firm: "Invoice INV-2209 is now 15 days overdue. Please arrange payment by Friday."', vi: 'Bước 2 – kiên quyết: "Hóa đơn INV-2209 đã quá hạn 15 ngày. Vui lòng thanh toán trước thứ Sáu."' },
          { en: 'Stage 3 – final: "If we do not receive payment by 15 July, we may suspend further deliveries."', vi: 'Bước 3 – cuối cùng: "Nếu chưa nhận được tiền trước 15/7, chúng tôi có thể tạm dừng giao hàng."' },
          { en: 'Stay polite at every stage. State the invoice, amount, date and next step.', vi: 'Giữ lịch sự ở mọi bước. Nêu hóa đơn, số tiền, ngày và bước tiếp theo.' },
        ],
        workExample: {
          en: 'Dear Mr Tran, our records show invoice INV-2209 for 120 million is 15 days overdue. Could you let us know when we can expect payment?',
          vi: '"our records show" giúp giọng mềm hơn: nêu số liệu, hỏi ngày dự kiến.',
        },
      },
      {
        heading: { en: '3. Queries from suppliers', vi: '3. Trả lời thắc mắc của nhà cung cấp' },
        body: [
          { en: 'Check first: "Let me check the status of your invoice."', vi: 'Kiểm tra trước: "Để tôi kiểm tra tình trạng hóa đơn của anh/chị."' },
          { en: 'Explain a delay: "The invoice is on hold because it does not match the purchase order."', vi: 'Giải thích chậm: "Hóa đơn đang bị giữ vì không khớp đơn đặt hàng."' },
          { en: 'Give a date: "Payment is scheduled for 20 June."', vi: 'Nêu ngày: "Thanh toán được lên lịch vào 20/6."' },
        ],
        workExample: {
          en: 'Thank you for your email. Invoice 2209 is on hold because the quantity does not match the purchase order. Please send a corrected invoice and we will pay within 10 days.',
          vi: 'Trả lời nhà cung cấp: lý do giữ, việc họ cần làm, thời hạn trả sau đó.',
        },
      },
    ],
    vocab: [
      { id: 'ap-payable', term: 'accounts payable', ipa: '/əˈkaʊnts ˈpeɪəbl/', pos: 'n.', meaningVi: 'công nợ phải trả', exampleEn: 'Accounts payable pays suppliers every Friday.', exampleVi: 'Bộ phận công nợ phải trả thanh toán nhà cung cấp mỗi thứ Sáu.' },
      { id: 'ap-receivable', term: 'accounts receivable', ipa: '/əˈkaʊnts rɪˈsiːvəbl/', pos: 'n.', meaningVi: 'công nợ phải thu', exampleEn: 'Accounts receivable rose by 10% this month.', exampleVi: 'Công nợ phải thu tháng này tăng 10%.' },
      { id: 'ap-invoice', term: 'invoice', ipa: '/ˈɪnvɔɪs/', pos: 'n.', meaningVi: 'hóa đơn', exampleEn: 'Please send the invoice by email.', exampleVi: 'Vui lòng gửi hóa đơn qua email.' },
      { id: 'ap-overdue', term: 'overdue', ipa: '/ˌoʊvərˈduː/', pos: 'adj.', meaningVi: 'quá hạn', exampleEn: 'The invoice is 15 days overdue.', exampleVi: 'Hóa đơn đã quá hạn 15 ngày.' },
      { id: 'ap-terms', term: 'payment terms', ipa: '/ˈpeɪmənt tɜːrmz/', pos: 'n.', meaningVi: 'điều khoản thanh toán', exampleEn: 'Our payment terms are net 30.', exampleVi: 'Điều khoản thanh toán của chúng tôi là net 30.' },
      { id: 'ap-due-date', term: 'due date', ipa: '/duː deɪt/', pos: 'n.', meaningVi: 'ngày đến hạn', exampleEn: 'The due date is 1 July.', exampleVi: 'Ngày đến hạn là 1/7.' },
      { id: 'ap-on-hold', term: 'on hold', ipa: '/ɑːn hoʊld/', pos: 'phr.', meaningVi: 'đang bị giữ lại', exampleEn: 'The payment is on hold.', exampleVi: 'Khoản thanh toán đang bị giữ lại.' },
      { id: 'ap-remittance', term: 'remittance advice', ipa: '/rɪˈmɪtns ədˈvaɪs/', pos: 'n.', meaningVi: 'thông báo đã chuyển tiền', exampleEn: 'We will send the remittance advice today.', exampleVi: 'Chúng tôi sẽ gửi thông báo chuyển tiền hôm nay.' },
      { id: 'ap-outstanding', term: 'outstanding balance', ipa: '/aʊtˈstændɪŋ ˈbæləns/', pos: 'n.', meaningVi: 'số dư chưa thanh toán', exampleEn: 'The outstanding balance is 80 million.', exampleVi: 'Số dư chưa thanh toán là 80 triệu.' },
      { id: 'ap-in-arrears', term: 'in arrears', ipa: '/ɪn əˈrɪrz/', pos: 'phr.', meaningVi: 'chậm thanh toán, còn nợ', exampleEn: 'The customer is two months in arrears.', exampleVi: 'Khách hàng đang nợ chậm hai tháng.' },
    ],
    exercises: [
      { id: 'ap-q1', type: 'mcq', prompt: 'Terms are "net 30". When is payment due?', promptVi: 'Điều khoản "net 30". Hạn thanh toán là khi nào?', options: ['30 days after the invoice date', '30 days before', 'In 3 days', 'At once'], answer: 0, explanationVi: 'net 30 = 30 ngày sau ngày hóa đơn.' },
      { id: 'ap-q2', type: 'mcq', prompt: 'Which one is money customers owe you?', promptVi: 'Khoản nào là tiền khách hàng nợ bạn?', options: ['Accounts payable', 'Accounts receivable', 'Equity', 'Depreciation'], answer: 1, explanationVi: 'Receivable = phải thu.' },
      { id: 'ap-q3', type: 'mcq', prompt: 'Which sentence is the friendliest reminder?', promptVi: 'Câu nào là lời nhắc thân thiện nhất?', options: ['Pay now.', 'This is a reminder that invoice INV-2209 is due on 1 July.', 'You are late again.', 'We will sue you.'], answer: 1, explanationVi: 'Bước 1: nhắc nhẹ, nêu hóa đơn và ngày.' },
      { id: 'ap-q4', type: 'mcq', prompt: 'A supplier asks why payment is late. The invoice does not match the PO. What do you say?', promptVi: 'Nhà cung cấp hỏi vì sao chậm. Hóa đơn không khớp đơn đặt hàng. Bạn nói gì?', options: ['The invoice is on hold because it does not match the purchase order.', 'We lost it.', 'Wait.', 'I do not know.'], answer: 0, explanationVi: 'Nêu lý do cụ thể.' },
      { id: 'ap-f1', type: 'fill', prompt: 'The invoice is 15 days ___.', promptVi: 'Hóa đơn đã quá hạn 15 ngày.', answers: ['overdue'], hintVi: 'tính từ: quá hạn', explanationVi: '"overdue" = quá hạn.' },
      { id: 'ap-f2', type: 'fill', prompt: 'Payment is ___ for 20 June.', promptVi: 'Thanh toán được lên lịch vào 20/6.', answers: ['scheduled'], hintVi: 'quá khứ phân từ: lên lịch', explanationVi: '"is scheduled for" + ngày.' },
      { id: 'ap-f3', type: 'fill', prompt: 'Our ___ terms are net 30.', promptVi: 'Điều khoản thanh toán của chúng tôi là net 30.', answers: ['payment'], hintVi: 'danh từ: thanh toán', explanationVi: '"payment terms".' },
      { id: 'ap-o1', type: 'order', promptVi: 'Sắp xếp thành câu nhắc nợ.', words: ['Please', 'arrange', 'payment', 'by', 'Friday.'], answer: 'Please arrange payment by Friday.', explanationVi: 'Please + động từ + hạn.' },
      { id: 'ap-o2', type: 'order', promptVi: 'Sắp xếp thành câu báo hóa đơn bị giữ.', words: ['The', 'invoice', 'is', 'on', 'hold', 'because', 'it', 'does', 'not', 'match', 'the', 'PO.'], answer: 'The invoice is on hold because it does not match the PO.', explanationVi: '"on hold because" + lý do.' },
      {
        id: 'ap-w1', type: 'writing',
        promptVi: 'Viết email nhắc nợ 50–90 từ gửi ông Tran: hóa đơn INV-2209 (120 triệu) quá hạn 15 ngày, nhờ thanh toán trước thứ Sáu, giọng lịch sự.',
        scenarioEn: 'Write a payment reminder to Mr Tran. Invoice INV-2209 for 120 million is 15 days overdue. Ask for payment by Friday and stay polite.',
        minWords: 50,
        requiredPhrases: [['inv-2209', 'invoice'], ['overdue'], ['friday'], ['please', 'could you']],
        modelAnswer: 'Subject: Reminder – invoice INV-2209 is overdue\n\nDear Mr Tran,\n\nOur records show that invoice INV-2209 for 120 million is now 15 days overdue.\n\nCould you please arrange payment by Friday? If you have already paid, please send the remittance advice so we can update our records.\n\nThank you for your help.\n\nBest regards,\nMinh',
      },
    ],
  },
}
