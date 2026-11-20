# ĐẶC TẢ YÊU CẦU PHẦN MỀM (SOFTWARE REQUIREMENTS SPECIFICATION — SRS)
**Tên dự án:** LucidTask — Nền tảng Hướng nghiệp & Trải nghiệm Tác vụ Thực chứng  
**Chuẩn tài liệu:** Phỏng theo IEEE Std 830-1998 / ISO/IEC/IEEE 29148:2018  
**Phiên bản:** 1.0 (Master Baseline for MVP)  
**Ngày phê duyệt:** 2026-11-20  
**Tình trạng:** Khóa yêu cầu kỹ thuật & Nghiệm thu (Frozen for Implementation)  

---

## 1. Giới thiệu Tổng quan (Introduction)

### 1.1. Mục đích Tài liệu
Tài liệu này là **Bản Đặc tả Yêu cầu Phần mềm Duy nhất và Cốt lõi (Single Source of Truth - SSOT)** cho phiên bản MVP của nền tảng **LucidTask**. Tài liệu chuẩn hóa toàn bộ các yêu cầu chức năng (Functional Requirements - FR), yêu cầu phi chức năng (Non-Functional Requirements - NFR), giao diện hệ thống và ma trận truy xuất nguồn gốc (Traceability Matrix) phục vụ việc triển khai kỹ thuật và đánh giá nghiệm thu đề tài Đổi mới Sáng tạo (ĐMST).

### 1.2. Danh mục Tài liệu Chuyên biệt Đi kèm (Modular Specification Index)
Để tránh trùng lặp nội dung, các đặc tả kỹ thuật chi tiết theo từng khía cạnh được lưu trữ tại các tài liệu chuyên biệt sau:
1. [bare_minimum.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/bare_minimum.md): Triết lý nền tảng, 3 đứt gãy hệ thống và 6 nguyên lý bắt buộc.
2. [PRD_MVP.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/PRD_MVP.md): Phạm vi sản phẩm, ranh giới tính năng (MoSCoW) và bài toán giá trị.
3. [Scenario_&_Scoring_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Scenario_&_Scoring_Spec.md): Kịch bản tác vụ thực chứng, danh mục sự kiện Telemetry và công thức toán học tính điểm.
4. [Data_Schema_&_Seed_Data.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Data_Schema_&_Seed_Data.md): Hợp đồng dữ liệu TypeScript và bộ dữ liệu mồi (Seed Data) 8 chương trình đào tạo & thị trường lao động.
5. [Task_Engine_Architecture.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Task_Engine_Architecture.md): Kiến trúc động cơ tác vụ, 4 nguyên tử tương tác (Archetypes) và cấu trúc module hóa mở rộng.
6. [UI_UX_Wireframe_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/UI_UX_Wireframe_Spec.md): Đặc tả khung giao diện (Wireframes) và hệ thống Design Tokens (Roboto, #fa9000, #c31833, Black Pills).
7. [Validation_Plan.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Validation_Plan.md): Kế hoạch thực nghiệm, kịch bản Usability Test, bảng chỉ số thành công và log quan sát thực địa.
8. [AI_DLC_Eval_&_Data_Feasibility_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/AI_DLC_Eval_&_Data_Feasibility_Spec.md): Đặc tả kiểm chứng AI-DLC, khung CRAFT (Spec-as-Source), Ground Truth, ma trận Eval và khử thiên vị dữ liệu.

---

## 2. Mô tả Tổng thể Hệ thống (Overall System Description)

### 2.1. Mô hình Vận hành Sản phẩm (Product Perspective)
LucidTask là một ứng dụng web dạng đơn trang (Single Page Application - SPA), vận hành theo mô hình **Khách - Chủ Tinh gọn (Lean Client-side)** trong giai đoạn MVP:
- **Client App:** Chạy trên trình duyệt của người dùng, thực thi giao diện mô phỏng tác vụ, tính toán thời gian thực các sự kiện hành vi (Telemetry) và vẽ biểu đồ.
- **Data Engine:** Hoạt động dựa trên bộ dữ liệu mồi tĩnh (JSON Schemas) được nạp trực tiếp vào bộ nhớ phiên, không đòi hỏi hạ tầng cơ sở dữ liệu B2B hay backend phức tạp.

```mermaid
flowchart LR
    Student[Học sinh THPT] -->|Thao tác Tác vụ 3-5 phút| TaskEngine[Task Execution Engine]
    TaskEngine -->|Ghi nhận Vô thức| TelemetryBus[Telemetry & Scoring Bus]
    TelemetryBus -->|Vector Năng lực 3 Trục| BlindMatching[Blind Matching Engine]
    BlindMatching -->|Chương trình Ẩn danh & Lộ diện| ParentKit[Parent Alignment Kit]
    ParentKit -->|Đối chiếu Song song| Parents[Phụ huynh Học sinh]
```

### 2.2. Các Nhóm Người dùng (User Classes & Characteristics)
1. **Học sinh THPT (Lớp 11–12):** Người dùng thao tác trực tiếp. Cần giao diện trực quan, rõ ràng, nhịp độ thử thách vừa phải, phản hồi tức thì, không đánh đố thuật ngữ chuyên ngành.
2. **Phụ huynh Học sinh:** Người đồng thụ hưởng kết quả. Cần ngôn ngữ dữ liệu khách quan, điềm tĩnh, số liệu tài chính & thị trường minh bạch, có thể in ấn hoặc xem trên màn hình gia đình.
3. **Người Đánh giá / Nghiên cứu viên ĐMST:** Cần sự tường minh về luồng dữ liệu, tính nhất quán của thuật toán và các chỉ số đo lường thực nghiệm.

### 2.3. Ràng buộc Kỹ thuật & Môi trường Hoạt động (Constraints & Assumptions)
- **Ràng buộc xác thực:** MVP cắt bỏ hoàn toàn việc đăng nhập/tạo tài khoản (`Zero-Auth`). Mỗi lượt truy cập được cấp một mã phiên ẩn danh (`SessionID`).
- **Ràng buộc lưu trữ:** Dữ liệu điểm và trạng thái làm bài được lưu trữ trong bộ nhớ tạm (`Memory / LocalStorage`) để tránh mất dữ liệu khi người dùng vô tình tải lại trang.
- **Ràng buộc phần cứng:** Tương thích tốt với máy tính xách tay (Laptop), máy tính để bàn (Desktop) và máy tính bảng (Tablet) có độ phân giải từ $1024 \times 768$ trở lên.

---

## 3. Yêu cầu Chức năng (Functional Requirements — FR)

Hệ thống LucidTask MVP đáp ứng đầy đủ 9 yêu cầu chức năng cốt lõi sau:

### [FR-01] Khởi tạo Phiên & Lựa chọn Cụm ngành
- **Mô tả:** Hệ thống cho phép người dùng truy cập trực tiếp và chọn 1 trong các cụm ngành có sẵn (ví dụ: *Kỹ thuật Phần mềm*, *Logistics & Chuỗi Cung ứng*).
- **Đầu vào:** Thao tác click chọn thẻ ngành từ màn hình chào mừng.
- **Xử lý:** Khởi tạo `SessionID` ngẫu nhiên, nạp cấu hình `task.config.json` tương ứng vào bộ nhớ phiên.
- **Đầu ra:** Màn hình giới thiệu vai trò nghiệp vụ và mở khóa nút "Bắt đầu Chặng 1".

### [FR-02] Động cơ Chuỗi Tác vụ Lũy tiến (Progressive Task Pipeline)
- **Mô tả:** Hệ thống thực thi tác vụ theo chuỗi bậc thang gồm Chặng 1 (Sơ tuyển Ma sát - 90s) và Chặng 2 (Năng lực Cốt lõi - 3.5 phút).
- **Đầu vào:** Các hành vi click, kéo thả, chọn phương án của học sinh.
- **Xử lý:**
  - Đồng hồ đếm ngược chạy độc lập với tần số làm mới 1000ms.
  - Sổ tay quy tắc (Handbook) có thể mở/đóng tức thì qua Drawer trượt mà không làm vỡ bố cục làm việc.
- **Đầu ra:** Cập nhật trạng thái thanh tiến trình (`Stepper: Stage 1` $\rightarrow$ `Stage 2`).

### [FR-03] Cơ chế Sàng lọc Dừng Sớm (Early Exit Mechanism)
- **Mô tả:** Tự động phát hiện và sàng lọc những học sinh không có tính kỷ luật hoặc không phù hợp với tính chất ma sát cơ bản của ngành ở Chặng 1.
- **Đầu vào:** Dữ liệu hành vi từ Chặng 1 (`accuracy_rate`, `time_per_action`).
- **Xử lý:** Nếu tỷ lệ chính xác $< 60\%$ hoặc tốc độ bấm $< 1.2$ giây/thao tác $\rightarrow$ Kích hoạt ngắt luồng Chặng 1.
- **Đầu ra:** Hiển thị màn hình Phân tích Xu hướng Khách quan, giải thích lý do không phù hợp và cung cấp 2 nút điều hướng: `[Thử lại]` hoặc `[Khám phá Ngành khác]`. Tuyệt đối không cho phép vào Chặng 2 nếu không đạt chuẩn.

### [FR-04] Thu thập & Phát hiện Sự kiện Hành vi Vô thức (Telemetry Bus)
- **Mô tả:** Bộ lắng nghe ngầm ghi nhận toàn bộ phản xạ thao tác mà học sinh không nhận biết.
- **Đầu vào:** Sự kiện chuột (click, drag, switch choice) và trạng thái hệ thống.
- **Xử lý:** Đóng gói thành các sự kiện chuẩn: `handbook_opened`, `reading_duration_ms`, `decision_switched`, `panic_click_detected`, `stress_response_speed_delta`.
- **Đầu ra:** Mảng dữ liệu chuỗi thời gian `telemetry_stream[]` phục vụ cho việc tính điểm.

### [FR-05] Động cơ Quy đổi Điểm số Năng lực 3 Trục
- **Mô tả:** Tính toán tự động hồ sơ năng lực thực chứng từ dữ liệu telemetry.
- **Đầu vào:** Mảng `telemetry_stream[]` từ cả 2 chặng.
- **Xử lý:** Áp dụng công thức toán học chuẩn hóa trong [Scenario_&_Scoring_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Scenario_&_Scoring_Spec.md) để tính 3 chỉ số từ 0 đến 100:
  - $S_{\text{Logic}}$: Tư duy Logic & Phân tích Nguyên nhân gốc.
  - $S_{\text{Patience}}$: Độ Kiên nhẫn, Tỉ mỉ & Kỷ luật Quy tắc.
  - $S_{\text{Resilience}}$: Sức bền & Khả năng Chịu Áp lực Giờ G.
- **Đầu ra:** Biểu đồ Radar 3 trục và 2 đoạn nhận xét hành vi thực tế.

### [FR-06] Đánh giá Ghép nối Ẩn danh (Blind Matching & Progressive Reveal)
- **Mô tả:** So khớp vector năng lực của học sinh với cơ sở dữ liệu chương trình đào tạo, ẩn danh toàn bộ tên trường ở bước đầu.
- **Đầu vào:** Vector năng lực học sinh $\vec{V}_{\text{Student}}$ và danh sách chương trình trong ngành.
- **Xử lý:** Tính độ tương thích $\text{Match\_Score}$ theo hàm Cosine có trọng số. Sắp xếp top 3–4 chương trình.
- **Đầu ra:**
  - *Giai đoạn 1 (Ẩn danh):* Hiển thị mã hóa (*Chương trình Alpha, Beta*), % Tương thích, 3 môn học đồ án thực chiến, mức lương khởi điểm.
  - *Giai đoạn 2 (Lộ diện):* Khi học sinh bấm chọn và nhấn "Mở khóa", hệ thống bung tên trường thật, phân loại (Công lập/Tư thục/Nghề) và mức học phí.

### [FR-07] Báo cáo Đồng thuận Gia đình (Parent Alignment Kit)
- **Mô tả:** Trình bày kết quả dưới dạng bảng đối chiếu song song 2 cột nhằm hỗ trợ phụ huynh và học sinh đối thoại.
- **Đầu vào:** Hồ sơ năng lực con + Dữ liệu thị trường và chi phí rủi ro từ `programs.json` & `industry.json`.
- **Xử lý:** Kết xuất bố cục:
  - Cột 1: Bằng chứng năng lực thực chứng của con (Radar + hành vi gỡ lỗi).
  - Cột 2: Bức tranh thị trường (Dải lương 5 năm, nguy cơ AI thay thế, bảng tính chi phí lãng phí 185 triệu nếu học sai).
  - Vùng Đồng thuận: Lời khuyên khách quan trung lập và bộ 3 câu hỏi đối thoại bữa tối.
- **Đầu ra:** Màn hình đối chiếu trực quan và nút in/xuất báo cáo.

### [FR-08] Ma trận Đối chiếu Chéo 2 Ngành (Cross-Domain Benchmark)
- **Mô tả:** Cho phép học sinh làm thêm ngành thứ 2 để đặt lên bàn cân so sánh thực tế giữa 2 ngành (ví dụ: ngành con muốn vs ngành bố mẹ muốn).
- **Đầu vào:** Kết quả hoàn thành của 2 cụm ngành độc lập trong cùng một phiên làm việc.
- **Xử lý:** Tính toán ma trận chênh lệch năng lực $\Delta S_{\text{Domain}} = S_{\text{Total}}(A) - S_{\text{Total}}(B)$.
- **Đầu ra:** Bảng So sánh Đối đầu (Head-to-head Matrix) trên Báo cáo Gia đình, chỉ rõ ngành nào con có sự kiên nhẫn và độ bền vượt trội hơn.

### [FR-09] Xuất Bản in & Lưu trữ PDF Chuẩn A4
- **Mô tả:** Cung cấp tính năng in hoặc lưu file PDF trực tiếp từ trình duyệt theo chuẩn ấn phẩm văn phòng.
- **Đầu vào:** Thao tác click `[IN BÁO CÁO A4 (PDF)]`.
- **Xử lý:** Kích hoạt chế độ `@media print`, loại bỏ thanh điều hướng, căn chuẩn lề 15mm, tối ưu độ tương phản đen trắng và vạch nhận diện cam `#fa9000`.
- **Đầu ra:** Hộp thoại in trình duyệt sẵn sàng lưu file PDF trang A4 hoàn chỉnh không lỗi ngắt trang.

---

## 4. Yêu cầu Phi Chức năng (Non-Functional Requirements — NFR)

### [NFR-01] Hiệu năng Hệ thống (Performance)
- **Thời gian tải màn hình:** Màn hình làm việc và thẻ bài tập phải tải xong trong vòng $\le 1.0$ giây.
- **Độ trễ ghi nhận Telemetry:** Việc thu thập sự kiện chuột và cập nhật state ngầm phải có độ trễ $\le 50\text{ms}$, tuyệt đối không gây giật lag (frame drop) cho chuyển động của người dùng.
- **Thời gian xử lý thuật toán:** Tính toán điểm Radar và xếp hạng Blind Matching phải hoàn tất trong vòng $\le 1.5$ giây.

### [NFR-02] Đạo đức Dữ liệu & Quyền Riêng tư (Ethics & Privacy)
- **Nguyên tắc Không định danh (Anonymity-by-Design):** Hệ thống không thu thập họ tên, số CCCD, số điện thoại hay email của học sinh trong quá trình thử nghiệm MVP.
- **Không xâm lấn:** Tuyệt đối không sử dụng camera, micro, hay theo dõi chuyển động mắt để tránh gây áp lực tâm lý và vi phạm quyền riêng tư học đường.
- **Lưu trữ cục bộ:** Mọi dữ liệu phiên làm việc chỉ lưu trong bộ nhớ tạm của trình duyệt (`Session/LocalStorage`) và tự động giải phóng khi đóng tab.

### [NFR-03] Độ Khả dụng & Trải nghiệm Người dùng (Usability & Accessibility)
- **Chuẩn đánh giá SUS:** Điểm đo lường độ khả dụng hệ thống System Usability Scale phải đạt tối thiểu **$\ge 75 / 100$**.
- **Độ tương phản thị giác:** Tuân thủ tiêu chuẩn tương phản WCAG 2.1 AA (Tỷ lệ tương phản chữ `#000000` / `#333333` trên nền giấy `#ffffff` đạt $> 7:1$).
- **Ngôn ngữ truyền đạt:** Không sử dụng thuật ngữ hàn lâm đại học. Sổ tay hướng dẫn phải được viết bằng tiếng Việt thông dụng, đọc hiểu trong vòng dưới 20 giây.

### [NFR-04] Độ Tin cậy & Phục hồi Trạng thái (Reliability & Robustness)
- **Bảo toàn trạng thái:** Nếu người dùng vô tình bấm F5 hoặc tải lại trang khi đang làm bài dở, hệ thống phải khôi phục lại câu hỏi và mốc thời gian hiện tại từ `LocalStorage`.
- **Xử lý hết giờ an toàn (Timeout Safety):** Khi đồng hồ về `00:00`, hệ thống tự động khóa tương tác và nộp bài an toàn, không làm mất dữ liệu đã thao tác trước đó.

### [NFR-05] Tính Tương thích Thiết bị & Môi trường (Compatibility)
- **Trình duyệt hỗ trợ:** Tương thích hoàn toàn trên Google Chrome, Apple Safari, Microsoft Edge và Mozilla Firefox (các phiên bản phát hành trong vòng 2 năm gần nhất).
- **Thiết bị hiển thị:** Đáp ứng giao diện linh hoạt (Responsive) trên màn hình Desktop ($1920\times 1080$, $1440\times 900$), Laptop ($1366\times 768$) và Tablet ($1024\times 768$).

### [NFR-06] Khả năng Mở rộng & Module hóa (Extensibility)
- **Kiến trúc Hướng Dữ liệu:** Cho phép bổ sung cụm ngành mới bằng cách thêm file cấu hình `task.config.json` theo đúng chuẩn [Task_Engine_Architecture.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Task_Engine_Architecture.md) mà không phải chỉnh sửa mã nguồn giao diện hay động cơ logic.

---

## 5. Ma trận Truy xuất Nguồn gốc Yêu cầu (Requirements Traceability Matrix — RTM)

Bảng ma trận dưới đây liên kết toàn bộ các khâu từ **Mục tiêu Nghiên cứu ĐMST** $\longleftrightarrow$ **Yêu cầu Chức năng** $\longleftrightarrow$ **Thành phần Kỹ thuật / Tài liệu Chi tiết**:

| Giả thuyết Nghiên cứu (Validation Plan) | Mã Yêu cầu Chức năng (FR) | Mã Yêu cầu Phi chức năng (NFR) | Tài liệu Đặc tả Chuyên biệt Tham chiếu | File / Component Kỹ thuật Đảm nhiệm |
| :--- | :--- | :--- | :--- | :--- |
| **$H_0$** (Sàng lọc Sớm Ma sát) | `FR-02`, `FR-03` | `NFR-01`, `NFR-03` | [Scenario_&_Scoring_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Scenario_&_Scoring_Spec.md)<br>[Task_Engine_Architecture.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Task_Engine_Architecture.md) | `src/engine/TaskEngineRunner.tsx`<br>`src/engine/archetypes/TriageClassifier.tsx` |
| **$H_2$** (Thực chứng vs Trắc nghiệm) | `FR-04`, `FR-05` | `NFR-01`, `NFR-02` | [Scenario_&_Scoring_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Scenario_&_Scoring_Spec.md) | `src/engine/TelemetryBus.ts`<br>`src/engine/ScoringEngine.ts` |
| **$H_1$** (Phá vỡ Định kiến Trường Top) | `FR-06` | `NFR-03`, `NFR-06` | [Data_Schema_&_Seed_Data.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Data_Schema_&_Seed_Data.md)<br>[UI_UX_Wireframe_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/UI_UX_Wireframe_Spec.md) | `src/components/BlindMatchingCards.tsx` |
| **$H_3$** (Đồng thuận Gia đình) | `FR-07`, `FR-08`, `FR-09` | `NFR-02`, `NFR-05` | [UI_UX_Wireframe_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/UI_UX_Wireframe_Spec.md)<br>[Data_Schema_&_Seed_Data.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Data_Schema_&_Seed_Data.md) | `src/components/ParentAlignmentKit.tsx`<br>`src/styles/print.css` |

---

## 6. Kế hoạch Nghiệm thu Kỹ thuật (Technical Acceptance Criteria)

Phiên bản MVP được coi là hoàn thành khi vượt qua 5 bài kiểm tra nghiệm thu độc lập:
1. **Pass Test Kịch bản:** Học sinh thực hiện thành công chuỗi Task 1 (90s) và Task 2 (3.5 phút) không xuất hiện lỗi JavaScript trên Console trình duyệt.
2. **Pass Test Sàng lọc Sớm:** Cố ý bấm sai và thao tác $<1.2$s/lần ở Task 1 phải kích hoạt chính xác màn hình Early Exit và dừng bài test.
3. **Pass Test Tính toán Vector:** Điểm 3 trục năng lực và danh sách Blind Matching phản ánh đúng công thức toán học và dữ liệu seed trong file cấu hình.
4. **Pass Test Reveal:** Tên trường và mức học phí chỉ xuất hiện sau khi người dùng bấm chọn thẻ chương trình và nhấn nút mở khóa.
5. **Pass Test In ấn:** Bấm nút In trên trình duyệt cho ra bản in hoặc file PDF A4 đúng 2 cột, không bị vỡ khung hoặc mất nội dung bảng tính chi phí rủi ro.

