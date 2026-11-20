# CHỈ MỤC ĐẶC TẢ HỆ THỐNG (SPECIFICATION INDEX & AI-DLC ROUTER)
**Dự án:** LucidTask — Nền tảng Hướng nghiệp & Trải nghiệm Tác vụ Thực chứng  
**Mục tiêu tài liệu:** Bản đồ điều hướng ngữ cảnh (Context Router) dành cho Con người và AI Agents (Claude Code, Cursor, Copilot, Antigravity)  
**Quy ước tối cao:** Tính Duy Nhất Của Sự Thật (Single Source of Truth — SSOT)  
**Phiên bản:** 1.0 (Master Index)  

---

## 1. Sơ Đồ Luồng Đặc Tả 3 Tầng (Spec-as-Source Architecture)

Để tránh chồng chéo (overlapping) và lệch pha tài liệu (desynchronization), toàn bộ 8 tài liệu đặc tả của LucidTask được phân cấp nghiêm ngặt thành 3 tầng:

```
TẦNG 1: ĐỊNH HƯỚNG & PHẠM VI (Business & Scope)
  ├── PRD_MVP.md                  ── Trả lời TẠI SAO (Why) & CHO AI (Who)
  └── bare_minimum.md             ── BẢNG CẮT BỎ CỨNG (Non-negotiable Cut-off Checklist)

TẦNG 2: ĐẶC TẢ KỸ THUẬT (System & Implementation Specs)
  ├── SRS.md                      ── Trả lời HỆ THỐNG LÀM GÌ (What: FR & NFR)
  ├── Task_Engine_Architecture.md ── KIẾN TRÚC ĐỘNG CƠ (How Engine: 4 Archetypes)
  ├── Data_Schema_&_Seed_Data.md  ── HỢP ĐỒNG DỮ LIỆU (TypeScript & JSON Seed)
  └── UI_UX_Wireframe_Spec.md     ── GIAO DIỆN & DESIGN TOKENS (How UI)

TẦNG 3: KIỂM CHỨNG & ĐÁNH GIÁ (Eval & Quality Gates)
  ├── AI_DLC_Eval_&_Data_Feasibility_Spec.md ── KHUNG CRAFT & GROUND TRUTH
  ├── Scenario_&_Scoring_Spec.md             ── TOÁN HỌC & THANG ĐIỂM HÀNH VI
  └── Validation_Plan.md                     ── KỊCH BẢN THỬ NGHIỆM UAT & THỰC ĐỊA
```

---

## 2. Bảng Ranh Giới Trách Nhiệm & Chỉ Mục 8 Tài Liệu (SSOT Matrix)

| Tầng | Tên File | Câu hỏi Trả lời | Trách nhiệm Duy nhất (Single Source of Truth) | Thứ tự Đọc |
| :--- | :--- | :---: | :--- | :---: |
| **Tầng 1** | [PRD_MVP.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/PRD_MVP.md) | **Why & Who** | Bối cảnh 3 đứt gãy, mục tiêu kiểm chứng, đối tượng người dùng (học sinh & phụ huynh), và phân cấp tính năng MoSCoW. | 1 |
| **Tầng 1** | [bare_minimum.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/bare_minimum.md) | **Cut-offs** | Bảng tiêu chuẩn cốt lõi không thể cắt giảm, 6 nguyên lý kiểm duyệt và ranh giới định vị (LÀ GÌ / KHÔNG PHẢI LÀ GÌ). | 2 |
| **Tầng 2** | [SRS.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/SRS.md) | **What** | Danh mục yêu cầu chức năng (`FR-01` $\rightarrow$ `FR-09`), yêu cầu phi chức năng (`NFR-01` $\rightarrow$ `NFR-06`) và ma trận truy xuất nguồn gốc RTM. | 3 |
| **Tầng 2** | [Task_Engine_Architecture.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Task_Engine_Architecture.md) | **How Engine** | Kiến trúc Schema-driven, 4 nguyên tử tương tác (`TRIAGE`, `ALLOCATION`, `INVESTIGATION`, `TRADEOFF`) và cấu trúc cắm rút module. | 4 |
| **Tầng 2** | [Data_Schema_&_Seed_Data.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Data_Schema_&_Seed_Data.md) | **Data** | Khóa cứng cấu trúc dữ liệu TypeScript và bộ dữ liệu mồi 8 chương trình đào tạo & thị trường lao động. | 5 |
| **Tầng 2** | [UI_UX_Wireframe_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/UI_UX_Wireframe_Spec.md) | **How UI** | Bố cục wireframe 3 màn hình, tích hợp Design Tokens từ [.AGENTS/DESIGN.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/.AGENTS/DESIGN.md) và CSS in ấn khổ A4. | 6 |
| **Tầng 3** | [AI_DLC_Eval_&_Data_Feasibility_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/AI_DLC_Eval_&_Data_Feasibility_Spec.md) | **AI Eval** | Khung CRAFT cho AI Agent, định nghĩa Ground Truth, tiêu chuẩn chấp nhận kỹ thuật và chiến lược khử 4 tầng thiên vị (Bias). | 7 |
| **Tầng 3** | [Scenario_&_Scoring_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Scenario_&_Scoring_Spec.md) | **Math & Logic** | Kịch bản chi tiết 2 ngành mẫu (IT & Logistics), từ điển Telemetry và công thức toán học tính 3 trục năng lực & Cosine matching. | 8 |
| **Tầng 3** | [Validation_Plan.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Validation_Plan.md) | **UAT & DoD** | Kế hoạch thực nghiệm với 20-30 cặp học sinh/phụ huynh, kịch bản phỏng vấn sâu và phiếu quan sát thực địa. | 9 |

---

## 3. Giao Thức Nạp Ngữ Cảnh Dành Cho AI Agents (Agent Prompting Protocols)

Khi làm việc với các AI Coding Agents (Cursor, Claude Code, Copilot, Antigravity), **tuyệt đối không nạp toàn bộ thư mục specs vào prompt** để tránh tràn context window và làm loãng sự chú ý (attention dilution). Hãy nạp chính xác các cặp file sau tùy theo tác vụ:

### Giao thức 1: Khi yêu cầu AI lập trình Giao diện (Frontend UI Components)
- **Files nạp vào Context:**
  1. [UI_UX_Wireframe_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/UI_UX_Wireframe_Spec.md)
  2. [.AGENTS/DESIGN.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/.AGENTS/DESIGN.md)
- **Prompt mẫu:**
  > *"Hãy xây dựng component `TaskWorkspace.tsx` tuân thủ đúng Wireframe Màn hình 1 trong `UI_UX_Wireframe_Spec.md` và áp dụng chính xác các Design Token (màu #fa9000, #c31833, nút button-pill-dark bo góc 18px, font Roboto) từ file `DESIGN.md`."*

### Giao thức 2: Khi yêu cầu AI dựng Động cơ Tác vụ Tổng quát (Task Runner Engine)
- **Files nạp vào Context:**
  1. [Task_Engine_Architecture.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Task_Engine_Architecture.md)
  2. [Data_Schema_&_Seed_Data.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Data_Schema_&_Seed_Data.md)
- **Prompt mẫu:**
  > *"Hãy viết `TaskEngineRunner.tsx` có khả năng đọc dynamic config `task.config.json` theo đúng schema trong `Task_Engine_Architecture.md`. Render component tương ứng dựa trên `interaction.archetype` mà không hard-code nội dung ngành nghề."*

### Giao thức 3: Khi yêu cầu AI viết Thuật toán Tính điểm & Telemetry Bus
- **Files nạp vào Context:**
  1. [Scenario_&_Scoring_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Scenario_&_Scoring_Spec.md)
  2. [AI_DLC_Eval_&_Data_Feasibility_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/AI_DLC_Eval_&_Data_Feasibility_Spec.md)
- **Prompt mẫu:**
  > *"Hãy viết module `ScoringEngine.ts` hiện thực hóa đúng công thức toán học tính $S_{\text{Logic}}$, $S_{\text{Patience}}$, $S_{\text{Resilience}}$ và hàm Cosine Matching trong `Scenario_&_Scoring_Spec.md`. Đảm bảo các unit test thỏa mãn tiêu chí Ground Truth và Invariant Tests trong `AI_DLC_Eval_&_Data_Feasibility_Spec.md`."*

### Giao thức 4: Khi cần Rà soát Tính năng & Quản trị Phạm vi (Scope & Cut-offs)
- **Files nạp vào Context:**
  1. [PRD_MVP.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/PRD_MVP.md)
  2. [bare_minimum.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/bare_minimum.md)
  3. [SRS.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/SRS.md)
- **Prompt mẫu:**
  > *"Hãy kiểm tra xem tính năng XYZ có nằm trong danh mục MUST-HAVE của `PRD_MVP.md` hay vi phạm danh sách OUT-OF-SCOPE và 6 nguyên lý kiểm duyệt của `bare_minimum.md` không."*

---

## 4. Quy Ước Bảo Trì Tài Liệu (Maintenance Protocol)

1. **Tuyệt đối không sao chép lặp lại:** Khi một file cần thông tin của file khác, sử dụng liên kết Markdown URL trỏ về file gốc (Ví dụ: *"Xem cấu trúc dữ liệu chi tiết tại `Data_Schema_&_Seed_Data.md`"*).
2. **Quy tắc Cập nhật 1 Chiều:**
   - Thay đổi bài toán kinh doanh / đối tượng $\rightarrow$ Sửa `PRD_MVP.md`.
   - Cắt giảm tính năng khi trễ hạn $\rightarrow$ Sửa `bare_minimum.md`.
   - Thay đổi yêu cầu chức năng / kỹ thuật $\rightarrow$ Sửa `SRS.md`.
   - Thay đổi công thức / kịch bản $\rightarrow$ Sửa `Scenario_&_Scoring_Spec.md`.
   - Thay đổi giao diện $\rightarrow$ Sửa `UI_UX_Wireframe_Spec.md`.

