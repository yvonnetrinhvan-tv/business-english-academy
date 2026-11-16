# Business & Professional English Academy

Ứng dụng web (PWA) học tiếng Anh văn phòng và tài chính. Bản demo đầu tiên, lưu tiến độ trên trình duyệt.

## Chức năng

- Tổng quan: tiến độ, thời gian học hôm nay, chuỗi ngày, bài học hôm nay.
- 2 chương trình, 30 bài (15 Office English, 15 Professional Finance English). 2 bài đã đủ nội dung: *Professional Email Writing*, *Budget Variance Analysis*.
- Flashcards: từ vựng, phiên âm, từ loại, nghĩa, ví dụ, phát âm (giọng đọc của trình duyệt).
- Bài tập: trắc nghiệm, điền từ, sắp xếp câu, luyện viết (chấm theo quy tắc, không dùng AI).
- Lịch ôn tự động (thuật toán SM-2 rút gọn): Quên / Khó / Nhớ / Dễ.
- **Đồng bộ nhiều thiết bị** (Supabase) và **sao lưu/khôi phục bằng file**.
- Lịch sử, điểm số, thời lượng thực tế (chỉ tính khi tab đang mở).
- **Nhập từ từ tài liệu**: tải PDF, Word (.docx), Excel (.xlsx), CSV, TXT → tự chọn từ mới, tra phiên âm/từ loại/nghĩa, bạn sửa rồi thêm vào lịch ôn.
- Giao diện tiếng Việt, dùng được trên máy tính và điện thoại, chạy offline.

## Chạy trên máy

Cần cài [Node.js](https://nodejs.org) bản 20 trở lên.

```bash
npm install
npm run dev
```

Mở địa chỉ hiện ra (thường là http://localhost:5173).

## Lệnh thường dùng

| Lệnh | Việc làm |
|---|---|
| `npm run dev` | Chạy thử khi đang sửa |
| `npm test` | Chạy kiểm thử |
| `npm run typecheck` | Kiểm tra kiểu TypeScript |
| `npm run build` | Tạo bản chạy thật trong `dist/` |
| `npm run preview` | Xem bản `dist/` (kiểm tra PWA) |

## Cài lên điện thoại

Mở bản đã triển khai bằng Chrome (Android) hoặc Safari (iPhone) → "Thêm vào màn hình chính".
PWA cần địa chỉ HTTPS. Dự án có sẵn workflow `.github/workflows/deploy.yml`: mỗi lần gộp vào `main`, GitHub chạy kiểm thử, build và đưa lên GitHub Pages.
Địa chỉ: `https://yvonnetrinhvan-tv.github.io/business-english-academy/`
Lần đầu: vào **Settings → Pages → Source** chọn **GitHub Actions**.

## Nhập từ từ tài liệu

Vào tab **Nhập từ** → chọn file.

| Loại file | Cách xử lý |
|---|---|
| PDF, Word (.docx), TXT | Đọc chữ, bỏ từ phổ biến/viết tắt/tên riêng, xếp theo tần suất, lấy câu ví dụ ngay trong tài liệu |
| Excel (.xlsx), CSV dạng danh sách từ (cột 1 từ Anh, cột 2 nghĩa, tùy chọn: phiên âm, từ loại, ví dụ) | Nhập thẳng, không cần tra |
| Excel/CSV dạng số liệu | Lấy chữ trong bảng như văn bản thường |
| PDF scan (ảnh), .doc/.xls cũ | Chưa hỗ trợ. Lưu lại thành .docx/.xlsx hoặc PDF có chữ |

Lưu ý:
- File được đọc ngay trên máy, không tải lên máy chủ.
- Nếu bật "Tự tra", từng **từ hoặc cụm từ** (không phải cả tài liệu) được gửi tới dictionaryapi.dev (phiên âm, từ loại) và MyMemory (nghĩa tiếng Việt). Tắt tùy chọn này với tài liệu bảo mật.
- Cụm từ được trích khi lặp lại ít nhất 2 lần (2–3 từ liền nhau, không chứa từ phổ biến như *of*, *and*). Cụm có giới từ như "segregation of duties" chưa được trích.
- Thuật ngữ kế toán/tài chính phổ biến (khoảng 60 mục) lấy nghĩa từ bảng tự soạn `src/data/glossary.ts`, chính xác hơn dịch tự động. Bạn có thể thêm dòng mới vào file này.
- Nghĩa tự tra là **gợi ý**, hay sai với thuật ngữ kế toán/tài chính (ví dụ "variance" có thể ra nghĩa thống kê). Luôn đọc lại và sửa trước khi lưu.
- MyMemory giới hạn khoảng 5.000 ký tự/ngày cho mỗi người dùng ẩn danh.
- Tên riêng đứng đầu câu có thể lọt vào danh sách. Bỏ chọn ở ô vuông.

## Đồng bộ nhiều thiết bị (Supabase, miễn phí)

Mặc định tiến độ chỉ lưu trong trình duyệt. Làm 5 bước dưới đây **một lần** để học trên máy tính và điện thoại cùng một tiến độ.

**1. Tạo dự án.** Vào [supabase.com](https://supabase.com) → đăng ký → **New project** (gói Free). Đặt tên bất kỳ, chọn vùng gần Việt Nam (Singapore), tự đặt mật khẩu database và cất lại.

**2. Tạo bảng.** Trong dự án: **SQL Editor** → **New query** → dán toàn bộ nội dung file `supabase/schema.sql` → **Run**. Kết quả: "Success".

**3. Tắt xác nhận email** (để đăng ký không phụ thuộc email; gói Free giới hạn rất ít email mỗi giờ): **Authentication → Sign In / Providers → Email** → tắt **Confirm email** → Save.

**4. Lấy 2 giá trị:** **Project Settings → API** (hoặc **Data API**):
- **Project URL** (dạng `https://xxxx.supabase.co`)
- Khóa **anon / public** (chuỗi dài). Khóa này được thiết kế để công khai, dữ liệu được bảo vệ bằng quy tắc RLS trong `schema.sql`.
- **Không bao giờ** dùng khóa `service_role` ở đây.

**5. Dán vào GitHub:** repo → **Settings → Secrets and variables → Actions → tab Variables → New repository variable**. Tạo 2 biến (đúng tên, đúng chữ hoa):

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | Project URL |
| `VITE_SUPABASE_ANON_KEY` | khóa anon |

Sau đó vào tab **Actions** → "Deploy to GitHub Pages" → **Run workflow** để dựng lại trang (1–2 phút).

**Dùng:** mở ứng dụng → tab **Lịch sử** → mục **Đồng bộ giữa các thiết bị** → **Tạo tài khoản mới** (lần đầu), rồi **Đăng nhập** bằng cùng email trên thiết bị còn lại.

Cách hoạt động:
- Học bình thường, kể cả khi mất mạng. Tiến độ lưu ngay trên máy và đồng bộ khi có mạng.
- Tự đồng bộ 2–3 giây sau mỗi thay đổi, và khi bạn quay lại ứng dụng.
- Hai thiết bị cùng học vẫn **không mất dữ liệu**: ứng dụng gộp (mỗi từ lấy lần ôn mới nhất, buổi học và bài hoàn thành lấy hợp của hai bên).
- Dữ liệu mỗi người một dòng, chỉ chủ tài khoản đọc/ghi được (RLS).

Lưu ý:
- Dữ liệu đồng bộ gồm tiến độ, bài viết luyện tập và **từ vựng bạn nhập từ tài liệu, kể cả câu ví dụ trích từ tài liệu đó**. Đừng nhập tài liệu bảo mật nếu bật đồng bộ.
- Dự án Supabase gói Free tự **tạm dừng nếu không có hoạt động khoảng 7 ngày**. Dữ liệu không mất; vào dashboard Supabase bấm khôi phục. Hãy tải **file sao lưu** (tab Lịch sử) định kỳ.
- Tài khoản dùng mật khẩu, chưa có "quên mật khẩu" trong ứng dụng. Đặt lại tại Supabase → Authentication → Users.

## Dữ liệu và quyền riêng tư

Nếu chưa bật đồng bộ, tiến độ chỉ lưu trong `localStorage` của trình duyệt: xóa dữ liệu trình duyệt hoặc đổi thiết bị sẽ mất. Có thể sao lưu bằng file (tab Lịch sử).

## Thêm bài học

Xem `PROJECT.md`, mục "Cách thêm một bài học".

## Bản quyền nội dung

Toàn bộ nội dung do dự án tự soạn. Không sao chép từ Forum Flash Study hay nguồn có bản quyền khác.
