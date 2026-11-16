import type { Lesson } from '../types'

export const meetingsLesson: Lesson = {
  id: 'office-05',
  program: 'office',
  order: 5,
  title: 'Running Effective Meetings',
  titleVi: 'Điều hành cuộc họp hiệu quả',
  level: 'B1',
  minutes: 25,
  summaryVi: 'Mở họp, giữ đúng chương trình, xử lý người nói lan man, chốt hành động, người phụ trách và hạn.',
  content: {
    sections: [
      {
        heading: { en: '1. Open the meeting', vi: '1. Mở cuộc họp' },
        body: [
          { en: 'Start on time. State the purpose and the time limit: "Thanks for joining. We have 30 minutes to agree the Q3 budget."', vi: 'Bắt đầu đúng giờ. Nêu mục đích và thời gian: "Cảm ơn mọi người. Chúng ta có 30 phút để chốt ngân sách Q3."' },
          { en: 'Walk through the agenda: "There are three items. First… second… third…"', vi: 'Đi qua chương trình: "Có ba mục. Thứ nhất… thứ hai… thứ ba…"' },
          { en: 'Assign a note-taker: "Hoa, could you take the minutes?"', vi: 'Giao người ghi biên bản: "Hoa ghi biên bản giúp nhé?"' },
        ],
        workExample: {
          en: 'Thanks for joining, everyone. We have 30 minutes. The purpose is to agree the Q3 budget. There are three items on the agenda.',
          vi: 'Câu mở họp gồm: cảm ơn, thời gian, mục đích, số mục.',
        },
      },
      {
        heading: { en: '2. Keep to the agenda', vi: '2. Giữ đúng chương trình' },
        body: [
          { en: 'Invite input: "Lan, what are your thoughts?" Give each person a turn.', vi: 'Mời ý kiến: "Lan, chị nghĩ sao?" Cho mỗi người một lượt.' },
          { en: 'Stop a long talk politely: "That is a good point. Let us come back to it later, so we can finish this item."', vi: 'Dừng người nói dài một cách lịch sự: "Ý hay. Mình quay lại sau để kịp xong mục này."' },
          { en: 'Park off-topic issues: "Let us take that offline."', vi: 'Gác chuyện lạc đề: "Việc đó mình bàn riêng sau."' },
          { en: 'Check the time: "We have five minutes left."', vi: 'Nhắc giờ: "Còn năm phút."' },
        ],
        workExample: {
          en: 'That is a fair point, Tuan. Let us take it offline so we can finish the budget item first.',
          vi: 'Ghi nhận ý kiến, hẹn bàn riêng, quay lại mục đang bàn.',
        },
      },
      {
        heading: { en: '3. Close with actions', vi: '3. Kết họp bằng hành động' },
        body: [
          { en: 'Summarize decisions: "To sum up, we agreed to cut travel by 10%."', vi: 'Tóm tắt quyết định: "Tóm lại, chúng ta thống nhất giảm chi công tác 10%."' },
          { en: 'Name an owner and a date for each action: "Lan will send the revised budget by Friday."', vi: 'Mỗi việc có người phụ trách và ngày: "Lan sẽ gửi ngân sách điều chỉnh trước thứ Sáu."' },
          { en: 'Confirm the next meeting and thank everyone.', vi: 'Chốt cuộc họp tiếp theo và cảm ơn mọi người.' },
        ],
        workExample: {
          en: 'To sum up: we agreed to cut travel by 10%. Actions: Lan sends the revised budget by Friday. Tuan checks vendor prices by Monday. Thanks, everyone.',
          vi: 'Phần kết: quyết định, ba hành động có người và hạn, lời cảm ơn.',
        },
      },
    ],
    vocab: [
      { id: 'mt-agenda', term: 'agenda', ipa: '/əˈdʒendə/', pos: 'n.', meaningVi: 'chương trình họp', exampleEn: 'Please read the agenda before the meeting.', exampleVi: 'Vui lòng đọc chương trình trước cuộc họp.' },
      { id: 'mt-minutes', term: 'minutes', ipa: '/ˈmɪnɪts/', pos: 'n.', meaningVi: 'biên bản họp', exampleEn: 'Hoa will take the minutes.', exampleVi: 'Hoa sẽ ghi biên bản.' },
      { id: 'mt-action', term: 'action item', ipa: '/ˈækʃn ˌaɪtəm/', pos: 'n.', meaningVi: 'việc cần làm sau họp', exampleEn: 'We have three action items.', exampleVi: 'Chúng ta có ba việc cần làm.' },
      { id: 'mt-owner', term: 'owner', ipa: '/ˈoʊnər/', pos: 'n.', meaningVi: 'người phụ trách', exampleEn: 'Each action needs an owner.', exampleVi: 'Mỗi việc cần một người phụ trách.' },
      { id: 'mt-sum-up', term: 'sum up', ipa: '/sʌm ʌp/', pos: 'phr. v.', meaningVi: 'tóm tắt', exampleEn: 'To sum up, we agreed on the budget.', exampleVi: 'Tóm lại, chúng ta đã thống nhất ngân sách.' },
      { id: 'mt-offline', term: 'take offline', ipa: '/teɪk ˌɔːfˈlaɪn/', pos: 'phr.', meaningVi: 'bàn riêng sau cuộc họp', exampleEn: 'Let us take this offline.', exampleVi: 'Việc này mình bàn riêng sau.' },
      { id: 'mt-on-track', term: 'on track', ipa: '/ɑːn træk/', pos: 'phr.', meaningVi: 'đúng tiến độ', exampleEn: 'The close is on track for day five.', exampleVi: 'Khóa sổ đang đúng tiến độ cho ngày thứ năm.' },
      { id: 'mt-input', term: 'input', ipa: '/ˈɪnpʊt/', pos: 'n.', meaningVi: 'ý kiến đóng góp', exampleEn: 'I would like your input on this.', exampleVi: 'Tôi muốn nghe ý kiến của anh/chị về việc này.' },
      { id: 'mt-agree', term: 'agree on', ipa: '/əˈɡriː ɑːn/', pos: 'phr. v.', meaningVi: 'thống nhất về', exampleEn: 'We agreed on a new deadline.', exampleVi: 'Chúng tôi thống nhất hạn mới.' },
      { id: 'mt-wrap-up', term: 'wrap up', ipa: '/ræp ʌp/', pos: 'phr. v.', meaningVi: 'kết thúc, chốt lại', exampleEn: 'Let us wrap up in five minutes.', exampleVi: 'Mình chốt lại trong năm phút nữa.' },
    ],
    exercises: [
      { id: 'mt-q1', type: 'mcq', prompt: 'What should you say first when you open a meeting?', promptVi: 'Mở họp, bạn nói gì trước?', options: ['Let us finish quickly.', 'Thanks for joining. The purpose is to agree the Q3 budget.', 'Who is late?', 'Sorry, I am not ready.'], answer: 1, explanationVi: 'Cảm ơn rồi nêu mục đích.' },
      { id: 'mt-q2', type: 'mcq', prompt: 'Someone talks too long. What is the polite response?', promptVi: 'Có người nói quá dài. Cách đáp lịch sự là gì?', options: ['Stop.', 'That is a good point. Let us take it offline so we can finish this item.', 'Be quiet.', 'We do not care.'], answer: 1, explanationVi: 'Ghi nhận ý kiến rồi hẹn bàn riêng.' },
      { id: 'mt-q3', type: 'mcq', prompt: 'What does each action item need?', promptVi: 'Mỗi việc cần làm cần gì?', options: ['A joke', 'An owner and a date', 'A long report', 'A new meeting'], answer: 1, explanationVi: 'Người phụ trách và ngày hoàn thành.' },
      { id: 'mt-q4', type: 'mcq', prompt: '"The project is on track." What does it mean?', promptVi: '"The project is on track" nghĩa là gì?', options: ['It is late.', 'It is cancelled.', 'It is on schedule.', 'It is too costly.'], answer: 2, explanationVi: 'on track = đúng tiến độ.' },
      { id: 'mt-f1', type: 'fill', prompt: 'To ___ up, we agreed to cut travel by 10%.', promptVi: 'Tóm lại, chúng ta thống nhất giảm chi công tác 10%.', answers: ['sum'], hintVi: 'động từ: tóm tắt', explanationVi: '"To sum up" = tóm lại.' },
      { id: 'mt-f2', type: 'fill', prompt: 'Hoa will take the ___.', promptVi: 'Hoa sẽ ghi biên bản.', answers: ['minutes'], hintVi: 'danh từ số nhiều: biên bản', explanationVi: '"take the minutes" = ghi biên bản.' },
      { id: 'mt-f3', type: 'fill', prompt: 'Let us take this ___ and finish the agenda.', promptVi: 'Việc này mình bàn riêng sau và hoàn thành chương trình.', answers: ['offline'], hintVi: 'trạng từ: ngoài cuộc họp', explanationVi: '"take offline" = bàn riêng sau.' },
      { id: 'mt-o1', type: 'order', promptVi: 'Sắp xếp thành câu giao việc.', words: ['Lan', 'will', 'send', 'the', 'budget', 'by', 'Friday.'], answer: 'Lan will send the budget by Friday.', explanationVi: 'Người + will + việc + by + hạn.' },
      { id: 'mt-o2', type: 'order', promptVi: 'Sắp xếp thành câu mời ý kiến.', words: ['What', 'are', 'your', 'thoughts', 'on', 'this?'], answer: 'What are your thoughts on this?', explanationVi: '"thoughts on" + chủ đề.' },
      {
        id: 'mt-w1', type: 'writing',
        promptVi: 'Viết lời kết họp 50–80 từ: tóm tắt quyết định giảm chi công tác 10%, giao việc cho Lan (hạn thứ Sáu), và cảm ơn mọi người.',
        scenarioEn: 'Write the closing words of a meeting. Sum up the decision to cut travel by 10%. Give Lan an action with a Friday deadline. Thank everyone.',
        minWords: 50,
        requiredPhrases: [['sum up', 'to summarize', 'in summary'], ['lan'], ['friday'], ['thank']],
        modelAnswer: 'To sum up, we agreed to cut travel costs by 10% from next month. Here are the actions. Lan will send the revised budget by Friday. Tuan will check vendor prices and report back on Monday. If anything is unclear, please email me today. Our next meeting is on 20 June at 10 am. Thank you all for your input.',
      },
    ],
  },
}
