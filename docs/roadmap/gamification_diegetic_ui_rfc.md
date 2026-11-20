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

## 4. Ánh Xạ Vào Động Cơ Telemetry, Khung Tâm Lý Học Big Five (OCEAN) & Holland RIASEC

### 4.1. Vòng Lặp Gợi Ý Micro-Task Thích Ứng (Adaptive Micro-Task Loop — Mốc 5 Micro-Tasks)
1. **Bước 1:** Người dùng chọn 1 Micro-Task trong thư viện ứng dụng (khuyến khích ưu tiên ngành nghề quan tâm nhất: *CNTT/Dữ liệu*, *Luật Kinh tế*, hoặc *Marketing Sự kiện*).
2. **Bước 2:** Người dùng thực hiện Micro-Task trên giao diện Diegetic UI và được hệ thống đánh giá ngầm qua hành vi thực tế.
3. **Bước 3:** Hệ thống tự động gợi ý các Micro-Task bổ sung để lấp khoảng trống dữ liệu và cải thiện độ chính xác của khuôn khổ đánh giá.
4. **Bước 4:** Khi người dùng tích lũy đủ tối thiểu **5 Micro-Tasks** (càng nhiều càng chính xác, đạt độ tin cậy thực chứng $\ge 95\%$), hồ sơ toàn diện Big Five + RIASEC đạt độ chín tối đa để xuất Báo cáo Đồng thuận A4.

### 4.2. Hai Nền Tảng Đánh Giá Khoa Học Chuẩn Quốc Tế
1. **Tầng 1 — Big Five (OCEAN) đo "Chất" làm việc qua hành vi thực chứng:**
   - **Tận tâm (*Conscientiousness*):** Mức độ kỷ luật, tuân thủ quy tắc SOP 3 dòng và sự tỉ mỉ khi rà soát đơn hàng/chứng từ.
   - **Cởi mở (*Openness*):** Tư duy trừu tượng, khả năng nhận diện quy luật lỗi hệ thống, ghim đúng bằng chứng và sáng tạo giải pháp.
   - **Hướng ngoại (*Extraversion*):** Năng lượng tương tác, tốc độ quyết đoán trong các tình huống giao tiếp khung chat và xử lý sự kiện đám đông.
   - **Hòa đồng (*Agreeableness*):** Sự thấu cảm, khả năng lắng nghe phản hồi khách hàng và đặt lợi ích tập thể lên trên cái tôi cá nhân.
   - **Ổn định cảm xúc (*Emotional Stability*):** Bản lĩnh giữ bình tĩnh và duy trì độ chính xác khi đồng hồ đếm ngược Giờ G ($\le 60$s) tạo áp lực lớn.
2. **Tầng 2 — Khung Holland RIASEC đối chiếu với 6 nhóm môi trường nghề nghiệp & chương trình đại học:**
   - **Kỹ thuật (*Realistic - R*):** Thao tác thực tế, vận hành công cụ và hệ thống kỹ thuật.
   - **Nghiên cứu (*Investigative - I*):** Tư duy logic, phân tích dữ liệu, lập trình và điều tra nguyên nhân gốc.
   - **Nghệ thuật (*Artistic - A*):** Sáng tạo nội dung, thiết kế chiến dịch và không gian làm việc linh hoạt.
   - **Xã hội (*Social - S*):** Đào tạo, tư vấn, truyền thông cộng đồng và hỗ trợ con người.
   - **Quản lý / Kinh doanh (*Enterprising - E*):** Nhạy bén với cơ hội, dẫn dắt đội nhóm, đàm phán hợp đồng và đánh đổi nguồn lực dưới áp lực.
   - **Nghiệp vụ (*Conventional - C*):** Phát huy tối đa trong môi trường quy chuẩn, làm việc với số liệu, pháp chế và quy trình SOP rõ ràng.

| Thành Phần Giao Diện Mới | Sự Kiện Telemetry Tương Ứng | Trục Năng Lực & Big Five / RIASEC Đo Lường |
| :--- | :--- | :--- |
| **Hóa đơn / Thẻ quẹt (Card Swipe / Stamp)** | `item_classified` `{ target_id, latency_ms }` | $S_{\text{Logic}}$ $\rightarrow$ *Conscientiousness (C)* & *Conventional / Investigative* |
| **Tra cứu Sổ tay 3 dòng (SOP Peek)** | `handbook_viewed` `{ duration_ms }` | $S_{\text{Patience}}$ $\rightarrow$ *Conscientiousness (C)* |
| **Ghim bằng chứng & Đối chiếu 3 Tab** | `tab_switched`, `clue_pinned` | $S_{\text{Logic}}$ $\rightarrow$ *Openness (O)* & *Investigative (I)* |
| **Biến động 3 thanh Trade-off & Khung Chat** | `tradeoff_balance_score` | *Agreeableness (A)*, *Extraversion (E)* & *Social / Enterprising* |
| **Phản ứng khi Sếp giục / Còi báo động Giờ G** | `stress_spike_entered`, `panic_click_flag` | $S_{\text{Resilience}}$ $\rightarrow$ *Emotional Stability (ES)* |

---

## 5. Phân Tích Hình Mẫu "Nợ Có Ơi" (JoyUp) & Khung Chuẩn Hóa 5+5 Cho Mọi Công Việc Mới

Thành công của **Nợ Có Ơi** (hơn 372,6 nghìn lượt chơi trên JoyUp) tưởng chừng là một nghịch lý: người đi làm vốn đã mệt mỏi với sổ sách nhưng về nhà vẫn tự nguyện mở điện thoại lên soi hóa đơn và định khoản. Nhìn dưới góc độ một ứng dụng mô phỏng nghề nghiệp thực tế, sức hút này không đến từ đồ họa cầu kỳ mà đến từ **5 yếu tố thiết kế tâm lý học hành vi** kết hợp **5 điều kiện chuyển đổi bắt buộc**.

Mọi ngành nghề hoặc công việc mới được bổ sung vào **LucidTask** trong tương lai bắt buộc phải tuân thủ khung chuẩn hóa 5+5 dưới đây:

---

### 5.1. Năm Lý Do Thành Công Của "Nợ Có Ơi" Dưới Góc Độ Mô Phỏng Nghề Nghiệp

1. **Tạo ra "Áp lực trong hộp cát an toàn" (*Safe Stress & Mastery*):**
   - Công việc thực tế ngoài đời mang lại căng thẳng vì sai một con số có thể bị phạt thuế, đền tiền hoặc mất việc. Game giữ nguyên vẹn sự căng thẳng đó (đồng hồ ca làm chạy liên tục, hàng chờ dồn ứ, dòng báo đỏ `Lệch 3.850` khi định khoản sai), nhưng đặt toàn bộ rủi ro trong môi trường an toàn.
   - Khi người chơi tự xoay xở đến cuối kỳ và nhìn thấy bảng cân đối phát sinh khớp tuyệt đối từng đồng (`763.503.660 = 763.503.660` kèm dấu tích xanh), cảm giác chinh phục sự hỗn loạn tạo ra hiệu ứng giải tỏa tâm lý rất mạnh.
2. **Nhân cách hóa nghiệp vụ khô khan thành "đời sống công sở" & Mâu thuẫn Uy tín vs. Thiện cảm:**
   - Thay vì bắt người chơi đối diện với một bảng tính lạnh lẽo, xây dựng một thế giới thu nhỏ Việt hóa: người chơi nhập vai nhân vật (*Út Sổ* tại *Công ty Vật Tư Phát Tài*), có mentor (*Cô Ba*) dìu dắt và đồng nghiệp (*Bé Mít*, *Bé Na*, *Chị Thu*, *Anh Tài Giám đốc*) lần lượt mang hồ sơ tới bàn.
   - **Cơ chế Xung đột Công sở (`🛡️ Uy tín` vs `❤️ Thiện cảm`) & "Sai sót ẩn" (*Latent Error*):**
     - Hai thanh trạng thái **🛡️ Uy tín (Khiên)** và **❤️ Thiện cảm (Tim)** không được tăng/giảm cùng chiều một cách đơn điệu, mà phải tái hiện đúng mâu thuẫn kinh điển nơi công sở:
     - Khi đồng nghiệp hoặc sếp mang một hồ sơ "lách quy định" tới (ví dụ: thiếu chữ ký duyệt, vượt trần chi tiền mặt): Nếu người chơi **thẳng tay từ chối (Làm đúng nguyên tắc)** $\rightarrow$ Giữ vững **🛡️ Uy tín chuyên môn**, nhưng **bị tụt ❤️ Thiện cảm** với phòng ban đó.
     - Ngược lại, nếu người chơi **nể nang bấm duyệt (hoặc định khoản sai bản chất nhưng tổng tiền vẫn cân)** $\rightarrow$ Giữ được **❤️ Thiện cảm** tức thời và game không báo lỗi ngay, nhưng tạo ra **"Sai sót ẩn" (*Latent Error*)**. Sai sót ẩn này tích tụ lại đến cuối ca/cuối tháng khi **Kiểm quỹ & Khóa sổ** mới bị *Cô Ba* khui ra và trừ nặng **🛡️ Uy tín**!
3. **Cảm giác "chạm vào nghề thật" ở cấp độ chứng từ (*Tactile Authenticity*):**
   - Tuyệt đối không tóm tắt tình huống bằng hai dòng câu hỏi trắc nghiệm, mà đặt thẳng tờ *Hóa đơn GTGT*, *Đơn đặt hàng – Phiếu xuất kho*, *Phiếu kế toán*, hoặc *Bản hợp đồng* lên bàn làm việc.
   - Những cái bẫy phải được cài cắm rất đời thực tại **một dòng cụ thể trên tờ chứng từ** (như dòng ghi *"Giảm 5% so với bảng giá — chưa có duyệt của trưởng phòng"*, lệch số lượng thực giao, sai thuế suất, cộng nhầm tổng) trong khi các dòng còn lại trên tờ giấy là dòng đúng.
4. **Dẫn nhập kiến thức theo kiểu "bình dân hóa" (*Micro-scaffolding*):**
   - Giải quyết rào cản chuyên môn bằng các màn hướng dẫn ngắn kiểu truyện tranh bình dân (*"Kế toán vỉa hè"*: dùng chuyện mua xe đẩy bán trà sữa để giải thích tài sản cố định và khấu hao) kết hợp lộ trình tăng độ khó dần từ *Cấp 1 – Thực tập* (chỉ kiểm tra hóa đơn đơn giản) lên các cấp cao hơn (xử lý đa chứng từ, định khoản, khóa sổ).
5. **Loại bỏ ma sát tiếp cận:**
   - Thiết kế khung bàn làm việc gọn gàng, chạy trực tiếp bằng HTML5 trên trình duyệt giúp người dùng bấm vào là chơi ngay trong 3 giây mà không phải cài đặt ứng dụng.

---

### 5.2. Năm Điều Kiện Đặc Thù Để Chuyển Đổi Công Việc Thực Tế Thành "Game Hay"

Không phải công việc nào bê nguyên quy trình thực tế vào ứng dụng cũng thành game hấp dẫn. Khi thêm bất kỳ ngành nghề mới nào vào LucidTask, người thiết kế bắt buộc phải thực hiện 5 phép chuyển đổi sau:

#### 1. Biến tính mơ hồ của công việc thành "Vòng lặp phản hồi khép kín" (Phân tách 2 Thái cực Ngành nghề)
Công việc ngoài đời chia thành hai thái cực về khả năng game hóa, đòi hỏi 2 cơ chế phản hồi khác nhau:
- **Thái cực A — Ngành có luật đúng/sai rạch ròi (*Kế toán, Kiểm toán, Pháp chế, Logistics tải trọng, Soát lỗi hệ thống*):**
  - Chấm đúng/sai và kiểm tra cân bằng số học ngay lập tức (Tổng Nợ phải bằng Tổng Có, tải trọng xe không vượt ngưỡng, điều khoản phạt không vượt trần luật định).
- **Thái cực B — Ngành có kết quả mở/mơ hồ (*Marketing, Truyền thông, Thiết kế, Quản trị*):**
  - Ngoài đời không có một đáp án đúng duy nhất. Muốn biến nhóm ngành này thành game hay, bắt buộc phải **lượng hóa hệ quả thành các chỉ số xung đột trực tiếp** (ví dụ: *Ngân sách – Lượng khách – Uy tín thương hiệu*) trên một bàn điều khiển/thanh trượt thời gian thực để mọi quyết định của người chơi đều nhận lại phản ứng tức thì thay vì cảm giác *"chọn gì cũng được"*.

#### 2. Nén thời gian và cắt bỏ toàn bộ "thời gian chết" (*Time Compression*)
- Một dự án Marketing ngoài đời mất 2 tuần mới thấy số liệu, một kỳ kế toán mất 30 ngày mới khóa sổ, một quy trình tuyển dụng mất hàng tuần chờ phản hồi.
- Game mô phỏng phải thực hiện **Nén thời gian**: thu gọn cả tuần/tháng làm việc vào **3–5 phút**, cắt bỏ hoàn toàn các khâu chờ đợi, điền biểu mẫu hành chính rườm rà và chỉ giữ lại những khoảnh khắc ra quyết định có độ ma sát cao nhất.

#### 3. Chuyển từ "Chọn đáp án thụ động" sang "Thao tác kiến tạo chủ động" (*Active Construction vs. Passive Selection*)
Đây là lằn ranh sống còn phân biệt giữa **Game Mô Phỏng** và **Trắc Nghiệm Bọc Vỏ Giao Diện**:
- **Thụ động (CẤM DÙNG):** Đọc một đoạn mô tả vấn đề rồi bấm nút chọn đáp án A, B hoặc chọn 1 trong 3 nút Radio viết sẵn lời giải.
- **Chủ động (BẮT BUỘC ÁP DỤNG):**
  1. *Ở bước Soi chứng từ:* Người chơi phải tự quan sát tài liệu thô gồm 6–10 dòng. Chỉ có đúng dòng chứa lỗi (`is_flawed: true`) mới bắt được lỗi khi chạm vào; nếu chạm nhầm vào dòng hợp lệ thì bị báo bắt nhầm; nếu chứng từ hoàn toàn sạch lỗi thì mới bấm nút **`Hợp lệ ✓`**.
  2. *Ở bước Giải quyết / Định khoản:* Xóa bỏ các nút Radio trả lời sẵn. Người chơi phải tự tay gắp thẻ nghiệp vụ, kéo thả/phân bổ nguồn lực hoặc gán các con số trích xuất từ chứng từ vào 2 khay đối ứng cho đến khi **triệt tiêu dòng báo đỏ `Lệch ...` về `0` (`Đã cân / Khớp 100%`)**. Khi người chơi phải tự tay "lắp ráp" lời giải, bộ não chuyển từ chế độ làm bài thi sang chế độ giải quyết vấn đề.

#### 4. Giữ được "Điểm cân bằng trừu tượng hóa" (*Abstraction Sweet Spot*)
- **Tránh quá sát thực tế hàn lâm:** Không nhồi nhét đầy đủ thông tư kế toán phức tạp, bắt gõ code lập trình thật hay đọc hợp đồng pháp lý dài 10 trang (gây quá tải nhận thức và bỏ cuộc).
- **Tránh quá đơn giản hóa:** Không lược bỏ hết số liệu và quy tắc đối chiếu (làm mất bản chất lao động).
- **Điểm cân bằng chuẩn:** Đơn giản hóa thuật ngữ chuyên ngành bằng ngôn ngữ bình dân, nhưng bảo toàn 100% cấu trúc tư duy, trình tự thao tác và bản chất đánh đổi của nghề nghiệp đó.

#### 5. Thiết kế "Điểm chốt giải tỏa" (*Closure & Catharsis*)
- Công việc văn phòng dễ gây chán nản vì cảm giác lặp đi lặp lại không có điểm dừng.
- Mỗi Micro-Task phải kết thúc bằng một **Màn hình Nghi thức Khóa Sổ / Chốt Bảng Cân Đối Cuối Ca**: tổng hợp toàn bộ kết quả xử lý trong ca, hiển thị bảng đối chiếu khớp tuyệt đối từng đồng (`763.503.660 = 763.503.660` kèm dấu tích xanh), phơi bày các *"Sai sót ẩn"* (nếu có), và cho người chơi thực hiện thao tác nghi thức cuối cùng (cộp con dấu phê duyệt, khóa sổ tháng, phát lệnh thông cáo) để giải tỏa toàn bộ áp lực tích tụ.

---

### 5.3. Bảng Checklist Bắt Buộc Khi Thiết Kế Ngành Nghề Mới (New Career Module Checklist)

Trước khi đưa bất kỳ ngành nghề mới nào vào `src/registry/<industry_name>/`, người thiết kế nội dung và lập trình viên phải kiểm tra đủ 4 tiêu chuẩn sau:

| STT | Hạng Mục Kiểm Duyệt Thiết Kế Ngành Mới | Tiêu Chuẩn Đạt (Pass Criteria) |
| :---: | :--- | :--- |
| **1** | **Soi chứng từ chạm đúng dòng lỗi (`Spot-the-Flaw`)** | Mỗi chứng từ phải có 5–8 dòng dữ liệu thực tế. Chỉ dòng có `is_flawed: true` mới là điểm bắt lỗi đúng; chạm vào dòng bình thường phải tính là bắt nhầm; chứng từ không có dòng lỗi nào thì phải bấm `Hợp lệ ✓`. |
| **2** | **Lắp ráp & Cân bằng chủ động (`Zero-Radio Construction`)** | Không dùng câu hỏi trắc nghiệm Radio A/B/C/D. Người chơi phải tự lắp ghép thẻ + số liệu/chứng cứ vào khay hoặc điều chỉnh thanh trượt nguồn lực để xóa dòng báo đỏ `Lệch ...` về trạng thái cân bằng. |
| **3** | **Xung đột `🛡️ Uy tín` vs `❤️ Thiện cảm` & `Sai sót ẩn`** | Có các tình huống đồng nghiệp/sếp nhờ "du di": bắt lỗi thẳng tay thì `+Uy tín / -Thiện cảm`; nể nang cho qua thì `+Thiện cảm` nhưng ghi nhận `Sai sót ẩn` bị khui vào cuối ca. |
| **4** | **Dẫn nhập bình dân & Nghi thức Khóa sổ (`Catharsis`)** | Có ví dụ dẫn nhập kiểu *"Bình dân vỉa hè"* dễ hiểu trong 15 giây ở đầu ca, và có màn hình đối chiếu tổng kết khớp sổ `A = B ✓` ở cuối ca. |

---

## 6. Kết Luận
Bản RFC này là **tiêu chuẩn kiến trúc và thiết kế trò chơi bắt buộc** cho mọi công việc được phát triển trên LucidTask, đảm bảo sản phẩm thoát khỏi hoàn toàn lối mòn trắc nghiệm và tạo ra lợi thế cạnh tranh bền vững.

