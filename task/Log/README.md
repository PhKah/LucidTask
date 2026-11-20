# THƯ MỤC LƯU TRỮ LỊCH SỬ THỰC HIỆN CÔNG VIỆC (TASK EXECUTION LOGS)
**Dự án:** LucidTask — Nền tảng Hướng nghiệp & Trải nghiệm Tác vụ Thực chứng  

---

## 1. Mục Đích & Vai Trò
Thư mục `task/Log/` là kho lưu trữ lịch sử kiểm định và nhật ký thực thi (Audit Trail) của toàn bộ các nhiệm vụ trong suốt vòng đời dự án. 

Mỗi khi một nhiệm vụ (Task) được triển khai:
1. Tạo một bản sao từ file mẫu [task/task_template.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/task/task_template.md).
2. Điền đầy đủ: **Đầu vào**, **Các bước chia nhỏ**, **Đầu ra**, và **Tiêu chí chấp nhận (AC)**.
3. Khi hoàn thành, cập nhật kết quả kiểm thử thực tế và lưu file log vào thư mục này.

---

## 2. Quy Ước Đặt Tên File Nhật Ký (Naming Convention)

Tên file nhật ký tuân thủ cấu trúc chuẩn:
```text
task/Log/[YYYYMMDD]_[TASK-ID]_[ten-nhiem-vu-viet-tat].md
```

**Ví dụ:**
- `task/Log/20261120_TASK-P0-01_scaffolding-design-tokens.md`
- `task/Log/20261121_TASK-P1-01_types-contracts-and-registry.md`
- `task/Log/20261121_TASK-P1-02_scoring-engine-and-cosine.md`
- `task/Log/20261122_TASK-P2-01_task-workspace-and-timer.md`
- `task/Log/20261123_TASK-P3-01_blind-matching-cards.md`

---

## 3. Cấu Trúc Nội Dung Bắt Buộc Của Một File Log
Mỗi file log lưu trữ phải đảm bảo:
1. **Liên kết truy xuất nguồn gốc:** Ghi rõ ID task, giai đoạn và các file specs đầu vào đã đọc.
2. **Minh chứng kiểm tra thực tế:** Log chi tiết đầu ra của lệnh `npm run type-check`, `npm test`, `npm run build` và tỷ lệ `Coverage %`.
3. **Commit Hash:** Ghi lại mã commit tương ứng trên Git để đối chiếu ngược khi cần kiểm toán.
4. **Trạng thái kết thúc:** Đánh dấu `COMPLETED` khi vượt qua 100% Acceptance Criteria.

---

## 4. Bảng Chỉ Mục Các Nhiệm Vụ Đã Thực Hiện (Task Execution Registry)

| Ngày | Mã Task | Giai đoạn | Tên Nhiệm Vụ | Trạng Thái | Commit Hash | File Nhật Ký Chi Tiết |
| :---: | :---: | :---: | :--- | :---: | :---: | :--- |
| 2026-11-20 | `TASK-P0-01` | GĐ 0 | Khởi tạo Scaffolding & Design Tokens | COMPLETED | `e4f3ed1` | [20261120_TASK-P0-01_scaffolding-design-tokens.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/task/Log/20261120_TASK-P0-01_scaffolding-design-tokens.md) |
| 2026-11-20 | `TASK-P1-01` | GĐ 1 | Type Contracts & Seed Data Registry | COMPLETED | `5e83c7a` | [20261120_TASK-P1-01_types-contracts-and-registry.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/task/Log/20261120_TASK-P1-01_types-contracts-and-registry.md) |
| 2026-11-20 | `TASK-P1-02` | GĐ 1 | Event-Driven Telemetry Bus (< 50ms) | COMPLETED | `5e83c7a` | [20261120_TASK-P1-02_telemetry-bus.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/task/Log/20261120_TASK-P1-02_telemetry-bus.md) |
| 2026-11-20 | `TASK-P1-03` | GĐ 1 | Scoring Engine, Gatekeeper & Cosine Matching | COMPLETED | `5e83c7a` | [20261120_TASK-P1-03_scoring-engine-and-unit-tests.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/task/Log/20261120_TASK-P1-03_scoring-engine-and-unit-tests.md) |

