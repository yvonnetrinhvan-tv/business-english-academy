import type { Lesson } from '../types'

export const statementsLesson: Lesson = {
  id: 'finance-02',
  program: 'finance',
  order: 2,
  title: 'Financial Statements Basics',
  titleVi: 'Nền tảng báo cáo tài chính',
  level: 'B1',
  minutes: 25,
  summaryVi: 'Ba báo cáo chính, mối liên hệ giữa chúng và cách đọc, mô tả số liệu bằng tiếng Anh.',
  content: {
    sections: [
      {
        heading: { en: '1. The three statements', vi: '1. Ba báo cáo chính' },
        body: [
          { en: 'The balance sheet shows assets, liabilities and equity at one date.', vi: 'Bảng cân đối kế toán cho thấy tài sản, nợ phải trả và vốn chủ sở hữu tại một thời điểm.' },
          { en: 'The income statement (profit and loss) shows revenue, expenses and profit over a period.', vi: 'Báo cáo kết quả kinh doanh cho thấy doanh thu, chi phí và lợi nhuận trong một kỳ.' },
          { en: 'The cash flow statement shows cash in and out from operating, investing and financing activities.', vi: 'Báo cáo lưu chuyển tiền tệ cho thấy tiền thu vào và chi ra từ hoạt động kinh doanh, đầu tư và tài chính.' },
        ],
        workExample: {
          en: 'The balance sheet is a snapshot. The income statement is a movie. The cash flow statement explains why cash changed.',
          vi: 'Bảng cân đối như ảnh chụp, báo cáo kết quả như đoạn phim, lưu chuyển tiền giải thích tiền thay đổi vì đâu.',
        },
      },
      {
        heading: { en: '2. How they connect', vi: '2. Chúng liên hệ với nhau thế nào' },
        body: [
          { en: 'Net income from the income statement flows into retained earnings on the balance sheet.', vi: 'Lợi nhuận ròng từ báo cáo kết quả chuyển vào lợi nhuận giữ lại trên bảng cân đối.' },
          { en: 'The ending cash balance on the cash flow statement equals cash on the balance sheet.', vi: 'Số dư tiền cuối kỳ trên báo cáo lưu chuyển tiền bằng tiền trên bảng cân đối.' },
          { en: 'The basic equation: assets = liabilities + equity.', vi: 'Phương trình cơ bản: tài sản = nợ phải trả + vốn chủ sở hữu.' },
        ],
        workExample: {
          en: 'Profit was 200 million, but cash fell by 50 million because receivables rose by 250 million.',
          vi: 'Lãi 200 triệu nhưng tiền giảm 50 triệu vì phải thu tăng 250 triệu: báo cáo lưu chuyển tiền giải thích khác biệt này.',
        },
      },
      {
        heading: { en: '3. Describing numbers', vi: '3. Mô tả số liệu' },
        body: [
          { en: 'Use verbs for change: revenue rose by 8%, costs fell by 3%, margin remained flat.', vi: 'Dùng động từ chỉ thay đổi: doanh thu tăng 8%, chi phí giảm 3%, biên lợi nhuận giữ nguyên.' },
          { en: 'Compare periods: "compared with last year", "year over year", "quarter on quarter".', vi: 'So sánh kỳ: "so với năm ngoái", "theo năm", "theo quý".' },
          { en: 'Use "by" for the size of change and "to" for the new level: up by 5% to 120 million.', vi: 'Dùng "by" cho mức thay đổi và "to" cho mức mới: tăng 5% lên 120 triệu.' },
        ],
        workExample: {
          en: 'Revenue increased by 8% to 450 million compared with last year, mainly because of higher volume.',
          vi: 'Mẫu câu nhận xét: tăng bao nhiêu, lên mức nào, so với kỳ nào, vì sao.',
        },
      },
    ],
    vocab: [
      { id: 'fs-assets', term: 'assets', ipa: '/ˈæsets/', pos: 'n.', meaningVi: 'tài sản', exampleEn: 'Total assets rose to 2 billion.', exampleVi: 'Tổng tài sản tăng lên 2 tỷ.' },
      { id: 'fs-liabilities', term: 'liabilities', ipa: '/ˌlaɪəˈbɪlətiz/', pos: 'n.', meaningVi: 'nợ phải trả', exampleEn: 'Current liabilities fall due within a year.', exampleVi: 'Nợ ngắn hạn đến hạn trong vòng một năm.' },
      { id: 'fs-equity', term: 'equity', ipa: '/ˈekwəti/', pos: 'n.', meaningVi: 'vốn chủ sở hữu', exampleEn: 'Equity equals assets minus liabilities.', exampleVi: 'Vốn chủ sở hữu bằng tài sản trừ nợ phải trả.' },
      { id: 'fs-revenue', term: 'revenue', ipa: '/ˈrevənuː/', pos: 'n.', meaningVi: 'doanh thu', exampleEn: 'Revenue grew by 8% this quarter.', exampleVi: 'Doanh thu quý này tăng 8%.' },
      { id: 'fs-net-income', term: 'net income', ipa: '/net ˈɪnkʌm/', pos: 'n.', meaningVi: 'lợi nhuận ròng', exampleEn: 'Net income was 120 million.', exampleVi: 'Lợi nhuận ròng là 120 triệu.' },
      { id: 'fs-retained', term: 'retained earnings', ipa: '/rɪˈteɪnd ˈɜːrnɪŋz/', pos: 'n.', meaningVi: 'lợi nhuận giữ lại', exampleEn: 'Retained earnings increased after the year-end close.', exampleVi: 'Lợi nhuận giữ lại tăng sau khi khóa sổ cuối năm.' },
      { id: 'fs-margin', term: 'gross margin', ipa: '/ɡroʊs ˈmɑːrdʒɪn/', pos: 'n.', meaningVi: 'biên lợi nhuận gộp', exampleEn: 'Gross margin improved to 32%.', exampleVi: 'Biên lợi nhuận gộp cải thiện lên 32%.' },
      { id: 'fs-compared-with', term: 'compared with', ipa: '/kəmˈperd wɪð/', pos: 'phr.', meaningVi: 'so với', exampleEn: 'Costs fell compared with last year.', exampleVi: 'Chi phí giảm so với năm ngoái.' },
      { id: 'fs-year-over-year', term: 'year over year', ipa: '/jɪr ˈoʊvər jɪr/', pos: 'phr.', meaningVi: 'so với cùng kỳ năm trước', exampleEn: 'Sales grew 5% year over year.', exampleVi: 'Doanh số tăng 5% so với cùng kỳ năm trước.' },
      { id: 'fs-by-and-to', term: 'increase by', ipa: '/ɪnˈkriːs baɪ/', pos: 'phr.', meaningVi: 'tăng một mức (dùng "by" cho mức tăng)', exampleEn: 'Costs increase by 3% each year.', exampleVi: 'Chi phí tăng 3% mỗi năm.' },
    ],
    exercises: [
      { id: 'fs-q1', type: 'mcq', prompt: 'Which statement shows assets and liabilities at one date?', promptVi: 'Báo cáo nào cho thấy tài sản và nợ tại một thời điểm?', options: ['Income statement', 'Cash flow statement', 'Balance sheet', 'Budget'], answer: 2, explanationVi: 'Bảng cân đối kế toán là ảnh chụp tại một ngày.' },
      { id: 'fs-q2', type: 'mcq', prompt: 'Which equation is correct?', promptVi: 'Phương trình nào đúng?', options: ['Assets = liabilities − equity', 'Assets = liabilities + equity', 'Equity = assets + liabilities', 'Revenue = assets + equity'], answer: 1, explanationVi: 'Tài sản = nợ phải trả + vốn chủ sở hữu.' },
      { id: 'fs-q3', type: 'mcq', prompt: 'Revenue rose from 100 to 108. Which sentence is correct?', promptVi: 'Doanh thu tăng từ 100 lên 108. Câu nào đúng?', options: ['Revenue rose by 8%.', 'Revenue rose to 8%.', 'Revenue rose of 8%.', 'Revenue rose at 8.'], answer: 0, explanationVi: '"rose by 8%" nêu mức tăng.' },
      { id: 'fs-q4', type: 'mcq', prompt: 'Profit is high, but cash fell. Which statement explains why?', promptVi: 'Lãi cao nhưng tiền giảm. Báo cáo nào giải thích?', options: ['Cash flow statement', 'Cover letter', 'Organization chart', 'Price list'], answer: 0, explanationVi: 'Báo cáo lưu chuyển tiền tệ cho thấy tiền thay đổi vì đâu.' },
      { id: 'fs-f1', type: 'fill', prompt: 'Revenue increased ___ 8% to 450 million.', promptVi: 'Doanh thu tăng 8% lên 450 triệu.', answers: ['by'], hintVi: 'giới từ chỉ mức thay đổi', explanationVi: '"increase by" + mức; "to" + mức mới.' },
      { id: 'fs-f2', type: 'fill', prompt: 'Costs fell ___ with last year.', promptVi: 'Chi phí giảm so với năm ngoái.', answers: ['compared'], hintVi: 'quá khứ phân từ', explanationVi: '"compared with" = so với.' },
      { id: 'fs-f3', type: 'fill', prompt: 'Total ___ equal liabilities plus equity.', promptVi: 'Tổng tài sản bằng nợ phải trả cộng vốn chủ sở hữu.', answers: ['assets'], hintVi: 'danh từ số nhiều', explanationVi: 'Phương trình kế toán cơ bản.' },
      { id: 'fs-o1', type: 'order', promptVi: 'Sắp xếp thành câu nhận xét doanh thu.', words: ['Revenue', 'increased', 'by', '8%', 'compared', 'with', 'last', 'year.'], answer: 'Revenue increased by 8% compared with last year.', explanationVi: 'Động từ + by + mức + so với kỳ.' },
      { id: 'fs-o2', type: 'order', promptVi: 'Sắp xếp thành câu về lợi nhuận giữ lại.', words: ['Net', 'income', 'flows', 'into', 'retained', 'earnings.'], answer: 'Net income flows into retained earnings.', explanationVi: 'Lợi nhuận ròng chuyển vào lợi nhuận giữ lại.' },
      {
        id: 'fs-w1', type: 'writing',
        promptVi: 'Viết 50–80 từ nhận xét quý này: doanh thu tăng 8% lên 450 triệu so với năm ngoái, nhưng tiền giảm 50 triệu vì phải thu tăng.',
        scenarioEn: 'Comment on this quarter. Revenue rose by 8% to 450 million compared with last year, but cash fell by 50 million because receivables increased.',
        minWords: 50,
        requiredPhrases: [['increased by', 'rose by', 'grew by'], ['compared with', 'compared to'], ['cash'], ['receivables']],
        modelAnswer: 'Revenue increased by 8% to 450 million compared with last year, driven by higher volume. Gross margin stayed flat at 32%.\nHowever, cash fell by 50 million. The main reason is that receivables rose by 250 million, so we booked the sales but have not yet collected the money. We will focus on collection in the next quarter.',
      },
    ],
  },
}
