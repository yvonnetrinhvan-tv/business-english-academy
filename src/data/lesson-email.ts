import type { Lesson } from '../types'

export const emailLesson: Lesson = {
  id: 'office-01',
  program: 'office',
  order: 1,
  title: 'Professional Email Writing',
  titleVi: 'Viết email công việc chuyên nghiệp',
  level: 'B1',
  minutes: 25,
  summaryVi: 'Cấu trúc email 6 phần, giọng văn lịch sự, mẫu câu yêu cầu, nhắc việc và xin lỗi.',
  content: {
    sections: [
      {
        heading: { en: '1. The six-part structure', vi: '1. Cấu trúc 6 phần' },
        body: [
          {
            en: 'A clear email has six parts: subject line, greeting, purpose, details, next step, closing.',
            vi: 'Một email rõ ràng có sáu phần: tiêu đề, lời chào, mục đích, chi tiết, bước tiếp theo, lời kết.',
          },
          {
            en: 'State the purpose in the first or second sentence. Readers decide in seconds whether to act.',
            vi: 'Nêu mục đích ngay câu đầu hoặc câu thứ hai. Người đọc quyết định có hành động hay không chỉ trong vài giây.',
          },
          {
            en: 'Write a specific subject line: "Action needed: approve Q3 budget by Fri 14 June".',
            vi: 'Viết tiêu đề cụ thể: "Cần xử lý: duyệt ngân sách Q3 trước thứ Sáu 14/6".',
          },
        ],
        workExample: {
          en: 'Subject: Request for invoice copy – PO 4571\nDear Ms Lan,\nI am writing to request a copy of invoice INV-2209. Could you send it by Thursday? Thank you for your help.\nBest regards,\nMinh',
          vi: 'Tiêu đề: Đề nghị bản sao hóa đơn – PO 4571. Nội dung: nêu rõ cần gì, hạn nào, cảm ơn, rồi ký tên.',
        },
      },
      {
        heading: { en: '2. Tone: polite, direct, short', vi: '2. Giọng văn: lịch sự, thẳng, ngắn' },
        body: [
          {
            en: 'Use "Could you please…?" or "Would you mind…?" for requests. Avoid "I want you to…".',
            vi: 'Dùng "Could you please…?" hoặc "Would you mind…?" khi nhờ việc. Tránh "I want you to…" vì nghe ra lệnh.',
          },
          {
            en: 'Use one idea per sentence. Keep sentences under 25 words.',
            vi: 'Mỗi câu một ý. Giữ câu dưới 25 từ.',
          },
          {
            en: 'Match formality to the reader: "Dear Mr Tran" for a client, "Hi Lan" for a close colleague.',
            vi: 'Chọn mức trang trọng theo người đọc: "Dear Mr Tran" với khách hàng, "Hi Lan" với đồng nghiệp thân.',
          },
        ],
        workExample: {
          en: 'Direct: "Send me the report today." → Polite: "Could you please send me the report by 3 pm today?"',
          vi: 'Câu thẳng "Gửi báo cáo cho tôi hôm nay" → câu lịch sự "Anh/chị vui lòng gửi báo cáo trước 3 giờ chiều nay được không?"',
        },
      },
      {
        heading: { en: '3. Common patterns', vi: '3. Mẫu câu thường dùng' },
        body: [
          {
            en: 'Opening: "I am writing to…", "Thank you for your email regarding…".',
            vi: 'Mở đầu: "Tôi viết email này để…", "Cảm ơn email của anh/chị về…".',
          },
          {
            en: 'Follow-up: "I am following up on my email of 10 June." Reminder: "A quick reminder that the deadline is Friday."',
            vi: 'Nhắc lại: "Tôi xin nhắc lại email ngày 10/6." Nhắc hạn: "Xin nhắc nhanh là hạn chót vào thứ Sáu."',
          },
          {
            en: 'Apology: "I apologize for the delay. The file will reach you by noon."',
            vi: 'Xin lỗi: "Tôi xin lỗi vì chậm trễ. Tệp sẽ đến tay anh/chị trước 12 giờ trưa."',
          },
          {
            en: 'Closing: "Please let me know if you have any questions." then "Kind regards,".',
            vi: 'Kết thư: "Nếu có câu hỏi, xin cho tôi biết." rồi "Trân trọng,".',
          },
        ],
        workExample: {
          en: 'Subject: Follow-up: October payroll file\nHi Hoa,\nI am following up on my request of 8 Oct. Could you confirm the file is ready? The payroll deadline is 12 Oct.\nThank you,\nMinh',
          vi: 'Email nhắc việc: nêu ngày gửi trước, hỏi xác nhận, nhắc hạn rõ ràng.',
        },
      },
    ],
    vocab: [
      { id: 'em-attach', term: 'attach', ipa: '/əˈtætʃ/', pos: 'v.', meaningVi: 'đính kèm', exampleEn: 'I have attached the signed contract.', exampleVi: 'Tôi đã đính kèm hợp đồng đã ký.' },
      { id: 'em-regarding', term: 'regarding', ipa: '/rɪˈɡɑːrdɪŋ/', pos: 'prep.', meaningVi: 'liên quan đến, về việc', exampleEn: 'I am writing regarding your invoice.', exampleVi: 'Tôi viết email về hóa đơn của anh/chị.' },
      { id: 'em-follow-up', term: 'follow up', ipa: '/ˈfɑːloʊ ʌp/', pos: 'phr. v.', meaningVi: 'theo dõi, nhắc lại việc đã đề cập', exampleEn: 'I am following up on my last email.', exampleVi: 'Tôi viết để nhắc lại email trước.' },
      { id: 'em-deadline', term: 'deadline', ipa: '/ˈdedlaɪn/', pos: 'n.', meaningVi: 'hạn chót', exampleEn: 'The deadline for the report is Friday.', exampleVi: 'Hạn chót nộp báo cáo là thứ Sáu.' },
      { id: 'em-enclosed', term: 'enclosed', ipa: '/ɪnˈkloʊzd/', pos: 'adj.', meaningVi: 'kèm theo (trong thư giấy hoặc tệp)', exampleEn: 'Please find the enclosed schedule.', exampleVi: 'Vui lòng xem lịch trình kèm theo.' },
      { id: 'em-appreciate', term: 'appreciate', ipa: '/əˈpriːʃieɪt/', pos: 'v.', meaningVi: 'trân trọng, biết ơn', exampleEn: 'I appreciate your quick reply.', exampleVi: 'Tôi trân trọng phản hồi nhanh của anh/chị.' },
      { id: 'em-confirm', term: 'confirm', ipa: '/kənˈfɜːrm/', pos: 'v.', meaningVi: 'xác nhận', exampleEn: 'Could you confirm the meeting time?', exampleVi: 'Anh/chị xác nhận giờ họp giúp tôi được không?' },
      { id: 'em-apologize', term: 'apologize', ipa: '/əˈpɑːlədʒaɪz/', pos: 'v.', meaningVi: 'xin lỗi', exampleEn: 'I apologize for the late response.', exampleVi: 'Tôi xin lỗi vì trả lời muộn.' },
      { id: 'em-urgent', term: 'urgent', ipa: '/ˈɜːrdʒənt/', pos: 'adj.', meaningVi: 'khẩn cấp', exampleEn: 'This request is urgent because of the audit.', exampleVi: 'Yêu cầu này khẩn vì đợt kiểm toán.' },
      { id: 'em-earliest', term: 'at your earliest convenience', ipa: '/æt jɔːr ˈɜːrliəst kənˈviːniəns/', pos: 'phr.', meaningVi: 'khi anh/chị tiện sớm nhất', exampleEn: 'Please reply at your earliest convenience.', exampleVi: 'Vui lòng phản hồi khi anh/chị tiện sớm nhất.' },
    ],
    exercises: [
      { id: 'em-q1', type: 'mcq', prompt: 'Which sentence is the most polite request?', promptVi: 'Câu nào là lời nhờ lịch sự nhất?', options: ['Send me the file now.', 'I want you to send the file.', 'Could you please send me the file by 3 pm?', 'You must send the file.'], answer: 2, explanationVi: '"Could you please…" kèm hạn cụ thể vừa lịch sự vừa rõ việc.' },
      { id: 'em-q2', type: 'mcq', prompt: 'Which subject line is the clearest?', promptVi: 'Tiêu đề nào rõ nhất?', options: ['Hello', 'Question', 'Action needed: approve Q3 budget by Fri 14 June', 'Important!!!'], answer: 2, explanationVi: 'Tiêu đề tốt nêu việc cần làm và hạn chót.' },
      { id: 'em-q3', type: 'mcq', prompt: 'You are late replying. What do you write first?', promptVi: 'Bạn trả lời muộn. Câu mở đầu nào phù hợp?', options: ['Finally I have time.', 'I apologize for the delay in replying.', 'You should have asked earlier.', 'Never mind.'], answer: 1, explanationVi: 'Xin lỗi ngắn gọn rồi đi vào nội dung.' },
      { id: 'em-q4', type: 'mcq', prompt: '"Please find the ___ report." Which word fits an attachment?', promptVi: 'Từ nào dùng cho tệp đính kèm?', options: ['enclosed', 'urgent', 'deadline', 'confirm'], answer: 0, explanationVi: '"Please find the enclosed report" = Vui lòng xem báo cáo đính kèm.' },
      { id: 'em-f1', type: 'fill', prompt: 'I am writing to ___ the meeting time.', promptVi: 'Tôi viết để xác nhận giờ họp.', answers: ['confirm'], hintVi: 'động từ: xác nhận', explanationVi: '"confirm" = xác nhận.' },
      { id: 'em-f2', type: 'fill', prompt: 'I have ___ the signed contract to this email.', promptVi: 'Tôi đã đính kèm hợp đồng đã ký.', answers: ['attached'], hintVi: 'động từ: đính kèm (quá khứ phân từ)', explanationVi: 'Thì hiện tại hoàn thành "have attached".' },
      { id: 'em-f3', type: 'fill', prompt: 'Please reply at your earliest ___.', promptVi: 'Vui lòng phản hồi khi anh/chị tiện sớm nhất.', answers: ['convenience'], hintVi: 'cụm cố định', explanationVi: 'Cụm cố định "at your earliest convenience".' },
      { id: 'em-o1', type: 'order', promptVi: 'Sắp xếp thành câu nhắc việc.', words: ['I', 'am', 'following', 'up', 'on', 'my', 'email', 'of', '10', 'June.'], answer: 'I am following up on my email of 10 June.', explanationVi: '"follow up on" + việc đã nhắc trước đó.' },
      { id: 'em-o2', type: 'order', promptVi: 'Sắp xếp thành câu nhờ việc lịch sự.', words: ['Could', 'you', 'please', 'send', 'me', 'the', 'invoice', 'by', 'Thursday?'], answer: 'Could you please send me the invoice by Thursday?', explanationVi: 'Cấu trúc: Could you please + động từ + hạn.' },
      {
        id: 'em-w1', type: 'writing',
        promptVi: 'Viết email 50–90 từ cho đồng nghiệp Hoa: nhắc lại yêu cầu bảng lương gửi ngày 8/10, xin xác nhận, nêu hạn 12/10, và cảm ơn.',
        scenarioEn: 'Write an email to Hoa. Follow up on the payroll file you requested on 8 Oct. Ask her to confirm it is ready. The deadline is 12 Oct.',
        minWords: 50,
        requiredPhrases: [['follow up', 'following up'], ['confirm'], ['deadline', '12 oct'], ['thank']],
        modelAnswer: 'Subject: Follow-up: October payroll file\n\nHi Hoa,\n\nI am following up on my request of 8 Oct for the payroll file. Could you please confirm that it is ready? The payroll deadline is 12 Oct, and I need two days to check the figures.\n\nIf you need any information from me, please let me know.\n\nThank you for your help.\n\nBest regards,\nMinh',
      },
    ],
  },
}
