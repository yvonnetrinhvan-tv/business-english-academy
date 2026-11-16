import type { Lesson } from '../types'

export const cashflowLesson: Lesson = {
  id: 'finance-05',
  program: 'finance',
  order: 5,
  title: 'Cash Flow & Working Capital',
  titleVi: 'Dòng tiền và vốn lưu động',
  level: 'B2',
  minutes: 25,
  summaryVi: 'Ba nhóm dòng tiền, vốn lưu động, vòng quay tiền và cách giải thích biến động tiền bằng tiếng Anh.',
  content: {
    sections: [
      {
        heading: { en: '1. Three types of cash flow', vi: '1. Ba nhóm dòng tiền' },
        body: [
          { en: 'Operating cash flow comes from core business: customers pay you, you pay suppliers and staff.', vi: 'Dòng tiền kinh doanh đến từ hoạt động cốt lõi: khách trả bạn, bạn trả nhà cung cấp và nhân viên.' },
          { en: 'Investing cash flow covers purchases and sales of equipment or investments.', vi: 'Dòng tiền đầu tư gồm mua và bán thiết bị hay khoản đầu tư.' },
          { en: 'Financing cash flow covers loans, repayments, share issues and dividends.', vi: 'Dòng tiền tài chính gồm vay, trả nợ, phát hành cổ phiếu và cổ tức.' },
        ],
        workExample: {
          en: 'Operating cash flow was 90 million. Investing cash flow was minus 60 million for new machines. Financing cash flow was minus 10 million for loan repayment.',
          vi: 'Số âm là tiền chi ra. Tổng dòng tiền = 90 − 60 − 10 = 20 triệu.',
        },
      },
      {
        heading: { en: '2. Working capital', vi: '2. Vốn lưu động' },
        body: [
          { en: 'Working capital = current assets − current liabilities. It shows if you can pay short-term bills.', vi: 'Vốn lưu động = tài sản ngắn hạn − nợ ngắn hạn. Chỉ số này cho biết bạn có trả được hóa đơn ngắn hạn không.' },
          { en: 'Cash conversion cycle = days of inventory + days of receivables − days of payables.', vi: 'Chu kỳ chuyển đổi tiền = số ngày tồn kho + số ngày phải thu − số ngày phải trả.' },
          { en: 'A shorter cycle frees cash. Collect faster, hold less stock, pay suppliers on terms.', vi: 'Chu kỳ ngắn hơn giải phóng tiền. Thu nhanh hơn, giữ ít hàng hơn, trả nhà cung cấp đúng điều khoản.' },
        ],
        workExample: {
          en: 'Days of receivables rose from 45 to 60. As a result, working capital tied up in receivables increased by 150 million.',
          vi: 'Số ngày phải thu tăng nên tiền bị giữ trong khoản phải thu tăng 150 triệu.',
        },
      },
      {
        heading: { en: '3. Explaining a change in cash', vi: '3. Giải thích biến động tiền' },
        body: [
          { en: 'Start with the result, then give the main drivers: "Cash decreased by 50 million, mainly due to higher receivables."', vi: 'Nêu kết quả trước, rồi các nguyên nhân chính: "Tiền giảm 50 triệu, chủ yếu do khoản phải thu tăng."' },
          { en: 'Use linking phrases: "due to", "as a result of", "driven by", "partly offset by".', vi: 'Dùng cụm nối: "do", "kết quả của", "do tác động của", "một phần được bù bởi".' },
          { en: 'End with an action: "We will tighten collection to release cash."', vi: 'Kết bằng hành động: "Chúng tôi sẽ siết thu hồi nợ để giải phóng tiền."' },
        ],
        workExample: {
          en: 'Cash decreased by 50 million in March, mainly due to a 150 million increase in receivables, partly offset by 100 million of higher payables.',
          vi: 'Một câu gom đủ: kết quả, nguyên nhân chính, khoản bù trừ.',
        },
      },
    ],
    vocab: [
      { id: 'cf-operating', term: 'operating cash flow', ipa: '/ˈɑːpəreɪtɪŋ kæʃ floʊ/', pos: 'n.', meaningVi: 'dòng tiền từ hoạt động kinh doanh', exampleEn: 'Operating cash flow improved this quarter.', exampleVi: 'Dòng tiền kinh doanh quý này cải thiện.' },
      { id: 'cf-working-capital', term: 'working capital', ipa: '/ˈwɜːrkɪŋ ˈkæpɪtl/', pos: 'n.', meaningVi: 'vốn lưu động', exampleEn: 'Working capital is tight after the new order.', exampleVi: 'Vốn lưu động eo hẹp sau đơn hàng mới.' },
      { id: 'cf-inventory', term: 'inventory', ipa: '/ˈɪnvəntɔːri/', pos: 'n.', meaningVi: 'hàng tồn kho', exampleEn: 'Inventory grew by 20%.', exampleVi: 'Hàng tồn kho tăng 20%.' },
      { id: 'cf-payables', term: 'payables', ipa: '/ˈpeɪəblz/', pos: 'n.', meaningVi: 'các khoản phải trả', exampleEn: 'Higher payables helped cash.', exampleVi: 'Khoản phải trả tăng hỗ trợ dòng tiền.' },
      { id: 'cf-liquidity', term: 'liquidity', ipa: '/lɪˈkwɪdəti/', pos: 'n.', meaningVi: 'khả năng thanh khoản', exampleEn: 'Liquidity is healthy at 3 months of costs.', exampleVi: 'Thanh khoản ổn, đủ 3 tháng chi phí.' },
      { id: 'cf-due-to', term: 'due to', ipa: '/duː tuː/', pos: 'phr.', meaningVi: 'do, bởi vì', exampleEn: 'Cash fell due to higher receivables.', exampleVi: 'Tiền giảm do khoản phải thu tăng.' },
      { id: 'cf-as-a-result-of', term: 'as a result of', ipa: '/æz ə rɪˈzʌlt əv/', pos: 'phr.', meaningVi: 'là kết quả của', exampleEn: 'Costs rose as a result of the price increase.', exampleVi: 'Chi phí tăng do giá tăng.' },
      { id: 'cf-offset-by', term: 'offset by', ipa: '/ˈɔːfset baɪ/', pos: 'phr. v.', meaningVi: 'được bù bởi', exampleEn: 'The increase was offset by lower costs.', exampleVi: 'Mức tăng được bù bởi chi phí giảm.' },
      { id: 'cf-tied-up-in', term: 'tied up in', ipa: '/taɪd ʌp ɪn/', pos: 'phr.', meaningVi: 'bị giữ trong (vốn nằm trong…)', exampleEn: 'Cash is tied up in inventory.', exampleVi: 'Tiền đang nằm trong hàng tồn kho.' },
      { id: 'cf-burn-rate', term: 'burn rate', ipa: '/bɜːrn reɪt/', pos: 'n.', meaningVi: 'tốc độ đốt tiền', exampleEn: 'Our burn rate is 30 million a month.', exampleVi: 'Tốc độ đốt tiền của chúng tôi là 30 triệu một tháng.' },
    ],
    exercises: [
      { id: 'cf-q1', type: 'mcq', prompt: 'Paying back a bank loan is part of which cash flow?', promptVi: 'Trả nợ vay ngân hàng thuộc dòng tiền nào?', options: ['Operating', 'Investing', 'Financing', 'Inventory'], answer: 2, explanationVi: 'Vay và trả nợ là hoạt động tài chính.' },
      { id: 'cf-q2', type: 'mcq', prompt: 'Which is the formula for working capital?', promptVi: 'Công thức vốn lưu động nào đúng?', options: ['Current assets − current liabilities', 'Revenue − cost', 'Assets + equity', 'Cash + loans'], answer: 0, explanationVi: 'Vốn lưu động = tài sản ngắn hạn − nợ ngắn hạn.' },
      { id: 'cf-q3', type: 'mcq', prompt: 'Which phrase links a cause?', promptVi: 'Cụm nào nối nguyên nhân?', options: ['due to', 'in front of', 'as well', 'by the way'], answer: 0, explanationVi: '"due to" + nguyên nhân.' },
      { id: 'cf-q4', type: 'mcq', prompt: 'Receivables rose, so cash is "___ in receivables".', promptVi: 'Phải thu tăng nên tiền bị "___ in receivables".', options: ['tied up', 'cut off', 'paid out', 'written'], answer: 0, explanationVi: '"tied up in" = bị giữ trong.' },
      { id: 'cf-f1', type: 'fill', prompt: 'Cash decreased ___ to higher receivables.', promptVi: 'Tiền giảm do khoản phải thu tăng.', answers: ['due'], hintVi: 'tính từ: do', explanationVi: '"due to".' },
      { id: 'cf-f2', type: 'fill', prompt: 'The increase was ___ by lower costs.', promptVi: 'Mức tăng được bù bởi chi phí giảm.', answers: ['offset'], hintVi: 'quá khứ phân từ: bù trừ', explanationVi: '"offset by" = bù bởi.' },
      { id: 'cf-f3', type: 'fill', prompt: 'Cash is tied up ___ inventory.', promptVi: 'Tiền đang nằm trong hàng tồn kho.', answers: ['in'], hintVi: 'giới từ', explanationVi: '"tied up in".' },
      { id: 'cf-o1', type: 'order', promptVi: 'Sắp xếp thành câu giải thích tiền giảm.', words: ['Cash', 'decreased', 'by', '50', 'million', 'due', 'to', 'higher', 'receivables.'], answer: 'Cash decreased by 50 million due to higher receivables.', explanationVi: 'Kết quả + by + mức + due to + nguyên nhân.' },
      { id: 'cf-o2', type: 'order', promptVi: 'Sắp xếp thành câu đề xuất hành động.', words: ['We', 'will', 'tighten', 'collection', 'to', 'release', 'cash.'], answer: 'We will tighten collection to release cash.', explanationVi: 'Hành động + to + mục đích.' },
      {
        id: 'cf-w1', type: 'writing',
        promptVi: 'Viết 60–90 từ giải thích: tiền tháng 3 giảm 50 triệu, chủ yếu do phải thu tăng 150 triệu, một phần được bù bởi phải trả tăng 100 triệu. Nêu một hành động.',
        scenarioEn: 'Explain why cash fell by 50 million in March: receivables rose by 150 million, partly offset by 100 million of higher payables. End with an action.',
        minWords: 50,
        requiredPhrases: [['decreased by', 'fell by', 'dropped by'], ['due to', 'as a result of', 'driven by'], ['offset'], ['will', 'plan to']],
        modelAnswer: 'Cash decreased by 50 million in March. This was mainly due to a 150 million increase in receivables, partly offset by 100 million of higher payables.\nTwo large customers paid after the due date, so cash is tied up in receivables. We will tighten collection and call these customers this week to release cash before quarter end.',
      },
    ],
  },
}
