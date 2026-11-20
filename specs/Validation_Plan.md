# KẾ HOẠCH KIỂM THỬ & ĐO LƯỜNG GIẢ THUYẾT (Validation_Plan.md)
**Dự án:** LucidTask — Nền tảng Hướng nghiệp & Trải nghiệm Tác vụ Thực chứng  
**Cơ chế bổ sung:** Kiểm chứng Giả thuyết Phễu Sàng lọc Sớm (Early Exit Validation) & Giá trị Tác vụ Cốt lõi  
**Phiên bản:** 1.1  
**Tình trạng:** Sẵn sàng đưa vào triển khai thử nghiệm thực tế  

---

## 1. Hệ thống Giả thuyết Nghiên cứu Cốt lõi (Research Hypotheses)

| Mã giả thuyết | Tuyên ngôn Giả thuyết | Biến số độc lập (Tác động) | Biến số phụ thuộc (Đo lường) | Tiêu chí xác thực (Validation Threshold) |
| :--- | :--- | :--- | :--- | :--- |
| **$H_0$** *(Mới — Về Phễu Sàng lọc Sớm)* | Task 1 ngắn (90s) có ma sát cao có khả năng sàng lọc chính xác học sinh không phù hợp, và những học sinh bị dừng sớm cảm thấy phản hồi này có giá trị định hướng cao hơn là bắt làm một bài test dài. | Cơ chế Early Exit ở Task 1 kèm thông điệp phân tích xu hướng. | Tỷ lệ học sinh bị dừng sớm đồng ý với nhận định của hệ thống về tính cách của mình. | **$\ge 75\%$** học sinh bị lọc dừng sớm thừa nhận mình thực sự thấy chán/ngại việc đọc mã log chi tiết. |
| **$H_1$** *(Về Blind Matching & Định kiến trường top)* | Khi thông tin về tên trường bị ẩn ở bước đầu, học sinh đã vượt qua Task 2 sẽ ưu tiên lựa chọn chương trình học dựa trên **mức độ tương thích năng lực cốt lõi** thay vì bám vào danh tiếng trường. | Che tên trường (Blind Mode) vs Hiển thị tên trường ngay từ đầu. | Tỷ lệ học sinh chọn chương trình của trường nhóm 2/tư thục/nghề khi thấy tương thích cao. | **$\ge 45\%$** học sinh chọn một chương trình không phải trường top 1 mà họ từng định kiến ban đầu. |
| **$H_2$** *(Về Trải nghiệm Thực chứng vs Trắc nghiệm)* | Task 2 (Năng lực cốt lõi 3–4 phút) giúp học sinh hiểu được bản chất thực sự của nghề nghiệp tốt hơn gấp nhiều lần việc đọc mô tả ngành học trên sách báo. | Trải nghiệm giải quyết sự cố đa biến số trong Task 2. | Tỷ lệ học sinh cảm nhận được "sự nhọc nhằn và giá trị thành tựu thật" của nghề. | **$\ge 80\%$** học sinh khẳng định trải nghiệm cho họ góc nhìn hoàn toàn mới về công việc mà trước đây chưa từng nghĩ tới. |
| **$H_3$** *(Về Báo cáo Đồng thuận Gia đình)* | Báo cáo đối chiếu 2 cột song song (Năng lực thực chứng qua 2 tầng + Dữ liệu thị trường và chi phí rủi ro) làm giảm đáng kể tranh cãi cảm tính giữa phụ huynh và học sinh. | Báo cáo đối chiếu song song 2 cột của LucidTask. | Điểm số đánh giá mức độ hữu ích của phụ huynh và sự thay đổi thái độ đối thoại trong gia đình. | **$\ge 75\%$** phụ huynh đồng ý sử dụng báo cáo này làm cơ sở thảo luận nghiêm túc với con. |

---

## 2. Kịch bản Thử nghiệm Thực tế (Usability Testing Script)

### Quy trình 4 Giai đoạn Cập nhật:
1. **Giai đoạn 1: Pre-test Survey (2 phút):** Ghi nhận ngành/trường học sinh và phụ huynh đang nhắm tới ban đầu.
2. **Giai đoạn 2: Trải nghiệm Chuỗi Tác vụ Lũy tiến (5 – 7 phút):**
   - Học sinh làm Task 1 (90s).
   - *Nếu bị Sàng lọc sớm (Early Exit):* Quan sát biểu cảm khi đọc phản hồi phân tích xu hướng. Hỏi nhanh: *"Em có thấy kết luận vừa rồi nói đúng về việc em vừa vội vàng bấm bừa không?"*. Cho học sinh chọn thử lại hoặc đổi ngành.
   - *Nếu vượt qua sang Task 2 (3.5 phút):* Quan sát cách học sinh đối chiếu nhiều tab dữ liệu và phản ứng khi đồng hồ báo đỏ.
3. **Giai đoạn 3: Blind Matching & Mở khóa cùng Phụ huynh (3 phút):** Xem thẻ ẩn danh, mở khóa tên trường, đọc báo cáo 2 cột.
4. **Giai đoạn 4: Phỏng vấn Sâu sau Trải nghiệm (10 phút):** Đánh giá theo bộ câu hỏi chuyên sâu.

---

## 3. Bộ Chỉ số Thành công (Success Metrics & Evaluation Dashboard)

| Chỉ số | Công thức đo lường | Mục tiêu kiểm chứng (Target) | Ý nghĩa đánh giá dự án |
| :--- | :--- | :--- | :--- |
| **Tỷ lệ Sàng lọc Hợp lý (Filter Validity)** | $\frac{\text{Số HS bị lọc thừa nhận bản thân không hợp}}{\text{Tổng số HS bị kích hoạt Early Exit}} \times 100\%$ | **$\ge 75\%$** | Khẳng định tính hiệu quả của Task 1 trong việc lọc đúng đối tượng. |
| **Tỷ lệ Vượt qua Task 2 (Core Completion Rate)** | $\frac{\text{Số HS hoàn thành Task 2}}{\text{Số HS đủ điều kiện vào Task 2}} \times 100\%$ | **$\ge 80\%$** | Chứng minh Task 2 có độ khó đủ thử thách nhưng không làm người học bỏ cuộc. |
| **Điểm Hệ thống SUS (SUS Score)** | Điểm chuẩn hóa System Usability Scale (10 câu). | **$\ge 75 / 100$** | Giao diện điều hướng luồng lũy tiến rõ ràng, dễ hiểu. |
| **Tác động Quyết định (Decision Shift Rate)** | $\frac{\text{Số HS chọn trường ngoài danh sách ban đầu}}{\text{Tổng số HS tham gia}} \times 100\%$ | **$\ge 40\%$** | Phá vỡ thiên kiến danh tiếng trường học nhờ Blind Matching. |
| **Đồng thuận Phụ huynh (Parent Alignment)** | Tỷ lệ phụ huynh chấm $\ge 4/5$ sao về mức độ hữu ích của báo cáo 2 cột. | **$\ge 70\%$** | Tạo giá trị đối thoại thực tế cho gia đình. |

---

## 4. Mẫu Phiếu Ghi chép Quan sát Thực tế Cập nhật (Observation Log)

```markdown
### PHIẾU QUAN SÁT THỬ NGHIỆM CHUỖI TÁC VỤ LŨY TIẾN LUCIDTASK
- Mã phiên: #TEST-____  | Ngày: ____/____/2026
- Học sinh: Lớp _____, Trường: __________________________________________________

1. KẾT QUẢ TẦNG 1 (SƠ TUYỂN MA SÁT - 90s):
- Thời gian làm bài: ____ giây | Độ chính xác: ____ %
- Trạng thái phân nhánh:
  [ ] VƯỢT QUA VÀO TASK 2 (Độ chính xác >= 70%)
  [ ] BỊ SÀNG LỌC DỪNG SỚM (Early Exit)
- Phản ứng của học sinh khi bị dừng sớm:
  [ ] Thừa nhận đúng (thấy nản với việc đọc mã lỗi)
  [ ] Muốn thử lại để làm cẩn thận hơn
  [ ] Bất ngờ nhưng đồng ý chuyển ngành khác

2. KẾT QUẢ TẦNG 2 (NĂNG LỰC CỐT LÕI - 3.5 PHÚT):
- Học sinh có chuyển qua lại giữa các Tab dữ liệu không? [ ] Rất thường xuyên  [ ] Ít khi
- Phản ứng khi có sự cố bất ngờ ở phút 2.5:
  [ ] Bình tĩnh đọc lại  [ ] Bối rối một lúc rồi xử lý  [ ] Hoảng loạn bấm chọn bừa
- Học sinh có khoanh đúng nguyên nhân gốc không? [ ] CÓ  [ ] KHÔNG

3. BLIND MATCHING & BÁO CÁO GIA ĐÌNH:
- Chương trình ẩn danh học sinh chọn: ___________________________________________
- Tên trường sau khi Reveal: ____________________________________________________
- Phụ huynh có thay đổi góc nhìn về khả năng của con không? [ ] Có rất nhiều  [ ] Bình thường
```
