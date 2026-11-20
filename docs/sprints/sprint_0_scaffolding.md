# HỒ SƠ ĐIỀU PHỐI: SPRINT 0 — KHỞI TẠO NỀN TẢNG KỸ THUẬT & DESIGN TOKENS
**Giai đoạn:** Giai đoạn 0 (Sprint 0)  
**Thời lượng dự kiến:** 1 – 2 ngày  
**Mục tiêu Sprint:** Khởi tạo khung dự án Vite + React 18 + TypeScript 5 + TailwindCSS 3, cấu hình Vitest và tích hợp 100% token của ngôn ngữ thiết kế Al Jazeera Editorial Hard-News Console.

---

## 1. Danh Mục Tài Liệu Bắt Buộc Đọc (Reading Dossier)
Lập trình viên / AI Agent bắt buộc phải đọc các tài liệu sau trước khi viết code:
1. [.AGENTS/DESIGN.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/.AGENTS/DESIGN.md): Toàn bộ bảng màu `#fa9000`, `#c31833`, `#100e2f`, font Roboto, pill button bo góc 18px và triết lý Zero Elevation.
2. [specs/SOFTWARE_DESIGN_DOCUMENT.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/SOFTWARE_DESIGN_DOCUMENT.md):
   - Mục 1.1: Phong cách kiến trúc phân tầng đơn hướng.
   - Mục 1.3: Biện giải kỹ thuật ADR (Vite 5, TypeScript 5, React 18, Tailwind 3, Vitest).
   - Mục 2: Cấu trúc thư mục mã nguồn `src/`.
3. [specs/UI_UX_Wireframe_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/UI_UX_Wireframe_Spec.md):
   - Mục 1: Bảng ánh xạ Design Tokens.
   - Mục 5: Đặc tả CSS In ấn Khổ Giấy A4 (`@media print`).

---

## 2. Danh Sách Nhiệm Vụ (Sprint Backlog) — `COMPLETED`
* [x] `TASK-P0-01`: Khởi tạo Scaffolding, tích hợp Design Tokens & cấu hình test runner ([task/Log/20261120_TASK-P0-01_scaffolding-design-tokens.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/task/Log/20261120_TASK-P0-01_scaffolding-design-tokens.md)) — Commit: `e4f3ed1`

---

## 3. Cổng Nghiệm Thu Chất Lượng (Sprint 0 DoD Gate)
```bash
# 1. Kiểm tra tĩnh kiểu dữ liệu
npm run type-check

# 2. Kiểm tra test harness
npm test

# 3. Đóng gói production bundle
npm run build
```
- **Tiêu chí:** 0 lỗi TypeScript, build bundle sinh ra `dist/` thành công, Vitest chạy thông suốt.

