# [TASK-P1-03]: XÂY DỰNG SCORING ENGINE, GATEKEEPER & COSINE MATCHING

**Mã Task:** `TASK-P1-03`  
**Giai đoạn:** Giai đoạn 1 (Sprint 1: Core Engine, Data Contracts & Registry)  
**Người thực hiện:** AI Assistant / Antigravity  
**Slash Command / Action Khuyến nghị:** `/boost`  
**Trạng thái:** `COMPLETED`  
**Ngày bắt đầu:** 2026-11-20  
**Ngày hoàn thành:** 2026-11-20  

---

## 1. Mục Tiêu, Phạm Vi & Antigravity IDE Action

### 1.1. Mục tiêu cốt lõi
Xây dựng động cơ tính toán toán học `ScoringEngine.ts` hiện thực hóa:
1. Bộ lọc sàng lọc sớm Gatekeeper (Accuracy $< 60\%$ hoặc Speed $< 1.2$s/item).
2. Công thức tính điểm 3 trục năng lực: $S_{\text{Logic}}, S_{\text{Patience}}, S_{\text{Resilience}}$ và điểm tổng hợp $S_{\text{Total}}$.
3. Thuật toán Cosine Similarity véc-tơ có hàm phạt khoảng cách lệch trục $\alpha$.
4. Hàm xếp hạng chương trình `rankPrograms` đối chiếu với 8 chương trình thật.
5. Bộ Unit Test Matrix: `UT-SCORE-01`, `UT-SCORE-02`, `UT-GATE-01..03`, `UT-COSINE-01..02`.

---

## 2. Tiêu Chuẩn Chấp Nhận & Nghiệm Thu (Acceptance Criteria)
- [x] `AC-01`: 100% Unit Tests trong `gatekeeper.test.ts`, `scoring.test.ts`, `matching.test.ts` PASS.
- [x] `AC-02`: Line coverage của `src/engine/` đạt $\ge 80\%$ (thực tế đạt **$92.72\%$**).
- [x] `AC-03`: Vector song song đạt $\ge 99.9\%$ match (`UT-COSINE-01`), vector trực giao đạt $0.0\%$ (`UT-COSINE-02`).
- [x] `AC-04`: Gatekeeper lọc đúng trường hợp thao tác ẩu và click bừa.
