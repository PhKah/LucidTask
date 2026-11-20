# [TASK-P1-01]: XÂY DỰNG TYPE DEFINITIONS & INDUSTRY SEED DATA REGISTRY

**Mã Task:** `TASK-P1-01`  
**Giai đoạn:** Giai đoạn 1 (Sprint 1: Core Engine, Data Contracts & Registry)  
**Người thực hiện:** AI Assistant / Antigravity  
**Slash Command / Action Khuyến nghị:** `/boost`  
**Trạng thái:** `COMPLETED`  
**Ngày bắt đầu:** 2026-11-20  
**Ngày hoàn thành:** 2026-11-20  

---

## 1. Mục Tiêu, Phạm Vi & Antigravity IDE Action

### 1.1. Mục tiêu cốt lõi
Khóa cứng các hợp đồng dữ liệu TypeScript (`task.ts`, `program.ts`, `telemetry.ts`, `state.ts`) và nạp dữ liệu mồi chuẩn hóa (Seed Data) cho cụm ngành Phần mềm & QA (`stage1_task.json`, `stage2_task.json`, `programs.json`, `industry.json`), bảo đảm hệ thống chạy độc lập hoàn toàn không phụ thuộc backend.

### 1.2. Ranh giới phạm vi
* **TRONG PHẠM VI (In-Scope):**
  - [x] Xây dựng `src/types/task.ts`: Định nghĩa `InteractionArchetype`, `ITaskDefinition`, `IHandbookRule`, `IWorkItem`.
  - [x] Xây dựng `src/types/program.ts`: Định nghĩa `EducationalProgram`, `IndustryMarketIntelligence`.
  - [x] Xây dựng `src/types/telemetry.ts`: Định nghĩa `TelemetryEvent`, `TelemetryPayloadMap`.
  - [x] Xây dựng `src/types/state.ts`: Định nghĩa `TaskWorkflowState`, `CompetencyProfile`, `ProgramMatchResult`.
  - [x] Khởi tạo thư mục `src/registry/software_engineering/` chứa đầy đủ 4 file JSON seed data.
  - [x] Xây dựng module nạp động `src/registry/index.ts`.
* **NGOÀI PHẠM VI:**
  - Không viết logic tính điểm (`ScoringEngine.ts` thuộc TASK-P1-03).
  - Không viết component UI.

---

## 2. Tài Liệu & Dữ Liệu Đầu Vào (Inputs)
| STT | Tài liệu cần đọc | Chương / Mục cụ thể | Yêu cầu cốt lõi |
| :---: | :--- | :--- | :--- |
| 1 | [specs/Data_Schema_&_Seed_Data.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Data_Schema_&_Seed_Data.md) | Mục 1, 2, 3 | Toàn bộ TypeScript Interfaces và 8 chương trình đào tạo mẫu. |
| 2 | [specs/Task_Engine_Architecture.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Task_Engine_Architecture.md) | Mục 1 & 2 | Cấu trúc Schema-Driven và 4 Archetypes. |
| 3 | [docs/sprints/sprint_1_core_engine.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/docs/sprints/sprint_1_core_engine.md) | Sprint 1 Backlog | Mục tiêu bàn giao của Task P1-01. |

---

## 3. Phân Rã Công Việc & Kiểm Định Từng Bước
### Bước 1: Tạo các Interfaces TypeScript trong `src/types/`
- [x] Hành động: Viết `task.ts`, `program.ts`, `telemetry.ts`, `state.ts`.
- [x] Kiểm định: `npm run type-check` đạt 0 lỗi.

### Bước 2: Nạp dữ liệu Seed Data JSON trong `src/registry/`
- [x] Hành động: Viết 4 file JSON cho ngành Phần mềm/QA và `src/registry/index.ts`.
- [x] Kiểm định: `npm run type-check` đạt 0 lỗi, data imports trơn tru.

---

## 4. Sản Phẩm Bàn Giao Đầu Ra (Outputs)
* [x] `src/types/task.ts`, `program.ts`, `telemetry.ts`, `state.ts`
* [x] `src/registry/software_engineering/stage1_task.json`
* [x] `src/registry/software_engineering/stage2_task.json`
* [x] `src/registry/software_engineering/programs.json`
* [x] `src/registry/software_engineering/industry.json`
* [x] `src/registry/index.ts`

---

## 5. Tiêu Chuẩn Chấp Nhận (Acceptance Criteria)
- [x] `AC-01`: 100% Type Interfaces đồng bộ không mâu thuẫn với `Data_Schema_&_Seed_Data.md`.
- [x] `AC-02`: Đủ 8 chương trình đào tạo mẫu và dữ liệu thị trường ngành IT (chi phí rủi ro 185 triệu).
- [x] `AC-03`: `npm run type-check` đạt 0 lỗi.
