import type { Lesson } from '../types'

export const phoneLesson: Lesson = {
  id: 'office-03',
  program: 'office',
  order: 3,
  title: 'Phone Calls & Voicemail',
  titleVi: 'Điện thoại và tin nhắn thoại',
  level: 'B1',
  minutes: 25,
  summaryVi: 'Nghe máy, hỏi lại khi chưa rõ, chuyển máy, nhận lời nhắn và để lại tin nhắn thoại gọn.',
  content: {
    sections: [
      {
        heading: { en: '1. Answer and identify', vi: '1. Nghe máy và xưng danh' },
        body: [
          { en: 'Answer with company, name and offer: "Blue Star Finance, Minh speaking. How can I help you?"', vi: 'Nghe máy: tên công ty, tên bạn, lời mời: "Blue Star Finance, Minh nghe đây. Tôi có thể giúp gì?"' },
          { en: 'When you call: "Hello, this is Minh from Blue Star. May I speak to Ms Lan, please?"', vi: 'Khi gọi đi: "Xin chào, tôi là Minh bên Blue Star. Cho tôi nói chuyện với chị Lan được không?"' },
          { en: 'Say "this is", not "I am", when you introduce yourself on the phone.', vi: 'Trên điện thoại nói "this is", không nói "I am", khi xưng danh.' },
        ],
        workExample: {
          en: 'Blue Star Finance, Minh speaking.\nHello, this is Hoa from Delta Audit. Could I speak to Ms Lan, please?',
          vi: 'Hai câu mở đầu chuẩn cho cuộc gọi đến và đi.',
        },
      },
      {
        heading: { en: '2. Clarify, hold, transfer', vi: '2. Hỏi lại, chờ máy, chuyển máy' },
        body: [
          { en: 'If you did not hear: "Sorry, could you repeat that?" or "Could you spell your name, please?"', vi: 'Nếu nghe không rõ: "Xin lỗi, anh/chị nhắc lại giúp?" hoặc "Anh/chị đánh vần tên giúp tôi?"' },
          { en: 'To hold: "Could you hold on a moment? I\'ll check." To transfer: "I\'ll put you through to Accounts Payable."', vi: 'Xin chờ: "Anh/chị chờ một chút, tôi kiểm tra." Chuyển máy: "Tôi sẽ nối máy sang bộ phận Công nợ phải trả."' },
          { en: 'If the person is away: "She is in a meeting. Can I take a message?"', vi: 'Nếu người đó vắng: "Chị ấy đang họp. Tôi ghi lời nhắn được không?"' },
        ],
        workExample: {
          en: 'She is in a meeting until 3 pm. Can I take a message? — Yes, please ask her to call me back about invoice 2209.',
          vi: 'Nhận lời nhắn: ghi tên, số điện thoại, việc cần nói.',
        },
      },
      {
        heading: { en: '3. Leave a voicemail', vi: '3. Để lại tin nhắn thoại' },
        body: [
          { en: 'Keep it under 30 seconds. Say who you are, why you call, what you need, your number.', vi: 'Giữ dưới 30 giây. Nói bạn là ai, vì sao gọi, cần gì, số điện thoại.' },
          { en: 'Say the number slowly, then repeat it at the end.', vi: 'Đọc số chậm, rồi nhắc lại ở cuối.' },
          { en: 'End with the next step: "Please call me back by 4 pm today."', vi: 'Kết bằng bước tiếp theo: "Vui lòng gọi lại cho tôi trước 4 giờ chiều nay."' },
        ],
        workExample: {
          en: 'Hello Ms Lan, this is Minh from Blue Star. I am calling about invoice 2209. Please call me back at 0901 234 567 by 4 pm today. Thank you.',
          vi: 'Tin nhắn mẫu: ai, việc gì, số máy, hạn gọi lại.',
        },
      },
    ],
    vocab: [
      { id: 'ph-speaking', term: 'speaking', ipa: '/ˈspiːkɪŋ/', pos: 'adj.', meaningVi: 'đang nghe máy (Minh speaking)', exampleEn: 'Minh speaking. How can I help?', exampleVi: 'Minh nghe đây. Tôi giúp gì được?' },
      { id: 'ph-hold-on', term: 'hold on', ipa: '/hoʊld ɑːn/', pos: 'phr. v.', meaningVi: 'chờ máy', exampleEn: 'Could you hold on a moment?', exampleVi: 'Anh/chị chờ một chút được không?' },
      { id: 'ph-put-through', term: 'put through', ipa: '/pʊt θruː/', pos: 'phr. v.', meaningVi: 'nối máy', exampleEn: 'I will put you through to Accounts Payable.', exampleVi: 'Tôi sẽ nối máy cho anh/chị sang bộ phận Công nợ phải trả.' },
      { id: 'ph-transfer', term: 'transfer', ipa: '/trænsˈfɜːr/', pos: 'v.', meaningVi: 'chuyển (cuộc gọi)', exampleEn: 'Let me transfer your call.', exampleVi: 'Để tôi chuyển cuộc gọi của anh/chị.' },
      { id: 'ph-message', term: 'take a message', ipa: '/teɪk ə ˈmesɪdʒ/', pos: 'phr.', meaningVi: 'ghi lời nhắn', exampleEn: 'Can I take a message?', exampleVi: 'Tôi ghi lời nhắn được không?' },
      { id: 'ph-call-back', term: 'call back', ipa: '/kɔːl bæk/', pos: 'phr. v.', meaningVi: 'gọi lại', exampleEn: 'Please call me back this afternoon.', exampleVi: 'Vui lòng gọi lại cho tôi chiều nay.' },
      { id: 'ph-voicemail', term: 'voicemail', ipa: '/ˈvɔɪsmeɪl/', pos: 'n.', meaningVi: 'hộp thư thoại', exampleEn: 'I left a voicemail for her.', exampleVi: 'Tôi đã để lại tin nhắn thoại cho chị ấy.' },
      { id: 'ph-repeat', term: 'repeat', ipa: '/rɪˈpiːt/', pos: 'v.', meaningVi: 'nhắc lại', exampleEn: 'Could you repeat the invoice number?', exampleVi: 'Anh/chị nhắc lại số hóa đơn được không?' },
      { id: 'ph-reach', term: 'reach', ipa: '/riːtʃ/', pos: 'v.', meaningVi: 'liên lạc được', exampleEn: 'You can reach me on this number.', exampleVi: 'Anh/chị có thể liên lạc tôi qua số này.' },
      { id: 'ph-available', term: 'available', ipa: '/əˈveɪləbl/', pos: 'adj.', meaningVi: 'rảnh, có mặt', exampleEn: 'Ms Lan is not available right now.', exampleVi: 'Chị Lan hiện không có mặt.' },
    ],
    exercises: [
      { id: 'ph-q1', type: 'mcq', prompt: 'You call someone. Which opening is correct?', promptVi: 'Bạn gọi cho người khác. Câu mở đầu nào đúng?', options: ['I am Minh.', 'This is Minh from Blue Star.', 'Who are you?', 'Minh is here.'], answer: 1, explanationVi: 'Trên điện thoại dùng "This is…".' },
      { id: 'ph-q2', type: 'mcq', prompt: 'You did not hear the name. What do you say?', promptVi: 'Bạn nghe không rõ tên. Nói gì?', options: ['What?', 'Say again.', 'Sorry, could you spell your name, please?', 'I can\'t hear.'], answer: 2, explanationVi: 'Xin lỗi + yêu cầu lịch sự.' },
      { id: 'ph-q3', type: 'mcq', prompt: 'Lan is in a meeting. What do you say?', promptVi: 'Chị Lan đang họp. Bạn nói gì?', options: ['She is busy, bye.', 'She is in a meeting. Can I take a message?', 'Call later.', 'I don\'t know.'], answer: 1, explanationVi: 'Nêu lý do, rồi đề nghị ghi lời nhắn.' },
      { id: 'ph-q4', type: 'mcq', prompt: 'What should a voicemail include?', promptVi: 'Tin nhắn thoại nên có gì?', options: ['Only your name', 'Name, reason, number, next step', 'A long story', 'Nothing'], answer: 1, explanationVi: 'Gọn dưới 30 giây: ai, vì sao, số máy, bước tiếp theo.' },
      { id: 'ph-f1', type: 'fill', prompt: 'Could you hold ___ a moment?', promptVi: 'Anh/chị chờ máy một chút được không?', answers: ['on'], hintVi: 'giới từ: "hold ___"', explanationVi: '"hold on" = chờ máy.' },
      { id: 'ph-f2', type: 'fill', prompt: 'I will put you ___ to Accounts Payable.', promptVi: 'Tôi sẽ nối máy sang bộ phận Công nợ phải trả.', answers: ['through'], hintVi: 'giới từ/phó từ: xuyên qua', explanationVi: '"put you through" = nối máy.' },
      { id: 'ph-f3', type: 'fill', prompt: 'Please call me ___ by 4 pm.', promptVi: 'Vui lòng gọi lại cho tôi trước 4 giờ chiều.', answers: ['back'], hintVi: 'phó từ: lại', explanationVi: '"call back" = gọi lại.' },
      { id: 'ph-o1', type: 'order', promptVi: 'Sắp xếp thành câu nghe máy.', words: ['Blue', 'Star', 'Finance,', 'Minh', 'speaking.'], answer: 'Blue Star Finance, Minh speaking.', explanationVi: 'Công ty, tên, "speaking".' },
      { id: 'ph-o2', type: 'order', promptVi: 'Sắp xếp thành câu xin ghi lời nhắn.', words: ['Can', 'I', 'take', 'a', 'message?'], answer: 'Can I take a message?', explanationVi: '"take a message" = ghi lời nhắn.' },
      {
        id: 'ph-w1', type: 'writing',
        promptVi: 'Viết nội dung tin nhắn thoại 40–70 từ cho chị Lan: bạn là Minh bên Blue Star, gọi về hóa đơn 2209, nhờ chị gọi lại trước 4 giờ chiều, để lại số máy.',
        scenarioEn: 'Write a voicemail for Ms Lan. You are Minh from Blue Star. You are calling about invoice 2209. Ask her to call back by 4 pm and leave your number.',
        minWords: 40,
        requiredPhrases: [['this is'], ['invoice'], ['call me back', 'call back'], ['4 pm', '4pm']],
        modelAnswer: 'Hello Ms Lan, this is Minh from Blue Star. I am calling about invoice 2209. I need to confirm the amount before we pay.\nCould you please call me back by 4 pm today? My number is 0901 234 567. I repeat, 0901 234 567.\nThank you, and have a good day.',
      },
    ],
  },
}
