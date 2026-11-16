# Business & Professional English Academy — PROJECT

## Là gì
Ứng dụng PWA học tiếng Anh cho nhân sự văn phòng, kế toán, Finance Controller, FP&A, kiểm soát nội bộ.

## Cho ai
- Giai đoạn 1: dùng cá nhân (chủ dự án).
- Giai đoạn 2: thương mại hóa (chưa bắt đầu).

## Đã chốt
| Quyết định | Lý do |
|---|---|
| React + TypeScript + Vite + Tailwind CSS 4 | Yêu cầu của chủ dự án; miễn phí |
| PWA bằng `vite-plugin-pwa` | Cài lên điện thoại, chạy offline |
| `HashRouter` | Chạy được trên hosting tĩnh, không cần cấu hình máy chủ |
| Lưu `localStorage` qua interface `ProgressRepository` | Demo không cần máy chủ; đổi sang Supabase chỉ thay 1 lớp |
| Lịch ôn SM-2 rút gọn (4 mức) | Đơn giản, đã được kiểm chứng, tự viết, có test |
| Phát âm bằng Web Speech API | Miễn phí; chất lượng tùy thiết bị |
| Chấm luyện viết bằng quy tắc (độ dài + cụm từ) | Chưa dùng AI API trả phí; chỉ là gợi ý, không chấm ngữ pháp |
| Bài đạt khi ≥ 60% bài tập | Ngưỡng tạm; có thể chỉnh `PASS_RATIO` |
| Nhập từ từ file: đọc file trên trình duyệt (pdfjs-dist, mammoth, read-excel-file) | Miễn phí, file không rời máy |
| Tra từ bằng dictionaryapi.dev + MyMemory (chỉ gửi từng từ hoặc cụm từ, có thể tắt) | Miễn phí, không khóa API; chưa dùng AI trả phí |
| Người học duyệt/sửa từng từ trước khi lưu | Nghĩa tự dịch hay sai thuật ngữ chuyên ngành |
| Đồng bộ: Supabase, đăng nhập email + mật khẩu, 1 dòng/người trong bảng `progress` (jsonb + version) | Miễn phí; không phụ thuộc email xác nhận (giới hạn gói Free); đã thiết kế sẵn `ProgressRepository` |
| Gộp dữ liệu (`merge.ts`) thay vì "bản mới ghi đè": thẻ lấy lần ôn mới nhất, buổi học/bài xong lấy hợp, từ xóa dùng "bia mộ" | Hai thiết bị học cùng lúc/offline không mất dữ liệu |
| Ghi có điều kiện theo `version` (tối đa 4 lần thử) | Tránh hai thiết bị ghi đè nhau |
| Cấu hình Supabase qua biến build `VITE_SUPABASE_*` (GitHub Variables) | Không cần dán lại trên từng thiết bị; khóa anon vốn công khai |
| Sao lưu/khôi phục bằng file JSON (gộp, không ghi đè) | Dự phòng, dùng được khi chưa bật đồng bộ |
| Nội dung tự soạn | Tránh bản quyền Forum Flash Study |

## Bản đồ dự án
```
src/
  App.tsx, main.tsx        Khung ứng dụng, điều hướng, đăng ký PWA
  types.ts                 Kiểu dữ liệu (bài học, từ vựng, bài tập, tiến độ)
  data/
    programs.ts            2 chương trình
    lessons.ts             Danh mục 30 bài + gom từ vựng
    lesson-email.ts        Bài mẫu 1 (đầy đủ)
    lesson-variance.ts     Bài mẫu 2 (đầy đủ)
  lib/
    srs.ts                 Thuật toán lịch ôn
    exercises.ts           Chấm điền từ, sắp xếp, luyện viết
    stats.ts               Thống kê, chuỗi ngày, định dạng thời gian
    storage.ts             Interface + LocalStorageRepository
    repository.ts          Nơi lưu cục bộ
    merge.ts               Gộp trạng thái giữa các thiết bị (giao hoán, lũy đẳng)
    sync.ts                Lõi đồng bộ + điều khiển đăng nhập/trạng thái
    supabaseRemote.ts      Kết nối Supabase (bảng progress)
    backup.ts              Xuất/nhập file sao lưu
    store.tsx              Trạng thái toàn ứng dụng (React context)
    useStudyTimer.ts       Đo thời gian học thực tế
    speech.ts              Phát âm
    fileText.ts            Đọc PDF/DOCX/XLSX/CSV/TXT thành chữ
    vocabExtract.ts        Trích từ ứng viên, nhận bảng từ vựng
    dictionary.ts          Tra phiên âm, từ loại, nghĩa (dịch vụ miễn phí)
    stopwords.ts           Danh sách từ bỏ qua
  pages/                   Dashboard, Programs, LessonPage, Review, ExercisePage, History, ImportPage
  test/                    Kiểm thử (SRS, chấm bài, nội dung, luồng giao diện)
public/                    Biểu tượng PWA
```

## Cách thêm một bài học
1. Sao chép `src/data/lesson-email.ts`, đổi `id`, `title`, nội dung.
2. Trong `src/data/lessons.ts`, thay mục danh mục tương ứng bằng bài mới (giữ `id` dạng `office-NN` / `finance-NN`).
3. Mỗi bài cần: 3+ phần giải thích song ngữ, 10 từ vựng, đủ 4 loại bài tập. `npm test` sẽ báo nếu thiếu.

## Đồng bộ (đã code, cần thiết lập một lần)
Xem README.md, mục "Đồng bộ nhiều thiết bị". Sơ đồ: dữ liệu luôn ghi `localStorage` trước; nếu đã đăng nhập, `SyncController.run()` tải dòng từ Supabase → `mergeStates` → ghi lại có điều kiện theo `version`. SQL ở `supabase/schema.sql`.
Khi thương mại hóa: bật xác nhận email + SMTP riêng, thêm "quên mật khẩu", thêm bảng riêng cho từng loại dữ liệu nếu một dòng jsonb quá lớn.

## Hạn chế đã biết
- 28/30 bài mới là danh mục, chưa có nội dung.
- Luyện viết chưa kiểm tra ngữ pháp.
- Đồng bộ mới kiểm thử bằng kho giả và client giả, **chưa chạy với Supabase thật** (cần dự án Supabase của chủ dự án).
- Gộp theo từng từ/buổi học; mục tiêu ngày và bài viết xung đột thì bên sửa gần nhất thắng.
- Cả trạng thái nằm trong một dòng jsonb: đủ cho dùng cá nhân, sẽ chậm nếu lịch sử hàng chục nghìn buổi học.
- Chưa có "quên mật khẩu" và xóa tài khoản trong ứng dụng.
- Phát âm phụ thuộc giọng đọc của thiết bị.
- Từ nhập từ file chưa sửa được sau khi lưu (chỉ xóa rồi nhập lại).
- Không có OCR cho PDF scan; không đọc .doc/.xls cũ.
- Cụm từ chỉ gồm 2–3 từ liền nhau, lặp ≥2 lần; chưa trích cụm có giới từ ("segregation of duties"). Chưa lemmatize đầy đủ.
- Bảng thuật ngữ `src/data/glossary.ts` mới ~60 mục; cần mở rộng dần.
- Phụ thuộc 2 dịch vụ miễn phí bên thứ ba; có thể đổi điều khoản/giới hạn.
- Đọc PDF cần trình duyệt đời mới; chưa thử trên iPhone/Safari thật.

## Việc tiếp theo (đề xuất theo thứ tự)
1. Chủ dự án dùng thử 1 tuần, ghi lại điểm khó dùng.
2. Soạn thêm 8 bài (4 Office, 4 Finance) theo mẫu.
3. ~~Triển khai HTTPS miễn phí~~ (xong) GitHub Pages qua GitHub Actions (đã thêm workflow; cần bật Source = GitHub Actions một lần).
4. Thiết lập Supabase thật theo README và kiểm tra đồng bộ máy tính ↔ điện thoại.
6. Cân nhắc AI chấm viết khi có ngân sách.

## Nhật ký
- 2026-11-16: Tạo bản demo đầu tiên. 17 kiểm thử đạt; đã kiểm tra trên trình duyệt (di động): offline, service worker, ghi thời lượng.
- 2026-11-16: Thêm workflow triển khai GitHub Pages.
- 2026-11-16: Thêm tính năng nhập từ từ PDF/Word/Excel/CSV/TXT. 29 kiểm thử đạt; đã thử file thật trên Chromium.
- 2026-11-16: Thêm trích cụm từ (2–3 từ) và bảng thuật ngữ tài chính tự soạn.
- 2026-11-16: Thêm đồng bộ Supabase, gộp dữ liệu, sao lưu file. 63+ kiểm thử đạt; chưa thử với Supabase thật.
