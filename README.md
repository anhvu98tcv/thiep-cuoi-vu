# 💍 Thiệp cưới online

Trang web thiệp mời cưới tĩnh (HTML/CSS/JS thuần), đẹp, chạy mượt trên điện thoại,
dễ chia sẻ qua Zalo/Facebook. Không cần cài đặt gì phức tạp.

## 📁 Cấu trúc

```
thiep-cuoi/
├── index.html      → Nội dung trang (tên, lời mời, sự kiện...)
├── css/style.css   → Giao diện, màu sắc, bố cục
├── js/main.js      → Đếm ngược, hiệu ứng, form xác nhận
├── google-apps-script/Code.gs → Script lưu xác nhận vào Google Sheet
└── assets/         → Nơi để ảnh, nhạc nền, mã QR
```

## ✏️ Cách tùy chỉnh thông tin của bạn

### 1. Tên, ngày, địa điểm, lời mời
Mở `index.html`, tìm các dòng có dấu **`👇`** (dùng Ctrl+F gõ `👇`) — đó là những chỗ cần sửa:
- Tên cô dâu & chú rể
- Tên bố mẹ hai bên
- Ngày giờ, địa điểm các sự kiện (Lễ Vu Quy, Tiệc cưới...)
- Link Google Maps (mở Google Maps → tìm địa chỉ → *Chia sẻ* → sao chép link)
- Thông tin ngân hàng mừng cưới

### 2. Ngày cưới cho đồng hồ đếm ngược
Mở `js/main.js`, sửa dòng:
```js
weddingDate: "2026-12-20T18:00:00",   // Năm-Tháng-NgàyTGiờ:Phút:Giây
```

### 3. Thêm ảnh
Chép ảnh vào thư mục `assets/` (ví dụ `anh-cuoi-1.jpg`), rồi trong `index.html`:
- **Album:** thay `<div class="gallery-item" data-label="Ảnh 1"></div>`
  bằng `<div class="gallery-item"><img src="assets/anh-cuoi-1.jpg" alt="" /></div>`
- **Ảnh cô dâu/chú rể:** thay `<div class="person-photo" data-label="Ảnh cô dâu"></div>`
  bằng `<div class="person-photo"><img src="assets/co-dau.jpg" alt="" /></div>`
- **Mã QR:** thay `<div class="gift-qr" data-label="QR chuyển khoản"></div>`
  bằng `<div class="gift-qr"><img src="assets/qr-chu-re.png" alt="" /></div>`

### 4. Nhạc nền (tuỳ chọn)
Chép một file nhạc vào `assets/music.mp3`. Khách bấm nút ♪ góc dưới phải để nghe.

### 5. Màu sắc
Mở `css/style.css`, phần `:root` ở đầu file có thể đổi toàn bộ tông màu.

## 📥 Lưu xác nhận vào Google Sheet

Mặc định form chỉ hiện lời cảm ơn. Để mỗi lần khách bấm **Gửi xác nhận** là có thêm một dòng trong Google Sheet:

1. Tạo một Google Sheet mới (ví dụ tên *Khách mời đám cưới*).
2. Trong Sheet: **Tiện ích mở rộng → Apps Script**.
3. Xoá hết code mẫu, dán toàn bộ nội dung file `google-apps-script/Code.gs`, bấm **Lưu** 💾.
4. Bấm **Triển khai → Tùy chọn triển khai mới** → biểu tượng ⚙️ chọn **Ứng dụng web**:
   - *Thực thi với tư cách:* **Tôi**
   - *Người có quyền truy cập:* **Bất kỳ ai**
   - Bấm **Triển khai** → **Cấp quyền truy cập** → chọn tài khoản Google
     (nếu hiện "Google chưa xác minh ứng dụng này": **Nâng cao → Đi tới ... (không an toàn)** → **Cho phép**; đây là script của chính bạn).
5. Copy **URL ứng dụng web** (dạng `https://script.google.com/macros/s/.../exec`).
6. Mở `js/main.js`, dán vào:
   ```js
   rsvpEndpoint: "https://script.google.com/macros/s/.../exec",
   ```
7. Mở thiệp, gửi thử một xác nhận → trong Sheet sẽ xuất hiện trang tính **RSVP** với các cột
   *Thời gian, Họ và tên, Số điện thoại, Tham dự, Số người, Lời chúc*.

> Nếu sau này sửa code trong Apps Script, phải vào **Triển khai → Quản lý các bản triển khai → ✏️ → Phiên bản: Mới → Triển khai** thì thay đổi mới có hiệu lực (URL giữ nguyên).

## 👀 Xem thử trên máy
Nhấp đúp `index.html` để mở bằng trình duyệt. (Nếu cần máy chủ cục bộ:
`python -m http.server` rồi mở `http://localhost:8000`.)

## 🚀 Đưa lên mạng (miễn phí) để gửi link cho bạn bè

**Cách dễ nhất — Netlify Drop:**
1. Vào [app.netlify.com/drop](https://app.netlify.com/drop)
2. Kéo cả thư mục `thiep-cuoi` thả vào trang → có ngay một link để chia sẻ.

**Hoặc GitHub Pages:**
1. Đẩy thư mục này lên một repository GitHub.
2. *Settings → Pages →* chọn nhánh `main`, thư mục `/root` → *Save*.
3. Vài phút sau web có tại `https://<tên-bạn>.github.io/<tên-repo>/`.

**Hoặc Vercel:** [vercel.com](https://vercel.com) → *Add New Project* → import repo → Deploy.

---
Chúc hai bạn trăm năm hạnh phúc! 💗
