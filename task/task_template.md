# [TASK-ID]: [TÊN NHIỆM VỤ RÕ RÀNG, HÀNH ĐỘNG CỤ THỂ]

**Mã Task:** `TASK-[PHASE]-[STT]` (Ví dụ: `TASK-P0-01`, `TASK-P1-02`)  
**Giai đoạn:** [Giai đoạn 0 | Giai đoạn 1 | Giai đoạn 2 | Giai đoạn 3 | Giai đoạn 4 | Giai đoạn 5]  
**Người thực hiện:** [Tên người thực hiện / AI Agent]  
**Slash Command / Action Khuyến nghị:** [`/plan` | `/boost` | `/goal` | `/browser` | `/teamwork` | `/grill-me`]  
**Trạng thái:** `DRAFT` | `IN_PROGRESS` | `TESTING` | `COMPLETED` | `BLOCKED`  
**Ngày bắt đầu:** YYYY-MM-DD  
**Ngày hoàn thành:** YYYY-MM-DD (hoặc Chưa hoàn thành)  

---

## 1. Mục Tiêu, Phạm Vi & Antigravity IDE Action

### 1.1. Mục tiêu cốt lõi
> *Mô tả súc tích trong 1-3 câu: Task này giải quyết bài toán gì, mang lại giá trị gì cho kiến trúc hoặc trải nghiệm người dùng cuối?*

### 1.2. Ranh giới phạm vi (Scope Boundary)
* **TRONG PHẠM VI (In-Scope):**
  - [ ] Hạng mục 1...
  - [ ] Hạng mục 2...
* **NGOÀI PHẠM VI (Out-of-Scope - Tuyệt đối không làm trong task này):**
  - Không giải quyết...
  - Không đụng chạm vào file/thành phần...

### 1.3. Hướng dẫn Lựa chọn Slash Command / Action Antigravity IDE
*Tùy vào đặc thù công việc của Task, lập trình viên/người điều phối kích hoạt lệnh chat phù hợp trong Antigravity IDE:*

| Lệnh Slash Command | Trường hợp áp dụng tối ưu | Mục đích với Task này |
| :--- | :--- | :--- |
| **`/plan`** | Task kiến trúc, cấu hình hoặc có nhiều phụ thuộc phức tạp | Lập kế hoạch chi tiết từng bước, rà soát phụ thuộc trước khi sinh code. |
| **`/boost`** | Task thuật toán lõi, động cơ tính điểm, bài toán kiểm thử khắt khe | Kích hoạt suy luận đa chiều sâu, tối ưu hóa thuật toán và xác minh nghiêm ngặt. |
| **`/goal`** | Task cần chạy xuyên suốt, tự động hóa chuỗi kiểm thử dài | Yêu cầu Agent tự động xử lý mọi lỗi build/test cho đến khi vượt qua 100% AC. |
| **`/browser`** | Task UI/UX, kiểm thử DOM Invariant, kiểm tra A4 Print Preview | Mở trình duyệt tương tác thực tế, kiểm tra visual layout và rò rỉ DOM. |
| **`/teamwork`** | Task quy mô lớn có thể tách thành các sub-agent độc lập | Phân tán nhiều Agent làm việc song song (ví dụ: làm 2 Archetypes cùng lúc). |
| **`/grill-me`** | Task có các quyết định thiết kế/kinh doanh còn phân vân | Agent phỏng vấn người dùng để chốt các chi tiết kỹ thuật/nghiệp vụ. |
| **`/compact`** | Hoàn thành một Sprint / chuyển giai đoạn | Thu gọn ngữ cảnh hội thoại, giải phóng bộ nhớ để bắt đầu task mới sạch sẽ. |

---

## 2. Tài Liệu & Dữ Liệu Đầu Vào (Inputs & Prerequisites)

### 2.1. Tài liệu đặc tả bắt buộc đọc (Mandatory Specs)
*Mọi logic triển khai phải có căn cứ truy xuất nguồn gốc (Traceability) từ các tài liệu trong [specs/](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs).*

| STT | Tài liệu cần đọc | Chương / Mục cụ thể | Yêu cầu / Tri thức cốt lõi cần trích xuất |
| :---: | :--- | :--- | :--- |
| 1 | `specs/[Tên_File.md]` | Mục X.Y (Trang/Dòng Z) | Mô tả ngắn nội dung phải tuân thủ |
| 2 | `specs/[Tên_File.md]` | Mục A.B | Mô tả ngắn ràng buộc kỹ thuật / schema |
| 3 | `.AGENTS/DESIGN.md` | Bảng màu / Typography / Components | Token giao diện, kích thước, hiệu ứng |

### 2.2. Tiền điều kiện & Trạng thái đầu vào (Preconditions)
- **Mã nguồn tiền đề:** Git branch `[tên_nhánh]`, commit `[hash_gần_nhất]`.
- **Môi trường & Package:** Đã cài đặt các gói dependencies cần thiết (Node version, npm packages).
- **Trạng thái dữ liệu:** (Ví dụ: Dữ liệu seed data hoặc Type definitions của task trước đã sẵn sàng).

---

## 3. Phân Rã Công Việc & Kiểm Định Từng Bước (Work Breakdown & Incremental Verification)

*Chia nhỏ công việc thành các bước tuần tự. Mỗi bước đều có phương thức kiểm định (Verification Step) ngay tại chỗ trước khi chuyển sang bước tiếp theo.*

### Bước 1: [Tên bước 1 - Ví dụ: Khởi tạo Interface / Types]
- [ ] **Hành động cụ thể:**
  - Viết file `...` định nghĩa các kiểu dữ liệu `...`
- [ ] **Kiểm định ngay tại chỗ (Immediate Verification):**
  - Chạy lệnh: `npm run type-check`
  - Kết quả kỳ vọng: 0 errors, kiểu dữ liệu xuất khẩu đầy đủ.

### Bước 2: [Tên bước 2 - Ví dụ: Hiện thực hóa logic nghiệp vụ lõi / Component]
- [ ] **Hành động cụ thể:**
  - Viết component/module `...`
  - Xử lý các trạng thái: Normal, Stress ($\le 60$s), Error, Empty.
- [ ] **Kiểm định ngay tại chỗ (Immediate Verification):**
  - Chạy lệnh: `npm test [file_test_liên_quan]`
  - Kết quả kỳ vọng: Logic chính hoạt động đúng kỳ vọng.

### Bước 3: [Tên bước 3 - Ví dụ: Viết Unit / Integration Test]
- [ ] **Hành động cụ thể:**
  - Viết test case bao phủ các trường hợp biên (Edge cases, Invariant checks).
- [ ] **Kiểm định ngay tại chỗ (Immediate Verification):**
  - Chạy lệnh: `npm run test:coverage`
  - Kết quả kỳ vọng: Coverage đạt chuẩn $\ge 80\%$.

---

## 4. Sản Phẩm Bàn Giao Đầu Ra (Outputs & Deliverables)

### 4.1. Danh mục file tạo mới / chỉnh sửa
* [ ] `src/...` : [Mô tả vai trò file]
* [ ] `src/...` : [Mô tả vai trò file]
* [ ] `tests/...` : [Mô tả bộ ca kiểm thử tương ứng]

### 4.2. Dữ liệu / Cấu hình sinh ra
- Exported Functions / Components: `...`
- Configs: `...`

---

## 5. Tiêu Chuẩn Chấp Nhận Định Lượng (Acceptance Criteria - AC)

*Toàn bộ các tiêu chí dưới đây phải được đánh dấu `[x]` thì task mới được coi là HOÀN THÀNH (Definition of Done).*

- [ ] **`AC-01` (Chức năng cốt lõi):** Hệ thống thực thi đúng 100% kịch bản mô tả trong đặc tả không phát sinh lỗi ngoại lệ.
- [ ] **`AC-02` (Tuân thủ UI/UX & Design Tokens):** Màu sắc, bo góc (pill 18px), font chữ (Roboto), hairline border (#d8d8d8) khớp 100% với `.AGENTS/DESIGN.md`.
- [ ] **`AC-03` (Bảo toàn Bất biến - Invariants):** Không vi phạm các nguyên tắc bất biến (Ví dụ: `IT-BLIND-01` tên trường thật không được lọt vào DOM trước khi reveal).
- [ ] **`AC-04` (Chỉ số Chất lượng Mã nguồn):**
  - `npm run type-check`: 0 errors.
  - `npm run lint`: 0 warnings/errors nghiêm trọng.
  - `npm run build`: Bundle thành công không bị thiếu import.
- [ ] **`AC-05` (Độ bao phủ Kiểm thử - Test Coverage):**
  - 100% ca kiểm thử liên quan PASS.
  - Line Coverage của module thực hiện đạt tối thiểu $\ge 80\%$.

---

## 6. Lệnh Kiểm Tra Nghiệm Thu (Quality Gate Commands)

```bash
# 1. Kiểm tra tĩnh kiểu dữ liệu & lint
npm run type-check

# 2. Chạy toàn bộ kiểm thử đơn vị & kiểm tra độ phủ
npm test -- [đường_dẫn_file_test] --coverage

# 3. Kiểm tra tính toàn vẹn khi đóng gói production
npm run build
```

---

## 7. Nhật Ký Thực Thi & Lưu Trữ Lịch Sử (Audit Log)

*Ghi lại tóm tắt quá trình thực hiện thực tế để lưu trữ vào thư mục `task/Log/`.*

| Thời gian | Người/Agent | Hành động thực hiện | Kết quả / Ghi chú | Commit Hash |
| :---: | :---: | :--- | :--- | :---: |
| YYYY-MM-DD HH:mm | ... | Khởi tạo task và đọc các file specs đầu vào | Đã đọc xong mục X, Y | - |
| YYYY-MM-DD HH:mm | ... | Hoàn thành code logic & test | Pass 100% test cases | `abcdef1` |

