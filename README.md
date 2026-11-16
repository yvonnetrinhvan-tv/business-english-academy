# Business & Professional English Academy

Ứng dụng web (PWA) học tiếng Anh văn phòng và tài chính. Bản demo đầu tiên, lưu tiến độ trên trình duyệt.

## Chức năng

- Tổng quan: tiến độ, thời gian học hôm nay, chuỗi ngày, bài học hôm nay.
- 2 chương trình, 30 bài (15 Office English, 15 Professional Finance English). 2 bài đã đủ nội dung: *Professional Email Writing*, *Budget Variance Analysis*.
- Flashcards: từ vựng, phiên âm, từ loại, nghĩa, ví dụ, phát âm (giọng đọc của trình duyệt).
- Bài tập: trắc nghiệm, điền từ, sắp xếp câu, luyện viết (chấm theo quy tắc, không dùng AI).
- Lịch ôn tự động (thuật toán SM-2 rút gọn): Quên / Khó / Nhớ / Dễ.
- Lịch sử, điểm số, thời lượng thực tế (chỉ tính khi tab đang mở).
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
PWA cần địa chỉ HTTPS. Có thể triển khai miễn phí bằng GitHub Pages, Cloudflare Pages hoặc Netlify (thư mục `dist/`).

## Dữ liệu và quyền riêng tư

Tiến độ lưu trong `localStorage` của trình duyệt. Xóa dữ liệu trình duyệt hoặc đổi thiết bị sẽ mất tiến độ. Chưa có đăng nhập, chưa có đồng bộ.

## Thêm bài học

Xem `PROJECT.md`, mục "Cách thêm một bài học".

## Bản quyền nội dung

Toàn bộ nội dung do dự án tự soạn. Không sao chép từ Forum Flash Study hay nguồn có bản quyền khác.
