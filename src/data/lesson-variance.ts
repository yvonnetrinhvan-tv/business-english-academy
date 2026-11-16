import type { Lesson } from '../types'

export const varianceLesson: Lesson = {
  id: 'finance-01',
  program: 'finance',
  order: 1,
  title: 'Budget Variance Analysis',
  titleVi: 'Phân tích chênh lệch ngân sách',
  level: 'B2',
  minutes: 30,
  summaryVi: 'Công thức chênh lệch, thuận lợi/bất lợi, cách giải thích nguyên nhân và đề xuất hành động bằng tiếng Anh.',
  content: {
    sections: [
      {
        heading: { en: '1. What is a variance?', vi: '1. Chênh lệch (variance) là gì?' },
        body: [
          {
            en: 'A variance is the difference between the actual result and the budget. Variance = Actual − Budget.',
            vi: 'Chênh lệch là phần khác nhau giữa số thực tế và số ngân sách. Chênh lệch = Thực tế − Ngân sách.',
          },
          {
            en: 'A favorable variance helps profit: higher revenue or lower cost than budget. An unfavorable variance hurts profit: lower revenue or higher cost.',
            vi: 'Chênh lệch thuận lợi làm lợi nhuận tốt hơn: doanh thu cao hơn hoặc chi phí thấp hơn ngân sách. Chênh lệch bất lợi làm lợi nhuận xấu đi: doanh thu thấp hơn hoặc chi phí cao hơn.',
          },
          {
            en: 'Always say the direction, the amount and the percentage: "Travel cost was USD 12k (15%) over budget."',
            vi: 'Luôn nêu hướng, số tiền và tỷ lệ phần trăm: "Chi phí đi lại vượt ngân sách 12 nghìn USD (15%)."',
          },
        ],
        workExample: {
          en: 'Budget revenue: USD 100k. Actual revenue: USD 120k. Variance: +USD 20k (+20%), favorable. Budget cost: USD 80k. Actual cost: USD 90k. Variance: +USD 10k (+12.5%), unfavorable.',
          vi: 'Doanh thu cao hơn ngân sách là thuận lợi. Chi phí cao hơn ngân sách là bất lợi, dù cả hai đều có dấu "+".',
        },
      },
      {
        heading: { en: '2. Explain it in four steps', vi: '2. Giải thích theo 4 bước' },
        body: [
          { en: 'What happened? State the variance with numbers.', vi: 'Chuyện gì xảy ra? Nêu chênh lệch bằng số liệu.' },
          { en: 'Why? Name the driver (price, volume, timing, one-off).', vi: 'Vì sao? Nêu động lực chính (giá, khối lượng, thời điểm, khoản một lần).' },
          { en: 'So what? Say the effect on the full-year forecast.', vi: 'Ảnh hưởng gì? Nói tác động lên dự báo cả năm.' },
          { en: 'Now what? Propose an action and an owner.', vi: 'Làm gì tiếp? Đề xuất hành động và người chịu trách nhiệm.' },
        ],
        workExample: {
          en: 'Marketing spend was USD 30k (20%) over budget. The main driver was an unplanned campaign in May. If we do nothing, we expect a USD 45k overspend for the year. I suggest freezing new campaigns in Q3. The marketing lead will confirm by Friday.',
          vi: 'Ví dụ trọn vẹn 4 bước trong một đoạn ngắn gửi giám đốc tài chính.',
        },
      },
      {
        heading: { en: '3. Useful language', vi: '3. Mẫu câu thường dùng' },
        body: [
          { en: 'Direction: "exceeded budget by", "came in below budget", "was in line with budget".', vi: 'Hướng: "vượt ngân sách", "thấp hơn ngân sách", "đúng với ngân sách".' },
          { en: 'Cause: "mainly due to", "driven by", "partly offset by", "timing difference".', vi: 'Nguyên nhân: "chủ yếu do", "do tác động của", "một phần được bù bởi", "chênh lệch thời điểm".' },
          { en: 'Materiality: "Variances above 5% or USD 10k require a written explanation."', vi: 'Ngưỡng trọng yếu: "Chênh lệch trên 5% hoặc 10 nghìn USD cần giải trình bằng văn bản."' },
        ],
        workExample: {
          en: 'Personnel cost was 3% below budget, mainly due to two vacant roles, partly offset by overtime in the finance team.',
          vi: 'Chi phí nhân sự thấp hơn ngân sách 3% chủ yếu do hai vị trí còn trống, một phần được bù bởi giờ làm thêm của bộ phận tài chính.',
        },
      },
    ],
    vocab: [
      { id: 'bv-variance', term: 'variance', ipa: '/ˈveriəns/', pos: 'n.', meaningVi: 'chênh lệch', exampleEn: 'The variance this month is USD 5k.', exampleVi: 'Chênh lệch tháng này là 5 nghìn USD.' },
      { id: 'bv-budget', term: 'budget', ipa: '/ˈbʌdʒɪt/', pos: 'n.', meaningVi: 'ngân sách', exampleEn: 'We approved the budget in January.', exampleVi: 'Chúng tôi duyệt ngân sách vào tháng Một.' },
      { id: 'bv-actual', term: 'actual', ipa: '/ˈæktʃuəl/', pos: 'n.', meaningVi: 'số thực tế', exampleEn: 'Actuals are below the plan.', exampleVi: 'Số thực tế thấp hơn kế hoạch.' },
      { id: 'bv-favorable', term: 'favorable', ipa: '/ˈfeɪvərəbl/', pos: 'adj.', meaningVi: 'thuận lợi (có lợi cho lợi nhuận)', exampleEn: 'Lower rent created a favorable variance.', exampleVi: 'Tiền thuê thấp hơn tạo ra chênh lệch thuận lợi.' },
      { id: 'bv-unfavorable', term: 'unfavorable', ipa: '/ʌnˈfeɪvərəbl/', pos: 'adj.', meaningVi: 'bất lợi (làm giảm lợi nhuận)', exampleEn: 'Higher freight cost is unfavorable.', exampleVi: 'Cước vận chuyển cao hơn là bất lợi.' },
      { id: 'bv-overspend', term: 'overspend', ipa: '/ˌoʊvərˈspend/', pos: 'v.', meaningVi: 'chi vượt', exampleEn: 'The team overspent by 8%.', exampleVi: 'Nhóm đã chi vượt 8%.' },
      { id: 'bv-shortfall', term: 'shortfall', ipa: '/ˈʃɔːrtfɔːl/', pos: 'n.', meaningVi: 'khoản thiếu hụt', exampleEn: 'We have a revenue shortfall of USD 40k.', exampleVi: 'Chúng tôi thiếu hụt doanh thu 40 nghìn USD.' },
      { id: 'bv-driver', term: 'driver', ipa: '/ˈdraɪvər/', pos: 'n.', meaningVi: 'yếu tố tác động chính', exampleEn: 'Volume is the main cost driver.', exampleVi: 'Khối lượng là yếu tố chính tác động đến chi phí.' },
      { id: 'bv-accrual', term: 'accrual', ipa: '/əˈkruːəl/', pos: 'n.', meaningVi: 'khoản trích trước, dồn tích', exampleEn: 'We booked an accrual for December utilities.', exampleVi: 'Chúng tôi hạch toán trích trước tiền điện nước tháng 12.' },
      { id: 'bv-root-cause', term: 'root cause', ipa: '/ruːt kɔːz/', pos: 'n.', meaningVi: 'nguyên nhân gốc', exampleEn: 'We need the root cause of the variance.', exampleVi: 'Chúng ta cần nguyên nhân gốc của chênh lệch này.' },
    ],
    exercises: [
      { id: 'bv-q1', type: 'mcq', prompt: 'Revenue: actual 120, budget 100. What is the variance?', promptVi: 'Doanh thu: thực tế 120, ngân sách 100. Chênh lệch là gì?', options: ['Unfavorable, −20', 'Favorable, +20', 'Favorable, −20', 'Unfavorable, +20'], answer: 1, explanationVi: 'Doanh thu cao hơn ngân sách nên thuận lợi. 120 − 100 = +20.' },
      { id: 'bv-q2', type: 'mcq', prompt: 'Cost: actual 90, budget 80. What is the variance?', promptVi: 'Chi phí: thực tế 90, ngân sách 80. Chênh lệch là gì?', options: ['Favorable, +10', 'Favorable, −10', 'Unfavorable, +10', 'Unfavorable, −10'], answer: 2, explanationVi: 'Chi phí cao hơn ngân sách là bất lợi. 90 − 80 = +10.' },
      { id: 'bv-q3', type: 'mcq', prompt: 'Which phrase means "mainly because of"?', promptVi: 'Cụm nào nghĩa là "chủ yếu vì"?', options: ['in line with', 'mainly due to', 'partly offset by', 'came in below'], answer: 1, explanationVi: '"mainly due to" nêu nguyên nhân chính.' },
      { id: 'bv-q4', type: 'mcq', prompt: 'What is the "So what?" step?', promptVi: 'Bước "So what?" là gì?', options: ['State the number', 'Name the driver', 'Say the effect on the full-year forecast', 'Assign an owner'], answer: 2, explanationVi: 'Bước 3 nói tác động lên dự báo cả năm.' },
      { id: 'bv-f1', type: 'fill', prompt: 'Travel cost ___ budget by 12% because of higher airfares.', promptVi: 'Chi phí đi lại vượt ngân sách 12% vì giá vé máy bay tăng.', answers: ['exceeded'], hintVi: 'động từ quá khứ: vượt', explanationVi: '"exceeded budget by" = vượt ngân sách.' },
      { id: 'bv-f2', type: 'fill', prompt: 'A higher cost than budget is an ___ variance.', promptVi: 'Chi phí cao hơn ngân sách là chênh lệch bất lợi.', answers: ['unfavorable', 'unfavourable', 'adverse'], hintVi: 'tính từ: bất lợi', explanationVi: 'Chi phí tăng làm giảm lợi nhuận: unfavorable.' },
      { id: 'bv-f3', type: 'fill', prompt: 'The overspend was ___ offset by lower rent.', promptVi: 'Khoản chi vượt được bù một phần bởi tiền thuê thấp hơn.', answers: ['partly', 'partially'], hintVi: 'trạng từ: một phần', explanationVi: '"partly offset by" = được bù một phần bởi.' },
      { id: 'bv-o1', type: 'order', promptVi: 'Sắp xếp thành câu báo cáo chênh lệch.', words: ['Marketing', 'spend', 'was', '20%', 'over', 'budget', 'due', 'to', 'an', 'unplanned', 'campaign.'], answer: 'Marketing spend was 20% over budget due to an unplanned campaign.', explanationVi: 'Mẫu: số liệu + "due to" + nguyên nhân.' },
      { id: 'bv-o2', type: 'order', promptVi: 'Sắp xếp thành câu về dự báo.', words: ['We', 'expect', 'a', 'full-year', 'overspend', 'of', 'USD', '45k.'], answer: 'We expect a full-year overspend of USD 45k.', explanationVi: 'Nêu tác động lên cả năm sau khi giải thích nguyên nhân.' },
      {
        id: 'bv-w1', type: 'writing',
        promptVi: 'Viết 60–100 từ gửi giám đốc tài chính: chi phí marketing vượt ngân sách 30k USD (20%) do chiến dịch ngoài kế hoạch. Nêu nguyên nhân, tác động cả năm và đề xuất.',
        scenarioEn: 'Marketing spend is USD 30k (20%) over budget because of an unplanned campaign. Explain the cause, the full-year effect and your proposal to the Finance Director.',
        minWords: 60,
        requiredPhrases: [['over budget', 'exceeded'], ['due to', 'driven by', 'because of'], ['full-year', 'forecast', 'year-end'], ['suggest', 'recommend', 'propose']],
        modelAnswer: 'Subject: Marketing variance – May\n\nDear Ms Linh,\n\nMarketing spend is USD 30k (20%) over budget year-to-date. The overspend is due to an unplanned campaign launched in May.\n\nIf spending continues at this rate, we expect a full-year overspend of USD 45k, which would reduce operating profit by 1.2%.\n\nI recommend freezing new campaigns in Q3. The marketing lead will confirm the revised plan by Friday.\n\nBest regards,\nMinh',
      },
    ],
  },
}
