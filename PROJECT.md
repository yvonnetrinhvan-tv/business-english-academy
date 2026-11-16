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
    repository.ts          Nơi chọn nơi lưu (đổi sang Supabase tại đây)
    store.tsx              Trạng thái toàn ứng dụng (React context)
    useStudyTimer.ts       Đo thời gian học thực tế
    speech.ts              Phát âm
  pages/                   Dashboard, Programs, LessonPage, Review, ExercisePage, History
  test/                    Kiểm thử (SRS, chấm bài, nội dung, luồng giao diện)
public/                    Biểu tượng PWA
```

## Cách thêm một bài học
1. Sao chép `src/data/lesson-email.ts`, đổi `id`, `title`, nội dung.
2. Trong `src/data/lessons.ts`, thay mục danh mục tương ứng bằng bài mới (giữ `id` dạng `office-NN` / `finance-NN`).
3. Mỗi bài cần: 3+ phần giải thích song ngữ, 10 từ vựng, đủ 4 loại bài tập. `npm test` sẽ báo nếu thiếu.

## Sau này nối Supabase
1. Tạo dự án Supabase miễn phí, bảng `progress` (user_id, data jsonb, updated_at).
2. Viết `SupabaseRepository implements ProgressRepository` trong `src/lib/`.
3. Đổi `repository` trong `src/lib/repository.ts`.
4. Thêm đăng nhập (Supabase Auth) và cơ chế gộp dữ liệu local khi đăng nhập lần đầu.

## Hạn chế đã biết
- 28/30 bài mới là danh mục, chưa có nội dung.
- Luyện viết chưa kiểm tra ngữ pháp.
- Dữ liệu chỉ nằm trên một trình duyệt.
- Phát âm phụ thuộc giọng đọc của thiết bị.
- Chưa có giao diện thêm/sửa từ vựng riêng.

## Việc tiếp theo (đề xuất theo thứ tự)
1. Chủ dự án dùng thử 1 tuần, ghi lại điểm khó dùng.
2. Soạn thêm 8 bài (4 Office, 4 Finance) theo mẫu.
3. ~~Triển khai HTTPS miễn phí~~ GitHub Pages qua GitHub Actions (đã thêm workflow; cần bật Source = GitHub Actions một lần).
4. Nối Supabase để đồng bộ nhiều thiết bị.
5. Thêm xuất/nhập tiến độ ra file JSON (sao lưu).
6. Cân nhắc AI chấm viết khi có ngân sách.

## Nhật ký
- 2026-11-16: Tạo bản demo đầu tiên. 17 kiểm thử đạt; đã kiểm tra trên trình duyệt (di động): offline, service worker, ghi thời lượng.
- 2026-11-16: Thêm workflow triển khai GitHub Pages.
