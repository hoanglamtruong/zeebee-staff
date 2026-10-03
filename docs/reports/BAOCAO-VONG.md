# Báo cáo các VÒNG build — Zeebee Portal

> Append theo vòng, không ghi đè. Xem `eng.cook.app` / `ZOS/orders/zeebee-vn-portal.md`.

## VÒNG 1 · SETUP · 03/10/2026

- Yêu cầu: Dựng cổng đăng nhập nội bộ dùng chung 7 vai trò (Bán hàng,
  Marketing, Tài chính, Sản xuất, Vận hành, Nhân sự, CEO) thay thế vai trò
  domain gốc `zeebee.vn`/`www.zeebee.vn` (trước đây phục vụ cửa hàng Decor).
- Kết quả: **PASS Tầng 1** (máy CODE — HP EliteBook, Docker container
  `zeebee-portal-app`, port 8129, qua Tailscale `http://100.82.135.18:8129`).
  Đang chờ Human merge PR + lệnh `/xuatban` cho Tầng 2.
- Khảo sát hạ tầng trước khi build:
  - Order gốc `ZOS/orders/zeebee-vn-portal.md` brief trỏ tới CHƯA tồn tại →
    tạo bổ sung theo rule [15] trước khi vào build.
  - Port đề xuất gốc 8124 KHÔNG trống trên host dell (OptiPlex) — đang giữ
    cho `socat-8124` (forward Bấm Huyệt Gia Truyền từ HP) → quét toàn bộ
    port đang dùng trên cả HP và OptiPlex, chọn **8129** (trống thật trên cả
    2 máy).
  - Xác minh qua `curl` + đọc `~/.cloudflared/config.yml` trên OptiPlex:
    `zeebee.vn`, `www.zeebee.vn`, `decor.zeebee.vn`, `quangcao.zeebee.vn`
    hiện đều trỏ `localhost:8111` (container `quangcao-app` = Decor shop).
    `decor.zeebee.vn` có dòng ingress RIÊNG (hostname độc lập) → đổi ingress
    của `zeebee.vn`/`www.zeebee.vn` sang portal mới ở Tầng 2 KHÔNG ảnh hưởng
    truy cập Decor qua `decor.zeebee.vn` (vẫn cùng container, vẫn sống).
- Kiến trúc (Agent Coder tự quyết theo rule [7]):
  - Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4.
  - Xác thực: JWT (`jose`, HS256) trong cookie `httpOnly`, mật khẩu hash
    bằng `bcryptjs`. Lưu trữ: SQLite qua `node:sqlite` built-in (không cần
    build native trên Alpine) — cùng mẫu đã dùng ở `zqr`.
  - 7 vai trò là enum cố định trong `src/lib/roles.ts`. Đăng ký tự chọn vai
    trò (CHƯA có bước duyệt/xác minh — ghi rõ trong README mục "Việc còn
    tồn đọng", để CEO quyết định ở vòng NÂNG CẤP kế tiếp, đúng rule [7] —
    đây là quyết định business, không phải kiến trúc kỹ thuật).
  - `/dashboard` sau đăng nhập: hiện đúng vai trò người dùng + khung điều
    hướng liệt kê cả 7 khu vực (6 khu vực khác hiện "Sắp ra mắt" — nội dung
    nghiệp vụ thật để dành cho vòng NÂNG CẤP).
- Test Tầng 1 (trên container Docker, không phải dev server):
  - Đăng ký → cookie session → `/dashboard` hiện đúng tên + vai trò (PASS)
  - Truy cập `/dashboard` không có cookie → redirect `/login` (307, PASS)
  - Đăng ký trùng email → 409 (PASS)
  - Đăng nhập sai mật khẩu → 401 (PASS)
  - Đăng nhập đúng → 200 + cookie mới (PASS)
  - Restart container → dữ liệu còn nguyên (named volume `zeebee-portal-data`
    hoạt động đúng, PASS)
  - Xác nhận trực quan qua Browser pane (screenshot): trang login, dashboard
    sau đăng nhập, logout — đúng brand Zeebee (Deep Navy/Cyber Gold).
- CLEAN: ✅ — không dead code, không service mồ côi. Đã xoá `node_modules`,
  `.next` khỏi host sau khi build xong (chỉ còn trong Docker image). Dữ liệu
  test (`ceo.test@zeebee.vn`, `test.sales@zeebee.vn`) đã xoá sạch bằng
  `docker compose down -v` trước khi bàn giao Human test — portal ở trạng
  thái sạch, chưa có user nào.
- README: ✅ đã viết tối ưu theo đúng dự án (mô hình nghiệp vụ, tech stack,
  cấu trúc thư mục, lệnh dev/deploy, quy ước backup, việc còn tồn đọng).
- Backup: ⏳ GitHub — repo `hoanglamtruong/zeebee-portal` sẽ tạo + push khi
  mở PR (sau khi Human xác nhận qua Tailscale). Chưa có asset nặng nên chưa
  cần folder Drive riêng ở vòng này.
- Quyết định override (rule [9]): không có — chưa Stop Rule nào lặp lại.
- Việc còn tồn đọng: xem README mục "Việc còn tồn đọng".
