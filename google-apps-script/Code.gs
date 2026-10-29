/**
 * ════════════════════════════════════════════════════════════════
 *  THIỆP CƯỚI NHÀ TRAI — Anh Vũ & Hồng Ngọc
 *  Lưu xác nhận tham dự (RSVP) từ thiệp vào Google Sheet
 * ════════════════════════════════════════════════════════════════
 *  Cách dùng (chi tiết ở README.md, mục "Lưu xác nhận vào Google Sheet"):
 *   1. Tạo Google Sheet mới → Tiện ích mở rộng → Apps Script
 *   2. Xoá code mẫu, dán toàn bộ file này vào, bấm Lưu
 *   3. Triển khai → Tùy chọn triển khai mới → Ứng dụng web
 *      - Thực thi với tư cách: Tôi
 *      - Người có quyền truy cập: Bất kỳ ai
 *   4. Copy URL kết thúc bằng /exec, dán vào js/main.js → CONFIG.rsvpEndpoint
 */

const SHEET_NAME = "RSVP";

// Thứ tự cột trong Sheet. "key" phải trùng với thuộc tính name="..." của ô trong form.
const COLUMNS = [
  { key: "_time",     title: "Thời gian" },
  { key: "name",      title: "Họ và tên" },
  { key: "phone",     title: "Số điện thoại" },
  { key: "attending", title: "Tham dự" },
  { key: "guests",    title: "Số người" },
  { key: "transport", title: "Xe đưa đón" },
  { key: "message",   title: "Lời chúc" },
];

/** Nhận dữ liệu form gửi lên và thêm một dòng mới */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // tránh 2 khách gửi cùng lúc bị ghi đè dòng
  try {
    const p = (e && e.parameter) || {};
    const sheet = getSheet_();
    const row = COLUMNS.map((c) =>
      c.key === "_time" ? new Date() : clean_(p[c.key])
    );
    sheet.appendRow(row);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Mở URL /exec trên trình duyệt để kiểm tra script đang chạy */
function doGet() {
  return json_({ ok: true, message: "RSVP nhà trai đang hoạt động 💚" });
}

/** Lấy trang tính RSVP, tự tạo và định dạng tiêu đề nếu chưa có */
function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    const header = sheet.getRange(1, 1, 1, COLUMNS.length);
    header
      .setValues([COLUMNS.map((c) => c.title)])
      .setFontWeight("bold")
      .setFontColor("#ffffff")
      .setBackground("#5b8f53")
      .setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    sheet.getRange("A:A").setNumberFormat("dd/MM/yyyy HH:mm");
    sheet.getRange("C:C").setNumberFormat("@"); // giữ số 0 đầu số điện thoại
    sheet.setColumnWidths(1, COLUMNS.length, 150);
    sheet.setColumnWidth(COLUMNS.length, 320); // cột lời chúc rộng hơn
  }
  return sheet;
}

/** Cắt khoảng trắng, giới hạn độ dài, chặn công thức (=, +, -, @) bị Sheet tự chạy */
function clean_(v) {
  let s = String(v == null ? "" : v).trim().slice(0, 1000);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
