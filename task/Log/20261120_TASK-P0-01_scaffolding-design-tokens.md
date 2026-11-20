# [TASK-P0-01]: KHỞI TẠO NỀN TẢNG KỸ THUẬT & TÍCH HỢP DESIGN TOKENS (SPRINT 0)

**Mã Task:** `TASK-P0-01`  
**Giai đoạn:** Giai đoạn 0 (Sprint 0: Scaffolding & Design System Foundation)  
**Người thực hiện:** AI Assistant / Antigravity  
**Slash Command / Action Khuyến nghị:** `/goal` (Chạy tự động trọn gói từ setup dependencies, cấu hình Tailwind/CSS đến khi lệnh build & test pass 100%)  
**Trạng thái:** `DRAFT` (Sẵn sàng thực thi)  
**Ngày bắt đầu:** 2026-11-20  
**Ngày hoàn thành:** Chưa hoàn thành  

---

## 1. Mục Tiêu, Phạm Vi & Antigravity IDE Action

### 1.1. Mục tiêu cốt lõi
Khởi tạo toàn bộ cấu trúc dự án Frontend với Vite 5, React 18, TypeScript 5, TailwindCSS 3; cấu hình test runner Vitest + Testing Library; tích hợp đầy đủ 100% Design Tokens từ `.AGENTS/DESIGN.md` và CSS in ấn khổ A4 phục vụ các giai đoạn tiếp theo.

### 1.2. Ranh giới phạm vi (Scope Boundary)
* **TRONG PHẠM VI (In-Scope):**
  - [ ] Khởi tạo `package.json`, `tsconfig.json`, `vite.config.ts`, `postcss.config.js`.
  - [ ] Cài đặt các thư viện lõi: `react`, `react-dom`, `lucide-react`, `canvas-confetti`.
  - [ ] Cài đặt môi trường test: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@vitest/coverage-v8`.
  - [ ] Cấu hình `tailwind.config.js` ánh xạ màu sắc `#fa9000`, `#c31833`, `#100e2f`, `#d8d8d8`, font Roboto, pill button bo góc 18px.
  - [ ] Viết `src/index.css` với tiện ích design tokens và `@media print` cho khổ A4.
  - [ ] Tạo file thiết lập kiểm thử `tests/setup.ts` và khung component `App.tsx` tối giản.
* **NGOÀI PHẠM VI (Out-of-Scope):**
  - Không viết logic tính điểm (`ScoringEngine.ts` thuộc Giai đoạn 1).
  - Không viết component UI tác vụ hay wireframe chi tiết (thuộc Giai đoạn 2 và 3).

### 1.3. Khuyến nghị Kích hoạt Slash Command / Action
* **Lệnh đề xuất:** `/goal`
* **Lý do:** Khởi tạo môi trường kỹ thuật đòi hỏi chuỗi lệnh cài đặt package, biên dịch CSS, cấu hình Vitest và đóng gói bundle. Lệnh `/goal` giúp agent tự động lặp kiểm thử, xử lý ngay mọi xung đột package hoặc lỗi cú pháp cho đến khi vượt qua toàn bộ 5 tiêu chuẩn chấp nhận `AC-01` $\rightarrow$ `AC-05`.

---

## 2. Tài Liệu & Dữ Liệu Đầu Vào (Inputs & Prerequisites)

### 2.1. Tài liệu đặc tả bắt buộc đọc
| STT | Tài liệu cần đọc | Chương / Mục cụ thể | Yêu cầu / Tri thức cốt lõi cần trích xuất |
| :---: | :--- | :--- | :--- |
| 1 | [.AGENTS/DESIGN.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/.AGENTS/DESIGN.md) | Toàn bộ tài liệu | Bảng màu (#fa9000, #c31833, #100e2f), font Roboto, pill button (rounded-lg 18px, active:scale-[0.98]), Zero drop-shadow. |
| 2 | [specs/SOFTWARE_DESIGN_DOCUMENT.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/SOFTWARE_DESIGN_DOCUMENT.md) | Mục 1 & Mục 2 | Danh sách công nghệ (React, Vite, TS, Tailwind) và cây cấu trúc thư mục source. |
| 3 | [specs/UI_UX_Wireframe_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/UI_UX_Wireframe_Spec.md) | Mục 1 & Mục 5 | Bảng token tham chiếu và CSS in ấn khổ giấy A4 (`@page { size: A4 portrait; margin: 10mm; }`). |
| 4 | [specs/PHASED_IMPLEMENTATION_PLAN.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/PHASED_IMPLEMENTATION_PLAN.md) | Giai đoạn 0 | Tiêu chuẩn chất lượng Quality Gate 0. |

### 2.2. Tiền điều kiện & Trạng thái đầu vào
- Mã nguồn: Branch `main`, commit hash `c3e13a1`.
- Môi trường: Node.js `v22.22.2`, npm `10.9.7` trên macOS.

---

## 3. Phân Rã Công Việc & Kiểm Định Từng Bước (Work Breakdown & Incremental Verification)

### Bước 1: Khởi tạo Package, Typescript & Build Configuration
- [ ] **Hành động cụ thể:** Tạo `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `postcss.config.js`.
- [ ] **Kiểm định ngay tại chỗ:** Chạy `npm install` thành công, không xung đột dependency.

### Bước 2: Tích hợp Design Tokens vào Tailwind & CSS
- [ ] **Hành động cụ thể:**
  - Viết `tailwind.config.js` mở rộng `colors` (accent, live-red, night-navy, hairline) và `borderRadius` (pill: 18px).
  - Tải Google Fonts `Roboto` trong `index.html`.
  - Viết `src/index.css` với các tiện ích `.btn-pill-dark`, `.btn-pill-outline`, `.eyebrow-marker`, `.badge-live-red` và `@media print`.
- [ ] **Kiểm định ngay tại chỗ:** Chạy `npx tailwindcss -i ./src/index.css -o /tmp/test-tailwind.css --minify` không báo lỗi class syntax.

### Bước 3: Cấu hình Test Runner & Setup File
- [ ] **Hành động cụ thể:** Tạo `tests/setup.ts` với `@testing-library/jest-dom`, cấu hình Vitest trong `vite.config.ts`.
- [ ] **Kiểm định ngay tại chỗ:** Viết test sanity check và chạy `npm test`.

### Bước 4: Kiểm tra Khung App và Đóng Gói Bundle
- [ ] **Hành động cụ thể:** Tạo `src/App.tsx`, `src/main.tsx` đơn giản hiển thị App title với styling Hard-News.
- [ ] **Kiểm định ngay tại chỗ:** Chạy `npm run type-check && npm run build`.

---

## 4. Sản Phẩm Bàn Giao Đầu Ra (Outputs & Deliverables)

* [ ] `package.json`, `package-lock.json`
* [ ] `tsconfig.json`, `tsconfig.node.json`
* [ ] `vite.config.ts` (kèm cấu hình coverage exclude)
* [ ] `tailwind.config.js`, `postcss.config.js`
* [ ] `index.html` (chứa Google Font Roboto)
* [ ] `src/index.css` (chứa design tokens + print CSS)
* [ ] `tests/setup.ts` (test harness)
* [ ] `src/App.tsx`, `src/main.tsx`

---

## 5. Tiêu Chuẩn Chấp Nhận Định Lượng (Acceptance Criteria - AC)

- [ ] **`AC-01` (Cấu hình Package):** Tất cả các dependencies (`react`, `react-dom`, `lucide-react`, `canvas-confetti`, `vitest`, `tailwindcss`) cài đặt sạch sẽ không lỗi deprecated/vulnerability nghiêm trọng.
- [ ] **`AC-02` (Chuẩn Design Token):** Tailwind CSS nhận diện đúng các mã màu `#fa9000`, `#c31833`, `#100e2f`, `#d8d8d8`, lớp `.btn-pill-dark` bo góc đúng 18px và scale 0.98 khi click.
- [ ] **`AC-03` (In ấn A4):** Quy tắc `@media print` được định nghĩa đầy đủ với `@page { size: A4 portrait; margin: 10mm; }` và ẩn các thành phần không cần thiết (`.no-print`).
- [ ] **`AC-04` (Kiểm tra Tĩnh & Build):** Lệnh `npm run type-check` đạt 0 error; `npm run build` sinh ra bundle trong `dist/` mà không có lỗi thiếu module.
- [ ] **`AC-05` (Test Runner):** Lệnh `npm test` chạy thành công với môi trường `jsdom`.

---

## 6. Lệnh Kiểm Tra Nghiệm Thu (Quality Gate Commands)

```bash
# 1. Kiểm tra Type & Build
npm run type-check && npm run build

# 2. Kiểm tra Test Suite
npm test
```

---

## 7. Nhật Ký Thực Thi (Audit Log)

| Thời gian | Người/Agent | Hành động thực hiện | Kết quả / Ghi chú | Commit Hash |
| :---: | :---: | :--- | :--- | :---: |
| 2026-11-20 16:22 | Antigravity | Soạn thảo Task Spec dựa trên Giai đoạn 0 | Sẵn sàng chờ phê duyệt thực thi | `c3e13a1` |

