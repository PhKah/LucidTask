# HỒ SƠ ĐIỀU PHỐI: SPRINT 6 — NÂNG CẤP GIAO DIỆN DIEGETIC UI & GAME HÓA TÁC VỤ ĐỜI THƯỜNG
**Giai đoạn:** Giai đoạn 6 (Sprint 6 — Gamification & Competitive Moat Upgrade)  
**Thời lượng dự kiến:** 2 – 3 ngày  
**Mục tiêu Sprint:** Chuyển hóa trải nghiệm làm bài từ giao diện nút bấm tĩnh sang **Diegetic UI (Màn hình công việc thu nhỏ)** lấy cảm hứng từ *Papers, Please*, *Reigns* và *Simulacra*, tích hợp **Hệ thống 3 Thanh Chỉ Số Đánh Đổi (Trade-off Bars)**, khung chat công việc (Zalo/Slack) và kịch bản đời thường không đòi hỏi kiến thức hàn lâm theo đúng đặc tả [gamification_diegetic_ui_rfc.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/docs/roadmap/gamification_diegetic_ui_rfc.md).

---

## 1. Danh Mục Tài Liệu Bắt Buộc Đọc (Reading Dossier)
1. [docs/roadmap/gamification_diegetic_ui_rfc.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/docs/roadmap/gamification_diegetic_ui_rfc.md):
   - Toàn bộ triết lý Diegetic UI, 3 thanh chỉ số đánh đổi (Trade-off Bars), phong cách Neo-Brutalism và bảng chuyển hóa kịch bản đời thường.
2. [specs/Task_Engine_Architecture.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Task_Engine_Architecture.md):
   - Mục 2.5: Kiến trúc tách rời **Headless Engine Hook** (`useTriageEngine`, `useTradeOffBars`) và **Diegetic UI Skins** để không làm trùng lặp hay phình to mã nguồn.
3. [specs/UI_UX_Wireframe_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/UI_UX_Wireframe_Spec.md):
   - Mục 2 (Màn hình 1): Wireframe Bàn kiểm duyệt SOP 3 dòng, Khung chat công việc và 3 thanh Trade-off Bars.
4. [specs/Scenario_&_Scoring_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Scenario_&_Scoring_Spec.md):
   - Mục 1: Kịch bản đời thường (Đơn hàng trà sữa/thương mại điện tử lỗi nhập liệu & Phòng chat tác chiến Flash-Sale).

---

## 2. Danh Sách Nhiệm Vụ (Sprint Backlog)
* [ ] `TASK-P6-01`: Tách Headless Hooks `src/engine/useTriageEngine.ts` và `src/engine/useTradeOffBars.ts` để tái sử dụng 100% logic chấm điểm và `TelemetryBus` mà không trùng lặp code.
* [ ] `TASK-P6-02`: Xây dựng thanh `TradeOffStatusBar.tsx` (3 thanh chỉ số: Chất lượng, Hài lòng Sếp/Khách, Thời gian/Tinh thần) biến động tức thì theo từng quyết định kèm hiệu ứng rung/đổi màu Neo-Brutalism.
* [ ] `TASK-P6-03`: Nâng cấp Chặng 1 thành **Bàn Kiểm Duyệt Đóng Dấu & Quẹt Thẻ (`Papers, Please` & `Reigns` Style)** với Bảng quy định SOP 3 dòng ghim cố định, phím tắt phản xạ (`A`/`D` hoặc `←`/`→`) và tin nhắn Sếp nhắc nhở trực tiếp.
* [ ] `TASK-P6-04`: Nâng cấp Chặng 2 thành **Khung Chat Công Việc Khẩn Cấp (`Zalo/Slack War Room`)** với tin nhắn đổ về dồn dập, ghim manh mối trực tiếp trên dòng dữ liệu và nút gạt khẩn cấp Rollback.
* [ ] `TASK-P6-05`: Viết Integration Test đảm bảo toàn bộ 28 bài test hiện có và test giao diện Diegetic UI mới PASS 100%.

---

## 3. Cổng Nghiệm Thu Chất Lượng (Sprint 6 DoD Gate)
```bash
npm run type-check && npm test && npm run build
```
- **Tiêu chí:** 0 lỗi TypeScript, 100% test suite PASS, không trùng lặp logic trong `src/engine/`, tốc độ phản hồi micro-interactions mượt 60 FPS.
