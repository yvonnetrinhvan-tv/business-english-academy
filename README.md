# Business & Professional English Academy

Ứng dụng web (PWA) học tiếng Anh văn phòng và tài chính. Bản demo đầu tiên, lưu tiến độ trên trình duyệt.

## Chức năng

- Tổng quan: tiến độ, thời gian học hôm nay, chuỗi ngày, bài học hôm nay.
- 2 chương trình, 30 bài (15 Office English, 15 Professional Finance English). 2 bài đã đủ nội dung: *Professional Email Writing*, *Budget Variance Analysis*.
- Flashcards: từ vựng, phiên âm, từ loại, nghĩa, ví dụ, phát âm (giọng đọc của trình duyệt).
- Bài tập: trắc nghiệm, điền từ, sắp xếp câu, luyện viết (chấm theo quy tắc, không dùng AI).
- Lịch ôn tự động (thuật toán SM-2 rút gọn): Quên / Khó / Nhớ / Dễ.
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
- Nếu bật "Tự tra", từng **từ đơn lẻ** được gửi tới dictionaryapi.dev (phiên âm, từ loại) và MyMemory (nghĩa tiếng Việt). Tắt tùy chọn này với tài liệu bảo mật.
- Nghĩa tự tra là **gợi ý**, hay sai với thuật ngữ kế toán/tài chính (ví dụ "variance" có thể ra nghĩa thống kê). Luôn đọc lại và sửa trước khi lưu.
- MyMemory giới hạn khoảng 5.000 ký tự/ngày cho mỗi người dùng ẩn danh.
- Tên riêng đứng đầu câu có thể lọt vào danh sách. Bỏ chọn ở ô vuông.

## Dữ liệu và quyền riêng tư

Tiến độ lưu trong `localStorage` của trình duyệt. Xóa dữ liệu trình duyệt hoặc đổi thiết bị sẽ mất tiến độ. Chưa có đăng nhập, chưa có đồng bộ.

## Thêm bài học

Xem `PROJECT.md`, mục "Cách thêm một bài học".

## Bản quyền nội dung

Toàn bộ nội dung do dự án tự soạn. Không sao chép từ Forum Flash Study hay nguồn có bản quyền khác.
