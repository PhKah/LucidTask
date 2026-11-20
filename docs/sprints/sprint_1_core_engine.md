# HỒ SƠ ĐIỀU PHỐI: SPRINT 1 — ĐỘNG CƠ LÕI, HỢP ĐỒNG DỮ LIỆU & REGISTRY
**Giai đoạn:** Giai đoạn 1 (Sprint 1)  
**Thời lượng dự kiến:** 2 – 3 ngày  
**Mục tiêu Sprint:** Xây dựng tầng dữ liệu TypeScript, bộ nạp Industry Registry, trục sự kiện TelemetryBus (< 50ms) và Động cơ tính điểm ScoringEngine (đo 3 trục năng lực, sàng lọc sớm Gatekeeper và thuật toán Cosine Matching) kèm 100% Unit Tests.

---

## 1. Danh Mục Tài Liệu Bắt Buộc Đọc (Reading Dossier)
1. [specs/Data_Schema_&_Seed_Data.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Data_Schema_&_Seed_Data.md):
   - Mục 1: Các TypeScript Interfaces (`ITaskDefinition`, `ITelemetryEvent`, `IProgramSchema`, `IUserState`).
   - Mục 2: Dữ liệu mồi 8 chương trình đào tạo & dữ liệu thị trường lao động.
2. [specs/Scenario_&_Scoring_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Scenario_&_Scoring_Spec.md):
   - Mục 2: Từ điển Sự kiện Telemetry.
   - Mục 3: Công thức toán học tính 3 trục năng lực ($S_{\text{Logic}}, S_{\text{Patience}}, S_{\text{Resilience}}$).
   - Mục 4: Công thức Cosine Similarity kết hợp phạt lệch trục $\alpha = 0.15$.
3. [specs/QA_TEST_PLAN.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/QA_TEST_PLAN.md):
   - Mục 3: Ma trận Ca kiểm thử Đơn vị (`UT-SCORE-01`, `UT-SCORE-02`, `UT-COSINE-01`, `UT-COSINE-02`, `UT-GATE-01..03`, `UT-BUS-01`).
4. [specs/AI_DLC_Eval_&_Data_Feasibility_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/AI_DLC_Eval_&_Data_Feasibility_Spec.md):
   - Mục 2: Ground Truth và Tiêu chuẩn chấp nhận kỹ thuật (Latency $\le 50$ms, NDCG@3 $\ge 0.85$).

---

## 2. Danh Sách Nhiệm Vụ (Sprint Backlog)
* [ ] `TASK-P1-01`: Xây dựng Type Definitions (`task.ts`, `program.ts`, `telemetry.ts`, `state.ts`) và nạp Seed Data Registry.
* [ ] `TASK-P1-02`: Xây dựng `TelemetryBus.ts` và kiểm thử pub/sub vi thao tác chuột.
* [ ] `TASK-P1-03`: Xây dựng `ScoringEngine.ts` (Gatekeeper, 3 trục năng lực, Cosine Matching) và Unit Test suite.

---

## 3. Cổng Nghiệm Thu Chất Lượng (Sprint 1 DoD Gate)
```bash
npm test && npm run test:coverage
```
- **Tiêu chí:** 100% unit tests pass, Line Coverage của `src/engine/` đạt $\ge 80\%$ (kỳ vọng $\ge 95\%$), thuật toán Cosine xếp hạng đúng Ground Truth.
