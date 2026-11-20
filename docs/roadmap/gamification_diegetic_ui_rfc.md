# TÀI LIỆU ĐẶC TẢ Ý TƯỞNG & ĐỀ XUẤT NÂNG CẤP (RFC): GAMIFIED DIEGETIC UI WORKPLACE SIMULATOR

**Mã tài liệu:** `RFC-2026-GAMIFY-01`  
**Dự án:** LucidTask — Nền tảng Hướng nghiệp & Trải nghiệm Tác vụ Thực chứng  
**Chủ đề:** Chuyển đổi mô hình tương tác từ "Trắc nghiệm hóa (Multiple Choice)" sang "Giao diện Giả lập Nhập vai (Diegetic UI) & Game Hóa Siêu Tốc (Micro-Simulator)"  
**Trạng thái:** `PROPOSED & ARCHIVED FOR IMPLEMENTATION`  
**Ngày lưu trữ:** 2026-11-20  

---

## 1. Bối Cảnh & Vấn Đề Cốt Lõi (Problem Statement)

### 1.1. Thực trạng phiên bản ban đầu
Giao diện Chặng 1 (`TriageClassifier`) và Chặng 2 (`MultiSourceInspector`) dù có hạ tầng Telemetry đo lường ngầm mạnh mẽ, nhưng về mặt **trải nghiệm cảm nhận (UX Perception)** lại có nguy cơ bị người dùng và học sinh xem là:
- Chặng 1: 1 thẻ văn bản lỗi + 2 nút chọn $\rightarrow$ Tương đương câu hỏi trắc nghiệm nhị phân (True/False).
- Chặng 2: 3 tab văn bản + 4 radio button + nút submit $\rightarrow$ Tương đương câu hỏi trắc nghiệm A/B/C/D.

### 1.2. Hậu quả
- **Mất tính hấp dẫn đối với Gen Z:** Học sinh cảm thấy như đang làm một bài kiểm tra kiến thức khô khan trên trường.
- **Triệt tiêu lợi thế cạnh tranh (Moat):** Không tạo ra được sự khác biệt áp đảo so với các bài trắc nghiệm tính cách Holland / MBTI truyền thống.
- **Đòi hỏi kiến thức chuyên môn không cần thiết:** Nếu sử dụng thuật ngữ lập trình hàn lâm (SQL, cú pháp code, SSL handshake), học sinh THPT sẽ thất bại vì thiếu kiến thức chứ không phải vì không hợp tố chất nghề nghiệp.

---

## 2. Trụ Cột Đổi Mới Thiết Kế Trải Nghiệm (Core Design Pillars)

### 2.1. Phong cách Giao diện Diegetic UI (Màn hình công việc thu nhỏ)
*Cảm hứng thiết kế từ các tựa game đình đám: **Papers, Please**, **Simulacra**, **Reigns**, **Orwell**.*
- Toàn bộ màn hình thiết bị biến thành **không gian làm việc thực thụ của nhân vật**:
  - **Khung chat công việc (Zalo / Slack / Teams simulation):** Nhận tin nhắn dồn dập, phàn nàn từ khách hàng, lệnh khẩn cấp từ sếp.
  - **Bàn kiểm duyệt / Hồ sơ thực tế:** Hóa đơn, chứng từ, văn bản hợp đồng rút gọn với cơ chế đóng dấu `[DUYỆT]` / `[TỪ CHỐI]` / `[BÁO LỖI]`.
  - **Cơ chế Thẻ quẹt (Card-Swipe kiểu Reigns):** Tình huống xuất hiện ở trung tâm; học sinh vuốt trái hoặc vuốt phải để ra quyết định tức thì.

### 2.2. Hệ Thống 3 Thanh Chỉ Số Đánh Đổi (Trade-off Bars)
Biến quá trình làm việc thành "Game cân não" thông qua 3 thanh tài nguyên liên tục biến động:
1. **Thanh 1: Chất Lượng / Độ Chính Xác (Quality / Accuracy):** Tăng khi tuân thủ quy tắc, giảm khi làm ẩu.
2. **Thanh 2: Sự Hài Lòng Của Sếp / Khách Hàng (Stakeholder Satisfaction):** Phản ứng trực tiếp với các quyết định chiều khách hay làm theo quy trình.
3. **Thanh 3: Thời Gian / Sức Bền Giờ G (Time / Pressure / Sanity):** Tụt dần theo thời gian thực hoặc dao động khi gặp sự cố bất ngờ.
> **Ý nghĩa triết lý:** Giúp học sinh thấu hiểu bản chất lao động: *Không có phương án hoàn hảo trong công việc, mọi quyết định đều phải đánh đổi giữa chất lượng, lòng tin và thời gian.*

### 2.3. Phong cách Thẩm mỹ Neo-Brutalism
- Viền đen đậm 2px (`border-2 border-black`), đổ bóng thô (`shadow-[4px_4px_0px_0px_#000]`), khối màu tương phản mạnh (trắng, đen, cam `#fa9000`, đỏ `#c31833`).
- Tối ưu tải siêu tốc, không cần vẽ asset 3D nặng nề, phù hợp thị hiếu hiện đại của Gen Z.
- Micro-interactions: Âm thanh *ting-ting* tin nhắn dồn dập, rung chấn nhẹ khi chọn sai, viền nhấp nháy báo động khi thanh chỉ số tụt nguy cấp.

---

## 3. Thiết Kế Tình Huống: Bỏ Kiến Thức Hàn Lâm — Giữ Nguyên Cơ Chế Lao Động

Nguyên tắc: **Loại bỏ 100% thuật ngữ chuyên sâu, nhưng giữ nguyên 100% cấu trúc tư duy, tính lặp lại và sự ma sát của công việc.**

### 3.1. Cơ chế "Đề mở có Sổ tay quy định 3 dòng" (Rulebook Mechanics)
Không bắt học sinh nhớ luật hay cú pháp. Cung cấp một bảng quy định (SOP) ngắn 3 gạch đầu dòng ghim ngay góc màn hình. Học sinh đối soát nhanh dưới áp lực thời gian để đo lường độ tỉ mỉ và tính kỷ luật.

### 3.2. Đưa bài toán chuyên môn về bối cảnh đời thường gần gũi

| Ngành Nghề | Thiết Kế SAI (Quá chuyên môn) | Thiết Kế ĐÚNG (Bản chất lao động — Không cần kiến thức nền) | Năng Lực Đo Lường Khách Quan |
| :--- | :--- | :--- | :--- |
| **Khoa học Dữ liệu / CNTT** | Bắt viết câu lệnh SQL truy vấn hoặc sửa lỗi cú pháp Python. | Danh sách 30 đơn hàng quán trà sữa bị lỗi nhập liệu (sai ngày, trùng tên, giá âm); rà soát và gắn thẻ theo 3 quy tắc trong 90s. | Sự kiên nhẫn với dữ liệu lặp lại; tư duy logic tìm quy luật lỗi. |
| **Luật Kinh tế** | Hợp đồng thương mại 5 trang toàn điều luật chuyên sâu. | Bảng "Quy định công ty" 3 dòng. Đọc nhanh 4 đoạn thỏa thuận ca sĩ ngắn (5 dòng) và bấm chọn câu chữ có bẫy (như mập mờ điều khoản phạt đền). | Khả năng đọc kỹ câu chữ; sự nhạy bén phát hiện rủi ro văn bản. |
| **Marketing & Truyền thông** | Bắt tính chỉ số ROAS, CAC và lập kế hoạch Facebook Ads B2B. | Ngân sách 10 triệu kéo khách sự kiện trường. Sếp nhắn tin dồn dập đòi vừa đông vừa sang. Vuốt thẻ lựa chọn đánh đổi (thuê KOL nhanh tốn tiền vs tự làm nội dung rẻ nhưng ít view). | Tư duy tối ưu nguồn lực; khả năng chịu áp lực từ các yêu cầu trái ngược. |

---

## 4. Ánh Xạ Vào Động Cơ Telemetry & Scoring Engine Của LucidTask

| Thành Phần Giao Diện Mới | Sự Kiện Telemetry Tương Ứng | Trục Năng Lực Đo Lường |
| :--- | :--- | :--- |
| **Hóa đơn / Thẻ quẹt (Card Swipe / Stamp)** | `item_classified` `{ target_id, latency_ms }` | $S_{\text{Logic}}$ (Độ chính xác quy tắc) |
| **Tra cứu Sổ tay 3 dòng (SOP Peek)** | `handbook_viewed` `{ duration_ms }` | $S_{\text{Patience}}$ (Tính cẩn trọng trước khi hành động) |
| **Biến động 3 thanh Trade-off** | `pacing_stability`, `tradeoff_balance_score` | $S_{\text{Patience}}$ (Khả năng cân bằng lợi ích) |
| **Phản ứng khi Sếp giục / Còi báo động Giờ G** | `stress_spike_entered`, `panic_click_flag` | $S_{\text{Resilience}}$ (Sức bền tâm lý dưới áp lực) |

---

## 5. Kết Luận
Bản RFC này được lưu trữ làm **kim chỉ nam cho việc cải tiến trải nghiệm người dùng giai đoạn tiếp theo**, đảm bảo LucidTask không chỉ vượt trội về mặt toán học và phương pháp luận ĐMST, mà còn hấp dẫn, cuốn hút và mang tính giáo dục giải trí đỉnh cao.

