# LucidTask — Nền Tảng Hướng Nghiệp & Trải Nghiệm Tác Vụ Thực Chứng

LucidTask là hệ sinh thái trải nghiệm công việc thực chứng dành cho học sinh THPT, giúp kết nối Học sinh, Phụ huynh và Cơ sở Giáo dục thông qua dữ liệu hành vi thực tế thay vì trắc nghiệm tự chấm hay định kiến thương hiệu.

---

## Hệ Thống Tài Liệu Đặc Tả (AI-DLC Specification Suite)

Toàn bộ hệ thống tài liệu đặc tả của dự án được cấu trúc theo mô hình **3 Tầng Phân Cấp (Spec-as-Source Flow)** tuân thủ nguyên tắc Single Source of Truth (SSOT). 

👉 **Xem Bản đồ Điều hướng & Giao thức Nạp Context cho AI Agents:** **[specs/SPEC_INDEX.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/SPEC_INDEX.md)**

### Tóm Tắt 3 Tầng Đặc Tả:

### TẦNG 1: ĐỊNH HƯỚNG & PHẠM VI (Business & Scope)
- [specs/PRD_MVP.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/PRD_MVP.md) — Mục tiêu sản phẩm, bối cảnh 3 đứt gãy và phân cấp tính năng MoSCoW (*Trả lời: WHY & WHO*).
- [specs/bare_minimum.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/bare_minimum.md) — Kim chỉ nam triết lý, 6 nguyên lý kiểm duyệt và tiêu chuẩn cốt lõi không thể cắt giảm (*Trả lời: NON-NEGOTIABLE CUT-OFFS*).

### TẦNG 2: ĐẶC TẢ KỸ THUẬT (System & Implementation Specs)
- [specs/SRS.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/SRS.md) — Bản Master Yêu cầu Chức năng (`FR-01` $\rightarrow$ `FR-09`) & Phi Chức năng (`NFR-01` $\rightarrow$ `NFR-06`) chuẩn IEEE 830 (*Trả lời: WHAT*).
- [specs/Task_Engine_Architecture.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Task_Engine_Architecture.md) — Thiết kế kiến trúc động cơ tác vụ, 4 Universal Interaction Archetypes (*Trả lời: HOW ENGINE*).
- [specs/Data_Schema_&_Seed_Data.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Data_Schema_&_Seed_Data.md) — Hợp đồng TypeScript và bộ dữ liệu mồi 8 trường học & thị trường lao động (*Trả lời: DATA*).
- [specs/UI_UX_Wireframe_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/UI_UX_Wireframe_Spec.md) — Wireframe 3 màn hình và Design Tokens từ [.AGENTS/DESIGN.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/.AGENTS/DESIGN.md) (*Trả lời: HOW UI*).

### TẦNG 3: KIỂM CHỨNG & ĐÁNH GIÁ (Eval & Quality Gates)
- [specs/AI_DLC_Eval_&_Data_Feasibility_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/AI_DLC_Eval_&_Data_Feasibility_Spec.md) — Khung CRAFT, ma trận Ground Truth và chiến lược khử thiên vị (*Trả lời: AI EVAL*).
- [specs/Scenario_&_Scoring_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Scenario_&_Scoring_Spec.md) — Storyboards 2 ngành, từ điển Telemetry và công thức toán học tính điểm (*Trả lời: MATH & LOGIC*).
- [specs/Validation_Plan.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Validation_Plan.md) — Kế hoạch thử nghiệm UAT thực địa, kịch bản phỏng vấn sâu (*Trả lời: UAT & DoD*).
