# Zeebee Portal

Cổng đăng nhập nội bộ dùng chung cho toàn bộ nhân viên hệ sinh thái Zeebee
(Bán hàng, Marketing, Tài chính, Sản xuất, Vận hành, Nhân sự, CEO).

Domain chính thức: `https://zeebee.vn` / `https://www.zeebee.vn`
(trước đây 2 domain này phục vụ cửa hàng Decor — đã chuyển hẳn sang
`decor.zeebee.vn`, xem `ZOS/orders/zeebee-vn-portal.md`).

## Mô hình nghiệp vụ

- Nhân viên tự đăng ký tài khoản (`/register`), chọn 1 trong 7 vai trò.
- Đăng nhập (`/login`) → vào `/dashboard`, thấy khu vực của vai trò mình +
  danh sách các khu vực khác (placeholder "Sắp ra mắt").
- VÒNG 1 (SETUP) chỉ dựng hạ tầng xác thực + khung điều hướng theo vai trò.
  Nội dung nghiệp vụ thật của từng vai trò (báo cáo tài chính, CRM bán hàng,
  v.v.) sẽ bổ sung ở các vòng NÂNG CẤP sau, khi có yêu cầu cụ thể.
- Việc xác minh "ai thực sự thuộc vai trò nào" (ví dụ chặn nhân viên tự
  chọn role CEO) chưa có ở vòng này — để CEO quyết định quy trình duyệt ở
  vòng NÂNG CẤP kế tiếp.

## Tech stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Xác thực: JWT (thư viện `jose`) lưu trong cookie `httpOnly`, mật khẩu hash
  bằng `bcryptjs`
- Lưu trữ: SQLite qua `node:sqlite` (built-in Node 22+, không cần build
  native) — file `data/portal.db`, mount qua Docker named volume
  `zeebee-portal-data` (theo đúng mẫu đã dùng ở `zqr`)

## Cấu trúc thư mục

```
src/
  app/
    login/           trang đăng nhập
    register/        trang đăng ký
    dashboard/        khu vực sau đăng nhập, theo vai trò
    api/auth/         API login · register · logout
  components/         AuthForm, LogoutButton (client components)
  lib/
    roles.ts          danh sách 7 vai trò + nhãn hiển thị tiếng Việt
    db.ts             SQLite (bảng users)
    auth.ts           hash mật khẩu, tạo/đọc JWT, cookie session
  middleware.ts        bảo vệ route /dashboard
```

## Lệnh dev / deploy

```bash
npm install
npm run dev        # http://localhost:8129

# Build & chạy qua Docker
docker compose up -d --build
```

Biến môi trường (xem `.env.example`):
- `ZPORTAL_JWT_SECRET` — **bắt buộc đặt giá trị random ở production**
  (`openssl rand -base64 48`), nếu không sẽ dùng secret mặc định không an
  toàn chỉ phù hợp cho dev.
- `ZPORTAL_DB_PATH` — đường dẫn file SQLite (mặc định `./data/portal.db`).

## Quy ước backup

- Codebase → GitHub (`hoanglamtruong/zeebee-portal`, remote chính thức duy
  nhất).
- Không có asset nặng (ảnh/video) ở vòng này nên chưa cần folder Drive
  riêng — sẽ tạo khi vòng sau phát sinh asset.

## Việc còn tồn đọng (tính đến VÒNG 1)

- Chưa có quy trình xác minh/duyệt vai trò khi đăng ký (ai cũng tự chọn
  được role bất kỳ kể cả CEO) — cần CEO quyết định ở vòng NÂNG CẤP.
- Chưa có trang quản trị danh sách nhân viên.
- Nội dung nghiệp vụ thật theo từng vai trò chưa được xây — hiện là
  placeholder "Sắp ra mắt".

## Report-log

Xem `docs/reports/BAOCAO-VONG.md` — nhật ký từng VÒNG build (append, không
ghi đè).
