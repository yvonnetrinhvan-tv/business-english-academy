import type { Lesson } from '../types'

export const greetingsLesson: Lesson = {
  id: 'office-02',
  program: 'office',
  order: 2,
  title: 'Workplace Greetings & Small Talk',
  titleVi: 'Chào hỏi và trò chuyện xã giao',
  level: 'A2',
  minutes: 25,
  summaryVi: 'Chào đúng mức trang trọng, hỏi thăm ngắn, giữ cuộc nói chuyện 1–2 phút và kết thúc lịch sự.',
  content: {
    sections: [
      {
        heading: { en: '1. Greet by situation', vi: '1. Chào theo tình huống' },
        body: [
          { en: 'Use "Good morning" or "Good afternoon" with managers, clients and people you meet for the first time.', vi: 'Dùng "Good morning" hoặc "Good afternoon" với cấp trên, khách hàng và người mới gặp lần đầu.' },
          { en: 'Use "Hi" or "Hey" with close colleagues. Add the name: "Hi Lan".', vi: 'Dùng "Hi" hoặc "Hey" với đồng nghiệp thân. Gọi thêm tên: "Hi Lan".' },
          { en: 'To introduce yourself: "Hi, I\'m Minh from Accounting. Nice to meet you."', vi: 'Tự giới thiệu: "Hi, tôi là Minh bên phòng Kế toán. Rất vui được gặp anh/chị."' },
        ],
        workExample: {
          en: 'Client: Good morning, I\'m Tran from Blue Star.\nYou: Good morning, Mr Tran. I\'m Minh from Finance. Please come in.',
          vi: 'Với khách: chào theo buổi, gọi "Mr/Ms + họ", nói tên và phòng ban của mình.',
        },
      },
      {
        heading: { en: '2. Small talk: ask, answer, return', vi: '2. Xã giao: hỏi, trả lời, hỏi lại' },
        body: [
          { en: 'Ask a short open question: "How was your weekend?" or "How is the project going?"', vi: 'Hỏi một câu mở ngắn: "Cuối tuần của anh/chị thế nào?" hoặc "Dự án đang tiến triển ra sao?"' },
          { en: 'Answer in two parts: a short reply plus one detail. "Pretty good, thanks. We visited my parents."', vi: 'Trả lời hai phần: câu ngắn cộng một chi tiết. "Khá tốt, cảm ơn. Tôi về thăm bố mẹ."' },
          { en: 'Return the question: "And you?" or "How about you?" This keeps the talk balanced.', vi: 'Hỏi lại: "Còn anh/chị?" hoặc "Anh/chị thì sao?" để cuộc nói chuyện cân bằng.' },
          { en: 'Safe topics: weekend, weather, travel, food, work. Skip salary, age and politics.', vi: 'Chủ đề an toàn: cuối tuần, thời tiết, đi lại, ăn uống, công việc. Tránh lương, tuổi và chính trị.' },
        ],
        workExample: {
          en: 'A: How was your weekend?\nB: Pretty good, thanks. I went to Da Lat. How about you?\nA: Quiet. I stayed home and rested.',
          vi: 'Mỗi lượt: trả lời ngắn, thêm một chi tiết, rồi hỏi lại.',
        },
      },
      {
        heading: { en: '3. End the talk politely', vi: '3. Kết thúc lịch sự' },
        body: [
          { en: 'Keep small talk to one or two minutes, then move to work: "Anyway, shall we start?"', vi: 'Giữ xã giao 1–2 phút rồi vào việc: "Thôi, mình bắt đầu nhé?"' },
          { en: 'To leave: "It was great to catch up. I have to get back to my desk."', vi: 'Để rời đi: "Rất vui được trò chuyện. Tôi phải quay lại bàn làm việc."' },
          { en: 'Say goodbye by time: "Have a good weekend", "See you on Monday".', vi: 'Chào tạm biệt theo thời điểm: "Cuối tuần vui vẻ", "Thứ Hai gặp lại".' },
        ],
        workExample: {
          en: 'Anyway, I should get back to the month-end files. It was good to catch up. Have a nice evening!',
          vi: 'Dẫn lý do rời đi (việc phải làm), nói câu vui, rồi chúc.',
        },
      },
    ],
    vocab: [
      { id: 'gr-greet', term: 'greet', ipa: '/ɡriːt/', pos: 'v.', meaningVi: 'chào hỏi', exampleEn: 'I greet visitors at the front desk.', exampleVi: 'Tôi chào khách ở quầy lễ tân.' },
      { id: 'gr-colleague', term: 'colleague', ipa: '/ˈkɑːliːɡ/', pos: 'n.', meaningVi: 'đồng nghiệp', exampleEn: 'My colleague sits next to me.', exampleVi: 'Đồng nghiệp của tôi ngồi cạnh tôi.' },
      { id: 'gr-introduce', term: 'introduce', ipa: '/ˌɪntrəˈduːs/', pos: 'v.', meaningVi: 'giới thiệu', exampleEn: 'Let me introduce our new accountant.', exampleVi: 'Để tôi giới thiệu kế toán mới của chúng ta.' },
      { id: 'gr-catch-up', term: 'catch up', ipa: '/kætʃ ʌp/', pos: 'phr. v.', meaningVi: 'hỏi thăm, cập nhật chuyện nhau', exampleEn: 'We catch up over coffee every Monday.', exampleVi: 'Thứ Hai nào chúng tôi cũng trò chuyện bên ly cà phê.' },
      { id: 'gr-weekend', term: 'weekend', ipa: '/ˈwiːkend/', pos: 'n.', meaningVi: 'cuối tuần', exampleEn: 'How was your weekend?', exampleVi: 'Cuối tuần của anh/chị thế nào?' },
      { id: 'gr-busy', term: 'busy', ipa: '/ˈbɪzi/', pos: 'adj.', meaningVi: 'bận', exampleEn: 'It is a busy week because of the audit.', exampleVi: 'Tuần này bận vì đợt kiểm toán.' },
      { id: 'gr-polite', term: 'polite', ipa: '/pəˈlaɪt/', pos: 'adj.', meaningVi: 'lịch sự', exampleEn: 'Be polite, even when you are in a hurry.', exampleVi: 'Hãy lịch sự, kể cả khi bạn đang vội.' },
      { id: 'gr-nice-to-meet', term: 'nice to meet you', ipa: '/naɪs tə miːt juː/', pos: 'phr.', meaningVi: 'rất vui được gặp', exampleEn: 'Nice to meet you, Ms Hoa.', exampleVi: 'Rất vui được gặp chị Hoa.' },
      { id: 'gr-how-about', term: 'how about you', ipa: '/haʊ əˈbaʊt juː/', pos: 'phr.', meaningVi: 'còn anh/chị thì sao', exampleEn: 'I am fine. How about you?', exampleVi: 'Tôi khỏe. Còn anh/chị?' },
      { id: 'gr-get-back', term: 'get back to', ipa: '/ɡet bæk tuː/', pos: 'phr. v.', meaningVi: 'quay lại làm việc gì', exampleEn: 'I need to get back to my report.', exampleVi: 'Tôi cần quay lại với báo cáo của mình.' },
    ],
    exercises: [
      { id: 'gr-q1', type: 'mcq', prompt: 'You meet a client at 9 am. Which greeting fits?', promptVi: 'Bạn gặp khách hàng lúc 9 giờ sáng. Lời chào nào phù hợp?', options: ['Hey!', 'Good morning, nice to meet you.', 'Yo, what\'s up?', 'Bye.'], answer: 1, explanationVi: 'Khách hàng: chào theo buổi, giọng trang trọng.' },
      { id: 'gr-q2', type: 'mcq', prompt: 'A colleague asks "How was your weekend?" Which reply keeps the talk going?', promptVi: 'Đồng nghiệp hỏi cuối tuần thế nào. Câu trả lời nào giữ được cuộc nói chuyện?', options: ['Fine.', 'None of your business.', 'Pretty good, thanks. How about you?', 'I don\'t know.'], answer: 2, explanationVi: 'Trả lời ngắn rồi hỏi lại.' },
      { id: 'gr-q3', type: 'mcq', prompt: 'Which topic is safe for small talk at work?', promptVi: 'Chủ đề nào an toàn khi xã giao?', options: ['Salary', 'Age', 'Weather', 'Politics'], answer: 2, explanationVi: 'Thời tiết, cuối tuần, đi lại là chủ đề an toàn.' },
      { id: 'gr-q4', type: 'mcq', prompt: 'You want to end the talk. What do you say?', promptVi: 'Bạn muốn kết thúc cuộc nói chuyện. Nói gì?', options: ['Stop talking.', 'It was good to catch up. I have to get back to work.', 'I am bored.', 'Goodbye forever.'], answer: 1, explanationVi: 'Nêu điều vui rồi dẫn lý do rời đi.' },
      { id: 'gr-f1', type: 'fill', prompt: 'Nice to ___ you, Mr Tran.', promptVi: 'Rất vui được gặp anh, anh Tran.', answers: ['meet'], hintVi: 'động từ: gặp', explanationVi: '"Nice to meet you" dùng khi gặp lần đầu.' },
      { id: 'gr-f2', type: 'fill', prompt: 'I am fine, thanks. How about ___?', promptVi: 'Tôi khỏe, cảm ơn. Còn anh/chị?', answers: ['you'], hintVi: 'đại từ: anh/chị', explanationVi: '"How about you?" hỏi lại người đối diện.' },
      { id: 'gr-f3', type: 'fill', prompt: 'I need to get ___ to my report.', promptVi: 'Tôi cần quay lại với báo cáo.', answers: ['back'], hintVi: 'phó từ: lại', explanationVi: '"get back to" = quay lại làm việc gì.' },
      { id: 'gr-o1', type: 'order', promptVi: 'Sắp xếp thành câu giới thiệu bản thân.', words: ['Hi,', "I'm", 'Minh', 'from', 'Accounting.'], answer: "Hi, I'm Minh from Accounting.", explanationVi: 'Mẫu: I\'m + tên + from + phòng ban.' },
      { id: 'gr-o2', type: 'order', promptVi: 'Sắp xếp thành câu hỏi xã giao.', words: ['How', 'was', 'your', 'weekend?'], answer: 'How was your weekend?', explanationVi: 'Câu hỏi mở, dùng "was" cho quá khứ.' },
      {
        id: 'gr-w1', type: 'writing',
        promptVi: 'Viết 40–70 từ: bạn gặp đồng nghiệp mới Hoa ở bếp văn phòng. Chào, tự giới thiệu, hỏi cuối tuần của chị, rồi kết thúc lịch sự để quay lại làm việc.',
        scenarioEn: 'You meet a new colleague, Hoa, in the office kitchen. Greet her, introduce yourself, ask about her weekend and end the talk politely.',
        minWords: 40,
        requiredPhrases: [['nice to meet'], ['weekend'], ['get back', 'back to'], ['how about', 'and you']],
        modelAnswer: 'Hi Hoa, I\'m Minh from Accounting. Nice to meet you!\nHow was your weekend? I went to Da Lat with my family. How about you?\nSounds relaxing. Anyway, I have to get back to my desk because I have a report due at noon. It was great to catch up. Have a good day!',
      },
    ],
  },
}
