# Lumen — luyện nghe & nói tiếng Anh

Nền tảng học tiếng Anh: nghe chép (dictation), shadowing, từ vựng/SRS, luyện thi.
Dự án cá nhân, lấy cảm hứng từ cách tổ chức của các app dictation/shadowing; toàn bộ
mã nguồn, thương hiệu và nội dung bài học là tự viết.

## Chạy dự án

```bash
npm install
cp .env.example .env.local   # mặc định DATA_SOURCE=mock, không cần Supabase
npm run dev                  # http://localhost:3000
```

| Lệnh | Việc |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` / `npm start` | Build & chạy production |
| `npm test` | Unit test (Vitest) cho logic domain |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (gồm rule React Compiler) |

## Kiến trúc

```
UI (features/*/components)
  → hooks React Query (features/*/hooks.ts)
  → /api/* route handlers (app/api)
  → Repository interface (lib/data/repositories.ts)
       ├─ mock  (lib/data/mock — seed data, đang dùng)
       └─ supabase (bước 7 — cùng interface, không đổi frontend)
```

- **Logic nghiệp vụ thuần** ở `src/lib/domain/` (streak, truy vấn bài học, tổng hợp
  dashboard) — có test, dùng chung cho mọi repository.
- **Tiến độ không bao giờ hardcode**: mọi số liệu dashboard được tính từ `study_sessions`.
  Ở chế độ mock, các session được sinh tất định (deterministic) từ seed.
- **Bộ lọc thư viện nằm trên URL** (`/topics?level=B1&topic=science`) — chia sẻ được,
  giữ nguyên khi reload, tham số sai bị bỏ qua thay vì làm lỗi trang.
- **Next.js 16 + Cache Components**: trang là khung tĩnh, dữ liệu người dùng lấy qua API
  lúc request. Đọc `node_modules/next/dist/docs/` trước khi dùng API mới của Next.
- **Bí mật chỉ ở server**: đọc qua `src/lib/env.ts` (có `server-only`), không dùng
  `NEXT_PUBLIC_` cho key nhạy cảm.

```
src/
├─ app/(app)/…        route có sidebar: dashboard, topics, và các module "sắp có"
├─ app/api/…          dashboard, lessons, lessons/facets, me
├─ components/ui      shadcn/ui (Radix)
├─ components/layout  AppShell, sidebar, header, mobile nav, page header
├─ components/shared  logo, level badge, topic icon, empty/error state
├─ features/          dashboard, lessons (mỗi module: components + hooks)
├─ lib/domain         logic thuần + test
├─ lib/data           repository interface + mock
└─ config/            tên app (site.ts), menu (nav.ts)
supabase/migrations   schema + RLS (áp dụng ở bước 7)
```

## Design system

Token màu nằm trong `src/app/globals.css` (sáng/tối). Màu nền giấy ấm, chữ màu mực,
một màu thương hiệu teal; hổ phách cho streak; thang CEFR một sắc độ (A1 nhạt → C2 đậm).
Màu biểu đồ `chart-1`/`chart-2` đã kiểm tra tương phản & mù màu cho cả hai theme.
Font: Be Vietnam Pro.

## Lộ trình

1–6 ✅ Khung dự án, design system, layout, lớp dữ liệu, dashboard, thư viện bài học
7. Nối Supabase: migration, RLS, Auth, `SupabaseRepository`, `proxy.ts` bảo vệ route
8. Dictation: player theo câu, chấm từng từ, lưu attempts
9+. Shadowing (ghi âm + chấm phát âm), Từ vựng/SRS, Luyện thi, Cộng đồng
