import type { Lesson } from '../types'

export const schedulingLesson: Lesson = {
  id: 'office-04',
  program: 'office',
  order: 4,
  title: 'Scheduling Meetings',
  titleVi: 'Sắp xếp lịch họp',
  level: 'A2',
  minutes: 25,
  summaryVi: 'Đề xuất giờ họp, trả lời chấp nhận hoặc từ chối, đổi và hủy lịch, nói ngày giờ đúng.',
  content: {
    sections: [
      {
        heading: { en: '1. Propose a time', vi: '1. Đề xuất giờ họp' },
        body: [
          { en: 'Give a purpose, a duration and two options: "Can we meet for 30 minutes on Tuesday at 10 am or Wednesday at 2 pm?"', vi: 'Nêu mục đích, thời lượng và hai lựa chọn: "Mình họp 30 phút vào thứ Ba lúc 10 giờ hoặc thứ Tư lúc 14 giờ được không?"' },
          { en: 'Use "at" for a time, "on" for a day, "in" for a month: at 10 am, on Tuesday, in June.', vi: 'Dùng "at" cho giờ, "on" cho thứ/ngày, "in" cho tháng: at 10 am, on Tuesday, in June.' },
          { en: 'Name the time zone if people work in different places: "10 am Hanoi time".', vi: 'Nêu múi giờ nếu mọi người ở nơi khác nhau: "10 giờ sáng giờ Hà Nội".' },
        ],
        workExample: {
          en: 'Subject: Meeting request – Q3 forecast\nHi Lan, could we meet for 30 minutes to review the Q3 forecast? I am free on Tuesday at 10 am or Wednesday at 2 pm. Which works for you?',
          vi: 'Email đề xuất họp: mục đích, thời lượng, hai giờ, câu hỏi chốt.',
        },
      },
      {
        heading: { en: '2. Accept, decline, suggest another time', vi: '2. Nhận lời, từ chối, đề nghị giờ khác' },
        body: [
          { en: 'Accept: "Tuesday at 10 works for me. See you then."', vi: 'Nhận lời: "Thứ Ba lúc 10 giờ được với tôi. Hẹn gặp."' },
          { en: 'Decline and offer: "Sorry, I am not available on Tuesday. Would Thursday morning work?"', vi: 'Từ chối kèm đề nghị: "Xin lỗi, thứ Ba tôi không rảnh. Sáng thứ Năm được không?"' },
          { en: 'Check first: "Let me check my calendar and get back to you."', vi: 'Kiểm tra trước: "Để tôi xem lịch rồi báo lại anh/chị."' },
        ],
        workExample: {
          en: 'Thanks, Minh. I have a clash on Tuesday. Could we move it to Thursday at 9 am? If that does not work, I am also free on Friday afternoon.',
          vi: '"clash" là trùng lịch. Đề xuất ngay hai giờ khác để khỏi qua lại nhiều lần.',
        },
      },
      {
        heading: { en: '3. Reschedule and cancel', vi: '3. Đổi lịch và hủy' },
        body: [
          { en: 'Reschedule: "I am sorry, but I need to reschedule our meeting. Could we move it to Friday?"', vi: 'Đổi lịch: "Xin lỗi, tôi cần đổi lịch họp. Mình dời sang thứ Sáu được không?"' },
          { en: 'Cancel early and give a short reason: "I have to cancel today\'s meeting because of an urgent audit request."', vi: 'Hủy sớm và nêu lý do ngắn: "Tôi phải hủy cuộc họp hôm nay vì có yêu cầu kiểm toán gấp."' },
          { en: 'Apologize once, then offer a new time. Update the calendar invite.', vi: 'Xin lỗi một lần, rồi đề nghị giờ mới. Cập nhật lời mời trên lịch.' },
        ],
        workExample: {
          en: 'Hi all, I am sorry, but I need to reschedule tomorrow\'s meeting. I have moved it to Friday at 10 am. The new invite is in your calendar.',
          vi: 'Thông báo đổi lịch cho cả nhóm: xin lỗi, giờ mới, lời mời mới.',
        },
      },
    ],
    vocab: [
      { id: 'sc-schedule', term: 'schedule', ipa: '/ˈskedʒuːl/', pos: 'v.', meaningVi: 'lên lịch', exampleEn: 'Let us schedule a call for Monday.', exampleVi: 'Mình lên lịch một cuộc gọi vào thứ Hai nhé.' },
      { id: 'sc-reschedule', term: 'reschedule', ipa: '/ˌriːˈskedʒuːl/', pos: 'v.', meaningVi: 'đổi lịch, dời lịch', exampleEn: 'I need to reschedule our meeting.', exampleVi: 'Tôi cần đổi lịch họp của chúng ta.' },
      { id: 'sc-cancel', term: 'cancel', ipa: '/ˈkænsl/', pos: 'v.', meaningVi: 'hủy', exampleEn: 'We had to cancel the meeting.', exampleVi: 'Chúng tôi phải hủy cuộc họp.' },
      { id: 'sc-available', term: 'available', ipa: '/əˈveɪləbl/', pos: 'adj.', meaningVi: 'rảnh', exampleEn: 'Are you available on Thursday?', exampleVi: 'Thứ Năm anh/chị rảnh không?' },
      { id: 'sc-clash', term: 'clash', ipa: '/klæʃ/', pos: 'n.', meaningVi: 'trùng lịch', exampleEn: 'I have a clash with another meeting.', exampleVi: 'Tôi bị trùng với một cuộc họp khác.' },
      { id: 'sc-calendar', term: 'calendar', ipa: '/ˈkælɪndər/', pos: 'n.', meaningVi: 'lịch', exampleEn: 'I will send an invite to your calendar.', exampleVi: 'Tôi sẽ gửi lời mời vào lịch của anh/chị.' },
      { id: 'sc-invite', term: 'invite', ipa: '/ˈɪnvaɪt/', pos: 'n.', meaningVi: 'lời mời họp', exampleEn: 'Please accept the invite.', exampleVi: 'Vui lòng chấp nhận lời mời.' },
      { id: 'sc-works-for-me', term: 'work for me', ipa: '/wɜːrk fɔːr miː/', pos: 'phr.', meaningVi: 'phù hợp với tôi', exampleEn: 'Tuesday at 10 works for me.', exampleVi: 'Thứ Ba lúc 10 giờ phù hợp với tôi.' },
      { id: 'sc-move', term: 'move to', ipa: '/muːv tuː/', pos: 'phr. v.', meaningVi: 'dời sang', exampleEn: 'Can we move the meeting to Friday?', exampleVi: 'Mình dời cuộc họp sang thứ Sáu được không?' },
      { id: 'sc-duration', term: 'duration', ipa: '/dʊˈreɪʃn/', pos: 'n.', meaningVi: 'thời lượng', exampleEn: 'The duration is 30 minutes.', exampleVi: 'Thời lượng là 30 phút.' },
    ],
    exercises: [
      { id: 'sc-q1', type: 'mcq', prompt: 'Which preposition? "The meeting is ___ Tuesday."', promptVi: 'Chọn giới từ: "The meeting is ___ Tuesday."', options: ['in', 'at', 'on', 'by'], answer: 2, explanationVi: '"on" đi với thứ và ngày.' },
      { id: 'sc-q2', type: 'mcq', prompt: 'Which preposition? "The meeting starts ___ 10 am."', promptVi: 'Chọn giới từ: "The meeting starts ___ 10 am."', options: ['at', 'on', 'in', 'for'], answer: 0, explanationVi: '"at" đi với giờ.' },
      { id: 'sc-q3', type: 'mcq', prompt: 'You cannot attend on Tuesday. What is the best reply?', promptVi: 'Bạn không dự được thứ Ba. Câu trả lời nào tốt nhất?', options: ['No.', 'Sorry, I am not available on Tuesday. Would Thursday work?', 'Tuesday is bad.', 'I will not come.'], answer: 1, explanationVi: 'Từ chối kèm đề xuất giờ khác.' },
      { id: 'sc-q4', type: 'mcq', prompt: 'What is a "clash"?', promptVi: '"clash" nghĩa là gì?', options: ['Two meetings at the same time', 'A long meeting', 'A cancelled meeting', 'A lunch break'], answer: 0, explanationVi: 'clash = trùng lịch.' },
      { id: 'sc-f1', type: 'fill', prompt: 'I need to ___ our meeting. Could we move it to Friday?', promptVi: 'Tôi cần đổi lịch họp. Dời sang thứ Sáu được không?', answers: ['reschedule'], hintVi: 'động từ: đổi lịch', explanationVi: '"reschedule" = đổi lịch.' },
      { id: 'sc-f2', type: 'fill', prompt: 'Tuesday at 10 ___ for me.', promptVi: 'Thứ Ba lúc 10 giờ phù hợp với tôi.', answers: ['works'], hintVi: 'động từ: phù hợp (ngôi thứ ba)', explanationVi: '"works for me" = phù hợp với tôi.' },
      { id: 'sc-f3', type: 'fill', prompt: 'Let me check my ___ and get back to you.', promptVi: 'Để tôi xem lịch rồi báo lại.', answers: ['calendar'], hintVi: 'danh từ: lịch', explanationVi: '"check my calendar" = xem lịch của tôi.' },
      { id: 'sc-o1', type: 'order', promptVi: 'Sắp xếp thành câu đề xuất họp.', words: ['Can', 'we', 'meet', 'for', '30', 'minutes', 'on', 'Tuesday?'], answer: 'Can we meet for 30 minutes on Tuesday?', explanationVi: 'for + thời lượng, on + thứ.' },
      { id: 'sc-o2', type: 'order', promptVi: 'Sắp xếp thành câu xin dời lịch.', words: ['Could', 'we', 'move', 'it', 'to', 'Friday?'], answer: 'Could we move it to Friday?', explanationVi: '"move it to" + thời điểm mới.' },
      {
        id: 'sc-w1', type: 'writing',
        promptVi: 'Viết email 50–90 từ cho chị Lan: đề xuất họp 30 phút để xem dự báo Q3, đưa hai giờ (thứ Ba 10 giờ, thứ Tư 14 giờ) và hỏi giờ nào phù hợp.',
        scenarioEn: 'Write an email to Lan. Propose a 30-minute meeting to review the Q3 forecast. Offer Tuesday at 10 am or Wednesday at 2 pm and ask which works.',
        minWords: 50,
        requiredPhrases: [['30 minutes', '30-minute'], ['tuesday'], ['wednesday'], ['work', 'works']],
        modelAnswer: 'Subject: Meeting request – Q3 forecast\n\nHi Lan,\n\nCould we meet for 30 minutes to review the Q3 forecast? I am available on Tuesday at 10 am or Wednesday at 2 pm.\n\nWhich time works best for you? I can also move the meeting to another day if needed. I will send a calendar invite as soon as you confirm the time.\n\nThank you,\nMinh',
      },
    ],
  },
}
