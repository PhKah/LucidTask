# [TASK-P1-02]: XÂY DỰNG EVENT-DRIVEN TELEMETRY BUS (< 50MS)

**Mã Task:** `TASK-P1-02`  
**Giai đoạn:** Giai đoạn 1 (Sprint 1: Core Engine, Data Contracts & Registry)  
**Người thực hiện:** AI Assistant / Antigravity  
**Slash Command / Action Khuyến nghị:** `/boost`  
**Trạng thái:** `COMPLETED`  
**Ngày bắt đầu:** 2026-11-20  
**Ngày hoàn thành:** 2026-11-20  

---

## 1. Mục Tiêu, Phạm Vi & Antigravity IDE Action

### 1.1. Mục tiêu cốt lõi
Xây dựng trục sự kiện phi khóa `TelemetryBus.ts` theo mẫu hình Pub/Sub, ghi nhận vi thao tác chuột theo mô hình FIFO circular buffer với độ trễ dispatch $< 50$ms.

### 1.2. Ranh giới phạm vi
* **TRONG PHẠM VI (In-Scope):**
  - [x] Phát triển class `TelemetryBus` và instance singleton `telemetryBus`.
  - [x] Hỗ trợ publish typed events (`item_classified`, `handbook_viewed`, `tab_switched`, `panic_click_flag`...).
  - [x] Hỗ trợ subscribe specific event và wildcard `*`.
  - [x] Viết unit test tự động `tests/unit/telemetryBus.test.ts` (`UT-BUS-01`).
* **NGOÀI PHẠM VI:**
  - Không kết nối backend WebSocket (chạy in-memory cho MVP).

---

## 2. Tiêu Chuẩn Chấp Nhận & Nghiệm Thu (Acceptance Criteria)
- [x] `AC-01`: Đạt độ trễ dispatch $< 50$ms.
- [x] `AC-02`: Đảm bảo payload giữ nguyên vẹn và tự động cấp phát `event_id` cùng timestamp.
- [x] `AC-03`: Unit test `UT-BUS-01` PASS 100%.
