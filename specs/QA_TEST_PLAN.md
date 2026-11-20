# KẾ HOẠCH KIỂM THỬ & ĐẢM BẢO CHẤT LƯỢNG (QA & TEST SPECIFICATION)
**Dự án:** LucidTask — Nền tảng Hướng nghiệp & Trải nghiệm Tác vụ Thực chứng  
**Mục tiêu:** Định nghĩa toàn diện chiến lược kiểm thử phần mềm, bộ ca kiểm thử chuẩn (Unit/Integration/E2E) và Tiêu chuẩn Hoàn thành (Definition of Done — DoD)  
**Tầng đặc tả:** TẦNG 3 — KIỂM CHỨNG & ĐÁNH GIÁ (Eval & Quality Gates)  
**Tài liệu Yêu cầu Đi kèm:** [SRS.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/SRS.md) | [SOFTWARE_DESIGN_DOCUMENT.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/SOFTWARE_DESIGN_DOCUMENT.md)  
**Phiên bản:** 1.0 (Master QA Baseline)  

---

## 1. Chiến Lược Kiểm Thử (Testing Strategy & Tooling)

LucidTask áp dụng mô hình **Kim tự tháp Kiểm thử (Test Pyramid)** nhằm tối đa hóa tốc độ phản hồi và độ tin cậy trong chu trình CI/CD:

```
          / \
         /   \       E2E / UAT (10%)     --> Playwright / Manual Usability Protocol
        /     \
       /-------\     Integration (30%)   --> Vitest / React Testing Library (Component + State)
      /         \
     /-----------\   Unit Tests (60%)    --> Vitest (Scoring Engine, TelemetryBus, Cosine Match)
```

### Công cụ Kiểm thử Tiêu chuẩn:
- **Test Runner & Assertion:** `Vitest` (tốc độ thực thi cực nhanh trên nền Vite, hỗ trợ native TypeScript và ESM).
- **Component Testing:** `@testing-library/react` + `@testing-library/user-event` (mô phỏng chính xác thao tác click, drag, type của người dùng thực).
- **Code Coverage Engine:** `@vitest/coverage-v8` (ngưỡng tối thiểu: Line Coverage $\ge 80\%$, Branch Coverage $\ge 75\%$).
- **E2E & Print Layout Testing:** `Playwright` (kiểm tra luồng chuyển trang, CSS `@media print` và không rò rỉ DOM).

---

## 2. Tiêu Chuẩn Hoàn Thành (Definition of Done — DoD)

Một User Story / Task phát triển phần mềm chỉ được coi là **"HOÀN THÀNH" (Done)** và được phép merge vào nhánh `main` khi và chỉ khi vượt qua bảng kiểm soát chất lượng 7 điểm sau:

- [ ] **1. Code Quality & Linting:** 
  - Không có lỗi cảnh báo TypeScript (`tsc --noEmit` exit code 0).
  - Không vi phạm quy chuẩn ESLint / Prettier.
- [ ] **2. Test Coverage:** 
  - Có đầy đủ Unit test cho logic nghiệp vụ mới.
  - Toàn bộ test suite chạy pass $100\%$ cục bộ và trên GitHub Actions.
  - Độ bao phủ mã nguồn (Code coverage) đạt $\ge 80\%$.
- [ ] **3. Invariant & Security Verification:** 
  - Đảm bảo Invariant: Tên trường và logo **không tồn tại trong DOM** ở chế độ `BLIND_MODE`.
  - Không thu thập thông tin định danh cá nhân (PII).
- [ ] **4. Responsive & Browser Verification:** 
  - Hiển thị chuẩn xác trên Chrome, Safari, Edge ở độ phân giải Desktop ($1440\times 900$) và Tablet ($1024\times 768$).
- [ ] **5. Performance Verification:** 
  - Độ trễ bắt Telemetry $\le 50\text{ms}$.
  - Thời gian khởi tạo task $\le 1.0\text{s}$.
- [ ] **6. Peer Code Review:** 
  - Được ít nhất **1 thành viên trong nhóm review và approve** trên GitHub Pull Request.
- [ ] **7. Documentation Synchronization:** 
  - Nếu thay đổi logic, đã cập nhật tương ứng vào các file đặc tả trong `specs/` theo đúng nguyên tắc SSOT.

---

## 3. Ma Trận Ca Kiểm Thử Tự Động (Automated Test Cases Matrix)

### 3.1. Nhóm Kiểm Thử Đơn Vị (Unit Tests — Logic Toán học & Động cơ)

| Mã Test Case | Mô tả Mục tiêu Kiểm thử | Dữ liệu Đầu vào (Mock Data) | Kết quả Mong đợi (Assertions) | File Test Tương ứng |
| :--- | :--- | :--- | :--- | :--- |
| **`UT-SCORE-01`** | Tính chính xác chỉ số $S_{\text{Logic}}$ khi giải đúng 100% không suy diễn thừa. | `accuracy = 1.0`, `optimalPath = 1.0`, `handbookMastery = 1.0`. | `calculateLogicScore(...) === 100.0`. | `tests/unit/scoring.test.ts` |
| **`UT-SCORE-02`** | Phạt điểm $S_{\text{Resilience}}$ khi tỷ lệ lỗi tăng vọt ở 60s cuối và có click hoảng loạn. | `errorRateStress = 0.5`, `errorRateNormal = 0.1`, `panicClicks = 5`. | `calculateResilienceScore(...) <= 36.0`. | `tests/unit/scoring.test.ts` |
| **`UT-COSINE-01`** | So khớp Cosine giữa 2 vector trùng phương phải đạt 100%. | $\vec{V}_1 = (0.5, 0.3, 0.2)$, $\vec{V}_2 = (0.5, 0.3, 0.2)$. | `computeCosineMatch(V1, V2) >= 0.999`. | `tests/unit/matching.test.ts` |
| **`UT-COSINE-02`** | So khớp giữa 2 vector vuông góc phải đạt 0%. | $\vec{V}_1 = (1.0, 0, 0)$, $\vec{V}_2 = (0, 1.0, 0)$. | `computeCosineMatch(V1, V2) === 0.0`. | `tests/unit/matching.test.ts` |
| **`UT-GATE-01`** | Kích hoạt Early Exit khi tỷ lệ chính xác $< 60\%$. | 8 items: 4 sai, 4 đúng $\implies$ accuracy $= 50\%$. | `shouldTriggerEarlyExit(...) === true`. | `tests/unit/gatekeeper.test.ts` |
| **`UT-GATE-02`** | Kích hoạt Early Exit khi thao tác quá nhanh $< 1.2$s/thao tác. | 8 items: tốc độ TB $= 0.9$s/item. | `shouldTriggerEarlyExit(...) === true`. | `tests/unit/gatekeeper.test.ts` |
| **`UT-GATE-03`** | Không kích hoạt Early Exit khi học sinh cẩn thận (accuracy $\ge 75\%$, speed $\ge 2.5$s). | 8 items: 7 đúng, 1 sai, tốc độ TB $= 3.5$s. | `shouldTriggerEarlyExit(...) === false`. | `tests/unit/gatekeeper.test.ts` |
| **`UT-BUS-01`** | TelemetryBus ghi nhận đúng payload và timestamp. | Publish event `handbook_viewed` với `{ duration_ms: 12400 }`. | `eventQueue.length === 1`, payload giữ nguyên vẹn. | `tests/unit/telemetryBus.test.ts` |

---

### 3.2. Nhóm Kiểm Thử Tích Hợp (Integration Tests — Component & State)

| Mã Test Case | Thành phần Tương tác | Kịch bản Thao tác Giả lập | Kết quả Mong đợi (Assertions) |
| :--- | :--- | :--- | :--- |
| **`IT-WORK-01`** | `TaskEngineRunner` + `TriageClassifier` | Render giao diện Chặng 1 ngành IT. Kéo thả 1 thẻ lỗi kết nối vào Thùng 1. | • Giao diện cập nhật tiến độ `1/8`.<br>• TelemetryBus nhận 1 sự kiện `item_classified`. |
| **`IT-WORK-02`** | `CountdownTimer` + `TaskWorkspace` | Cho đồng hồ tua nhanh từ `01:05` xuống `00:59`. | • Viền đồng hồ chuyển sang màu đỏ `#c31833`.<br>• Thuộc tính `aria-live="polite"` được kích hoạt. |
| **`IT-BLIND-01`** | `BlindMatchingCards` (Chế độ ẩn danh) | Render 3 thẻ chương trình gợi ý từ dữ liệu mock. | • Thẻ hiển thị `% Tương thích` và `Môn học`.<br>• **Tìm kiếm chuỗi tên trường thật trong DOM trả về `null`**. |
| **`IT-REVEAL-01`** | `BlindMatchingCards` + Nút Mở khóa | Click chọn thẻ 1 $\rightarrow$ Click nút `[MỞ KHÓA TRƯỜNG]`. | • Trạng thái chuyển sang `REVEALED`.<br>• Tên trường "Đại học Bách Khoa" xuất hiện trong DOM. |

---

### 3.3. Nhóm Kịch Bản Kiểm Thử Người Dùng (UAT & E2E Test Scenarios)

| Mã Kịch Bản | Tên Kịch Bản UAT | Luồng Thực Thi Của Người Dùng | Tiêu Chí Đạt Chuẩn Nghiệm Thu |
| :--- | :--- | :--- | :--- |
| **`E2E-UAT-01`** | **Luồng Sàng Lọc Sớm (Early Exit Flow)** | 1. Vào trang chọn ngành IT.<br>2. Bắt đầu Chặng 1.<br>3. Click bừa liên tục $<1$s không đọc quy tắc.<br>4. Quan sát phản hồi. | • Hệ thống dừng trước 90s.<br>• Xuất hiện màn hình La bàn Tư vấn phân tích tính cách.<br>• Có nút `[Thử lại]` và `[Khám phá ngành khác]`. |
| **`E2E-UAT-02`** | **Luồng Hoàn Thành Chuỗi 2 Chặng & Xuất Báo Cáo** | 1. Vào làm bài cẩn thận Chặng 1 (đọc sổ tay 15s).<br>2. Chuyển tiếp mượt sang Chặng 2.<br>3. Điều tra sự cố, chọn Rollback bản 2.0.<br>4. Xem thẻ Blind Matching, bấm Mở khóa.<br>5. Bấm `[In Báo cáo A4]`. | • Cả 2 chặng hoàn thành không lỗi console.<br>• Mở khóa đúng tên trường.<br>• Báo cáo 2 cột hiển thị bảng tính rủi ro 185 triệu.<br>• Hộp thoại Print preview căn chỉnh vừa khổ A4 dọc. |

