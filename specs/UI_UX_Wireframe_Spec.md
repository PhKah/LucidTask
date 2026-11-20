# ĐẶC TẢ GIAO DIỆN & HỆ THỐNG THIẾT KẾ (UI_UX_Wireframe_Spec.md)
**Dự án:** LucidTask — Nền tảng Hướng nghiệp & Trải nghiệm Tác vụ Thực chứng  
**Hệ thống Thiết kế Nền tảng:** Tích hợp trực tiếp Design System từ [.AGENTS/DESIGN.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/.AGENTS/DESIGN.md)  
**Phong cách chủ đạo:** Editorial & Workplace Console — Mặt phẳng giấy trắng nghiêm túc, mật độ thông tin cao, tương phản rõ rệt, không đổ bóng màu mè  
**Phiên bản:** 2.0 (Design Token & Component Alignment)  

---

## 1. Bản Đồ Ánh Xạ Design Tokens (Design Tokens Mapping)

Toàn bộ giao diện của LucidTask kế thừa và ánh xạ 1-1 từ bộ token định nghĩa trong [.AGENTS/DESIGN.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/.AGENTS/DESIGN.md):

### 1.1. Bảng Màu Hệ Thống (Color Palette)

| Tên Token | Mã Hex | Vai trò ứng dụng trong LucidTask |
| :--- | :--- | :--- |
| `colors.primary` | `#fa9000` *(Cam Hổ Phách)* | **Dấu ấn Nhận diện (Identity):** Khối logo LucidTask, thanh vạch đánh dấu đầu mục (eyebrow bar 8px), chỉ báo trạng thái kích hoạt (active stepper). Tuyệt đối không dùng làm màu nền nút bấm tương tác. |
| `colors.live-red` | `#c31833` *(Đỏ Báo Động)* | **Trạng thái Khẩn cấp & Áp lực Giờ G:** Nhãn cảnh báo sự cố `P1 / KHẨN CẤP`, đồng hồ đếm ngược khi $\le 60$ giây, viền nhấp nháy khi xảy ra đứt gãy hệ thống. |
| `colors.ink` | `#000000` *(Đen Mực)* | **Nút bấm Hành động Chính (Black Pills):** Nền của nút nộp bài, mở khóa trường học, tiêu đề chính cấp cao. |
| `colors.charcoal` | `#333333` *(Xám Than)* | **Nội dung Văn bản Thường:** Nội dung nhật ký log, mô tả công việc, câu hỏi tình huống. |
| `colors.slate` | `#595959` *(Xám Phiến)* | **Thông tin Phụ trợ (Metadata):** Nhãn thời gian, đường viền ô nhập liệu, các số liệu thống kê phụ. |
| `colors.canvas` | `#ffffff` *(Trắng Giấy)* | **Nền Giao diện Chính:** Nền toàn trang làm việc, nền thẻ tin, nền trắng chuẩn khi in báo cáo A4. |
| `colors.soft` | `#f0f0f0` *(Xám Dịu)* | **Nền Vùng Phụ trợ:** Nền thẻ tóm tắt sổ tay quy tắc, nền bảng tính chi phí rủi ro trong báo cáo phụ huynh. |
| `colors.hairline` | `#d8d8d8` *(Đường Kẻ Mảnh)* | **Phân tách Cấu trúc:** Đường kẻ chia 2 cột báo cáo, đường viền thẻ danh sách sự cố. Thay thế hoàn toàn cho bóng đổ (drop-shadow). |
| `colors.silver` | `#bebebe` *(Bạc Trục)* | **Trục Tiến trình:** Đường nối các mốc thời gian và thanh tiến trình Stepper. |
| `colors.night-navy` | `#100e2f` *(Xanh Đêm)* | **Thanh Tiện ích Cấp cao:** Header điều hướng bài test, thanh trạng thái Telemetry ngầm. |

---

### 1.2. Thang Đo Kiểu Chữ (Typography — Roboto Stack)

Toàn bộ hệ thống sử dụng duy nhất font chữ **Roboto** (Google Font mã nguồn mở):
- **`typography.headline-xl` (40px / 700 / 1.2):** Tiêu đề trang Báo cáo Đồng thuận A4, điểm số tổng kết to.
- **`typography.headline-md` (24px / 700 / 1.3):** Tiêu đề nhiệm vụ, tên chương trình đào tạo trên thẻ Blind Matching.
- **`typography.headline-sm` (18px / 700 / 1.35):** Tiêu đề từng thẻ sự cố, tiêu đề cột so sánh.
- **`typography.section-eyebrow` (24px / 300 / 1.2):** Tiêu đề phân mục viết hoa (UPPERCASE) đứng sau thanh vạch cam 8px (ví dụ: `▌ CHẶNG 1: SƠ TUYỂN MA SÁT`).
- **`typography.label-black` (14px / 900 / 1.0):** Nhãn khẩn cấp viết hoa có độ nặng tối đa (`[LIVE]`, `[P1 - CRITICAL]`, `[HẾT GIỜ]`).
- **`typography.body` (16px / 400 / 1.5):** Nội dung mô tả sự cố, tài liệu sổ tay.
- **`typography.body-sm` (14px / 400 / 1.45):** Dữ liệu metadata, chú thích mức lương, thông số kỹ thuật.
- **`typography.caption` (12px / 400 / 1.4):** Mốc thời gian timestamp, nguồn trích dẫn số liệu thị trường.
- **`typography.button` (16px / 400 / 1.0):** Nhãn chữ màu trắng bên trong các nút bấm black pill.

---

### 1.3. Quy Chuẩn Bo Góc & Thành Phần (Shapes & Components)

- **Bo góc nút bấm (`rounded.lg` — 18px):** Nút bấm chính có dạng **Black Pill Capsule** (`button-pill-dark`: nền `#000000`, chữ trắng, bo góc 18px, padding 8px 20px).
- **Bo góc thẻ (`rounded.md` — 10px):** Thẻ sự cố, thẻ chương trình Blind Matching dùng góc bo 10px kết hợp viền mảnh 1px `#d8d8d8`.
- **Badge khẩn cấp (`rounded.xs` — 2px):** Huy hiệu `[P1]`, `[LIVE]` chỉ bo nhẹ 2px, nền đỏ `#c31833` chữ trắng để giữ vẻ sắc lạnh của tin tức khẩn cấp.
- **Không dùng hiệu ứng đổ bóng (Zero Elevation):** Tạo sự ngăn cách bằng đường kẻ `#d8d8d8` và độ tương phản nền `#ffffff` vs `#f0f0f0`.

---

## 2. Đặc tả Giao diện Chi tiết Áp Dụng Design System

### Màn hình 1: Không gian Làm việc Giả lập — Diegetic UI & Neo-Brutalism (Task Workspace)

Giao diện Màn hình 1 hỗ trợ chế độ **Diegetic UI (Màn hình công việc thu nhỏ)** kết hợp phong cách **Neo-Brutalism** (viền đen sắc nét, tương phản cao) và **Hệ thống 3 Thanh Chỉ Số Đánh Đổi (Trade-off Bars)** luôn hiện diện trên đỉnh màn hình:

```
+-----------------------------------------------------------------------------+
| [NAV-BAR: Nền #100e2f (night-navy), Chữ trắng, Chiều cao 48px]              |
| [LOGO CAM #fa9000] LUCIDTASK | Kỹ thuật Phần mềm | [● Telemetry Active]     |
+-----------------------------------------------------------------------------+
| TIẾN TRÌNH: [● Chặng 1: Kiểm duyệt SOP] ──#bebebe── [○ Chặng 2: War Room]  |
+-----------------------------------------------------------------------------+
| HỆ THỐNG 3 THANH CHỈ SỐ ĐÁNH ĐỔI (3 TRADE-OFF BARS - Biến động tức thì):   |
| [🎯 CHẤT LƯỢNG: ████████░░ 80%] [💬 SẾP/KHÁCH: ███████░░░ 70%] [⚡ GIỜ G: 01:12]|
+------------------------------------+----------------------------------------+
| 📌 BẢNG QUY ĐỊNH SOP 3 DÒNG (Ghim) | 🗂️ BÀN KIỂM DUYỆT / THẺ QUẸT DIEGETIC  |
| Viền Neo-Brutalist 2px #000000     | (Cảm hứng Papers, Please & Reigns)     |
|                                    |                                        |
| 1. TIMEOUT / UNREACHABLE           | +------------------------------------+ |
|    => Đóng dấu [LỖI KẾT NỐI]       | | PHIẾU ĐƠN HÀNG / LOG #04           | |
| 2. NULL / INVALID / GIÁ ÂM         | | Badge: [KHẨN CẤP - #c31833]        | |
|    => Đóng dấu [LỖI DỮ LIỆU]       | | "Đơn trà sữa #882: Treo cổng thanh | |
| 3. Làm ẩu < 1.2s sẽ bị Sếp khiển   | |  toán TIMEOUT sau 30 giây chờ OTP" | |
|    trách & tụt thanh Hài lòng!     | +------------------------------------+ |
|                                    |                                        |
| 💬 KHUNG CHAT CÔNG VIỆC (Zalo/Slack)| [ ⬅️ ĐÓNG DẤU: LỖI KẾT NỐI (Phím A) ] |
| • Sếp: "Đơn đang ứ đọng, rà kỹ     | [ ➡️ ĐÓNG DẤU: LỖI DỮ LIỆU (Phím D) ] |
|   theo 3 dòng quy định nhé em!"    | (Hỗ trợ Quẹt thẻ trái/phải & Phím tắt) |
+------------------------------------+----------------------------------------+
| GHI CHÚ CHÂN TRANG: Mọi quyết định đều có sự đánh đổi giữa Tốc độ & Độ chuẩn|
+-----------------------------------------------------------------------------+
```

#### 2.1. Sáu Quy Chuẩn Tương Tác Bàn Làm Việc Đúc Kết Từ Thực Nghiệm Subagent (Áp dụng cho mọi ngành mới)
1. **Bề mặt Sổ tay Nghề nghiệp (*Diegetic Ledger Surface*):** Khung chứng từ sử dụng nền giấy kem ấm (`#FAF5E8`), đường kẻ mảnh (`#D8CFAF`), lề đỏ bên trái, kết hợp hai cực màu đối ứng: Xanh dương dịu (`#EBF2FA` / chữ `#2B5B84`) cho khay **NỢ / Hiện trạng** và Hồng san hô (`#FBECE9` / chữ `#8C3B2B`) cho khay **CÓ / Giải pháp đối ứng**.
2. **Tương tác Chạm Dòng Lỗi (*Spot-the-Flaw Hit Targets*):** Mỗi dòng trên chứng từ là một vùng chạm tương tác độc lập. Người chơi chạm trực tiếp vào dòng sai để trả hồ sơ về cho đồng nghiệp, hoặc bấm nút **`Hợp lệ ✓`** nếu tất cả các dòng đều đúng.
3. **Lắp ghép Không Gõ Phím (*Zero-Typing Chip-to-Slot*):** Khi chuyển sang bước xử lý/định khoản, người chơi chạm chọn **Thẻ nghiệp vụ** đặt vào 2 khay đối ứng và chạm chọn **Chip số liệu/bằng chứng** được trích xuất sẵn từ chứng từ gốc (không bắt gõ bàn phím thủ công).
4. **Pipeline 3 Bước Thu Gọn Ngay Trên Bàn (`1 · Kiểm tra` $\rightarrow$ `2 · Xử lý` $\rightarrow$ `3 · Ghi sổ`):** Khi chứng từ qua bước 1, tờ chứng từ tự thu gọn thành một dải tóm tắt ở phía trên để nhường diện tích cho 2 khay cân bằng ở bước 2.
5. **Hàng Đợi Đồng Nghiệp Cá Tính Hóa (*Persona Queue*):** Đồng nghiệp xếp hàng ở mép trên bàn làm việc kèm thanh kiên nhẫn xanh lá rút dần (Sếp có thanh kiên nhẫn ngắn nhất) và 2 huy hiệu xung đột **🛡️ Uy tín** vs **❤️ Thiện cảm**.
6. **Ghi Chú Dán Trước Ca (*Just-in-Time Sticky Notes*) & Ca Tập Chỉ Tay (*Spotlight Onboarding*):** Chỉ hiển thị 2 ghi chú quy tắc trọng tâm ngay trước ca trực cùng chế độ khoanh sáng (Spotlight) hướng dẫn 2–3 hồ sơ đầu tiên.

---

### Màn hình 2: Thẻ Blind Matching (Chế độ Ẩn danh & Lộ diện)

```
+-----------------------------------------------------------------------------+
| ▌ KẾT QUẢ ĐỐI SOÁT CHƯƠNG TRÌNH ĐÀO TẠO (Vạch Cam #fa9000 + Roboto 300)     |
| Danh tính trường đã được ẩn để đánh giá khách quan dựa trên môn học thực tế |
+-----------------------------------------------------------------------------+
|                                                                             |
| +-----------------------------------+ +-----------------------------------+ |
| | THẺ CHƯƠNG TRÌNH ALPHA            | | THẺ CHƯƠNG TRÌNH BETA             | |
| | Nền: #ffffff, Viền: 1px #d8d8d8   | | Nền: #ffffff, Viền: 1px #d8d8d8   | |
| |                                   | |                                   | |
| | TƯƠNG THÍCH: [ 91% ] (Headline-lg)| | TƯƠNG THÍCH: [ 84% ]              | |
| |                                   | |                                   | |
| | HUY HIỆU NĂNG LỰC:                | | HUY HIỆU NĂNG LỰC:                | |
| | [Kỷ luật Thao tác: 92/100]        | | [Tư duy Thuật toán: 88/100]       | |
| |                                   | |                                   | |
| | 3 TRỤ CỘT ĐÀO TẠO THỰC CHIẾN:     | | 3 TRỤ CỘT ĐÀO TẠO THỰC CHIẾN:     | |
| | • Kiến trúc Phân tán Chịu tải cao | | • Toán Thống kê & Máy học         | |
| | • Đảm bảo Chất lượng & Gỡ lỗi (QA)| | • Khai phá Dữ liệu Lớn            | |
| | • Đồ án Doanh nghiệp Cloud        | | • Trực quan hóa Báo cáo           | |
| |                                   | |                                   | |
| | MỨC LƯƠNG KHỞI ĐIỂM:              | | MỨC LƯƠNG KHỞI ĐIỂM:              | |
| | 13 - 20 triệu VNĐ / tháng         | | 14 - 22 triệu VNĐ / tháng         | |
| |                                   | |                                   | |
| | [BUTTON-PILL-DARK: CHỌN THẺ NÀY]  | | [BUTTON-PILL-DARK: CHỌN THẺ NÀY]  | |
| +-----------------------------------+ +-----------------------------------+ |
|                                                                             |
| +-------------------------------------------------------------------------+ |
| | [ NÚT TRUNG TÂM: BUTTON-PILL-DARK (Lg 18px), Nền #000000, Chữ trắng ]   | |
| | >>> MỞ KHÓA THÔNG TIN TRƯỜNG & TIẾN VÀO BÁO CÁO GIA ĐÌNH <<<            | |
| +-------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------+
```

---

### Màn hình 3: Báo cáo Đồng thuận Gia đình (2 Cột Đối chiếu A4)

```
+-----------------------------------------------------------------------------+
| BÁO CÁO ĐỒNG THUẬN ĐỊNH HƯỚNG NGHỀ NGHIỆP LUCIDTASK                         |
| Tiêu đề: Headline-xl (700 Ink #000000) | Mã phiên: #LT-8812 (Caption Slate) |
| Đường kẻ ngăn cách tiêu đề: 2px Hairline #d8d8d8                            |
+-------------------------------------+---------------------------------------+
| ▌ CỘT 1: NĂNG LỰC THỰC CHỨNG CON    | ▌ CỘT 2: THỊ TRƯỜNG & CHI PHÍ RỦI RO  |
| (Dữ liệu Telemetry qua 2 Chặng)     | (Nguồn: TopCV & Bộ GD&ĐT trích dẫn)   |
|                                     |                                       |
| 1. Điểm số 3 Trục Năng lực:         | 1. Dải Thu nhập 5 Năm Đầu:            |
|    • Tư duy Logic:        88/100    |    • 0-2 năm: 10.5 - 18 triệu/tháng   |
|    • Kiên nhẫn Chi tiết: 92/100    |    • 3-5 năm: 22.0 - 45 triệu/tháng   |
|    • Sức bền Giờ G:       75/100    |                                       |
|                                     | 2. Rủi ro Trí tuệ Nhân tạo (AI):      |
| 2. Bằng chứng Hành vi Khách quan:   |    • Mức độ: TRUNG BÌNH (Slate #595959)
|    - Đọc kỹ sổ tay 28s trước làm.   |    • Nhận định: AI thay thế thợ gõ    |
|    - Tỷ lệ bắt đúng mã log: 94%.    |      code cơ bản. Năng lực kiểm thử   |
|    - Giữ vững tốc độ ở phút chót.   |      và tư duy hệ thống (điểm mạnh    |
|                                     |      của con) giữ giá trị bền vững.   |
|                                     |                                       |
|                                     | 3. Bảng Chi phí Rủi ro Chọn sai Ngành:|
|                                     |    Nền thẻ: #f0f0f0 (soft)            |
|                                     |    • Học phí lãng phí: 45.000.000 đ   |
|                                     |    • Sinh hoạt phí:    60.000.000 đ   |
|                                     |    • Chi phí cơ hội:   80.000.000 đ   |
|                                     |    => TỔNG LÃNG PHÍ: ~185 TRIỆU VNĐ   |
+-------------------------------------+---------------------------------------+
| ▌ VÙNG ĐỒNG THUẬN GIA ĐÌNH (ALIGNMENT ZONE - Khung viền 1px Hairline #d8d8d8)|
| "Khuyến nghị khách quan: Con có năng lực thực chứng vượt trội ở tính cẩn     |
| thận và tư duy gỡ lỗi. Gia đình nên ủng hộ con chọn ngành Kỹ thuật Phần mềm |
| tại trường Đại học Bách Khoa (độ phù hợp 91%)."                             |
|                                                                             |
| 3 CÂU HỎI ĐỐI THOẠI BỮA TỐI GIA ĐÌNH:                                       |
| 1. "Con cảm thấy thế nào khi ngồi rà soát từng dòng lỗi log trong bài test?"|
| 2. "Mức học phí 32 triệu/năm của trường Bách Khoa có phù hợp ngân sách nhà?"|
| 3. "Con sẵn sàng cam kết tự học thêm tiếng Anh chuyên ngành từ hè này chứ?" |
+-----------------------------------------------------------------------------+
| [BUTTON-PILL-DARK: IN BÁO CÁO A4 (PDF)] | [BUTTON-PILL-DARK: CHIA SẺ ZALO]  |
+-----------------------------------------------------------------------------+
```

---

## 3. Quy Chuẩn CSS Khi Xuất File PDF / In Ấn (Print Optimization)

Giao diện in ấn kế thừa trực tiếp phong cách in báo flat-white của Al Jazeera:
- `@media print`:
  - Ẩn hoàn toàn navbar xanh `#100e2f`, các nút bấm tương tác, và chân trang web.
  - Ép màu nền thành trắng tuyệt đối (`#ffffff`), chữ đen `#000000` và `#333333` để độ tương phản tối đa trên giấy in máy laser gia đình.
  - Giữ nguyên vạch cam `#fa9000` (8px $\times$ 24px) trước các tiêu đề phân mục để báo cáo có tính nhận diện thương hiệu sang trọng.
  - Kích thước căn chỉnh chuẩn lề 15mm vừa khít khổ giấy A4 Portrait mà không bị rớt trang.
