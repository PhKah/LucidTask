# BIỂU MẪU QUAN SÁT THỰC ĐỊA UAT (OBSERVATION LOG TEMPLATE)
**Dự án:** LucidTask — Nền tảng Hướng nghiệp & Trải nghiệm Tác vụ Thực chứng  
**Mã tài liệu:** `UAT-OBS-TEMPLATE-01`  
**Mục tiêu:** Thu thập dữ liệu hành vi thực tế của học sinh và phụ huynh khi tham gia thực nghiệm thực địa (N = 20–30 cặp)  

---

## THÔNG TIN PHIÊN KIỂM THỬ
- **Mã phiên (Session ID):** `#TEST-2026-____`
- **Ngày thực hiện:** DD/MM/2026  |  **Thời gian:** HH:MM – HH:MM
- **Địa điểm:** [ ] Trường THPT ____________  [ ] Quán Cafe  [ ] Tại nhà  [ ] Phòng Lab
- **Người quan sát (Facilitator):** __________________________________________________
- **Học sinh:** Lớp _____, Trường: __________________________________________________
  - *Ngành học sinh nhắm tới ban đầu (Pre-test):* _____________________________________
  - *Trường đại học định kiến ban đầu (Top-tier):* ___________________________________
- **Phụ huynh (nếu có):** [ ] Ba  [ ] Mẹ  [ ] Cả hai  [ ] Không có
  - *Nguyện vọng của phụ huynh đối với con:* _______________________________________

---

## 1. GIAI ĐOẠN 1: SƠ TUYỂN MA SÁT (TASK 1 — 90s)
*Học sinh đối mặt với 10 ticket lỗi lặp đi lặp lại để sàng lọc độ kiên nhẫn và cẩn trọng.*

- **Thời gian hoàn thành:** _____ giây / 90s
- **Độ chính xác (Accuracy):** _____ %
- **Tốc độ trung bình:** _____ giây/thao tác
- **Phân nhánh kết quả:**
  - [ ] **VƯỢT QUA VÀO TASK 2** (Độ chính xác $\ge 70\%$, Tốc độ $\ge 1.2$s/action)
  - [ ] **BỊ SÀNG LỌC DỪNG SỚM (Early Exit Triggered)**
- **Quan sát biểu cảm & Phản ứng khi bị Dừng Sớm (nếu có):**
  - [ ] Thừa nhận kết luận đúng (cảm thấy chán và ngại đọc mã lỗi chi tiết).
  - [ ] Thừa nhận vừa bấm bừa để qua màn và muốn làm lại cho cẩn thận.
  - [ ] Đồng ý đổi sang ngành khác phù hợp với sở trường hơn.
  - *Ghi chú lời nói tự nhiên của học sinh:* "..................................................."

---

## 2. GIAI ĐOẠN 2: THÁCH THỨC GIÁ TRỊ CỐT LÕI (TASK 2 — 3.5 PHÚT)
*Học sinh đối soát 3 tab dữ liệu (Khách hàng, Server Log, Git Deploy) để xử lý sự cố đứt gãy hệ thống.*

- **Hành vi tra cứu sổ tay Handbook:**
  - [ ] Chủ động mở Handbook đọc kỹ trước khi làm bài.
  - [ ] Chỉ mở Handbook khi gặp sự cố bế tắc.
  - [ ] Hoàn toàn không mở Handbook.
- **Tần suất chuyển Tab đối soát:** [ ] Rất thường xuyên  [ ] Thỉnh thoảng  [ ] Không chuyển Tab
- **Phản ứng khi Đồng hồ chuyển viền Đỏ báo Stress ($\le 60$ giây):**
  - [ ] Vẫn giữ nhịp độ cẩn trọng, rà soát từng dòng log.
  - [ ] Bắt đầu vội vàng, chuyển tab liên tục nhưng vẫn đọc thông tin.
  - [ ] Hoảng loạn, nhấp nút xác nhận vội vã.
- **Quyết định cuối cùng:**
  - [ ] Khoanh đúng nguyên nhân gốc (Rollback bản build 2.0).
  - [ ] Chọn sai phương án xử lý.
- **Thời gian hoàn thành:** _____ phút _____ giây.

---

## 3. GIAI ĐOẠN 3: GHÉP NỐI ẨN DANH (BLIND MATCHING & REVEAL)
- **Điểm 3 trục năng lực hiển thị:**
  - Tư duy Logic ($S_{\text{Logic}}$): _____ / 100
  - Độ Kiên nhẫn ($S_{\text{Patience}}$): _____ / 100
  - Sức bền Giờ G ($S_{\text{Resilience}}$): _____ / 100
- **Lựa chọn của học sinh trong chế độ Ẩn danh (Blind Mode):**
  - Thẻ chương trình được chọn: [ ] Alpha  [ ] Beta  [ ] Gamma  [ ] Delta
  - % Tương thích của chương trình đó: _____ %
  - Lý do chọn (học sinh trả lời): "..................................................."
- **Sau khi nhấn [MỞ KHÓA DANH TÍNH] (Reveal):**
  - Tên trường đào tạo thật lộ diện: __________________________________________________
  - Phân loại cơ sở đào tạo: [ ] ĐH Công lập Top 1  [ ] ĐH Công lập Nhóm 2  [ ] ĐH Tư thục  [ ] CĐ Nghề
  - *Chương trình này có nằm trong định kiến ban đầu không?* [ ] CÓ  [ ] KHÔNG (Đổi góc nhìn)
  - Biểu cảm của học sinh khi thấy tên trường thật: "..................................."

---

## 4. GIAI ĐOẠN 4: BÁO CÁO PHỤ HUYNH & ĐỐI THOẠI BỮA TỐI
- **Phụ huynh đọc cột Dữ liệu Thực chứng của con:**
  - [ ] Bất ngờ trước độ chi tiết (thấy rõ thời gian đọc sổ tay, số lần đối soát).
  - [ ] Công nhận năng lực thực tế của con khác với tưởng tượng ban đầu.
- **Phụ huynh đọc cột Thị trường & Cảnh báo chi phí rủi ro 185 triệu:**
  - [ ] Bắt đầu đặt câu hỏi về tỷ lệ việc làm và học phí thực tế.
  - [ ] Đồng ý xem xét phương án trường ngoài dự tính ban đầu.
- **Phản hồi với 3 câu hỏi bàn ăn gia đình (Alignment Zone):**
  - Mức độ hữu ích của báo cáo do phụ huynh chấm: [ ] 1★  [ ] 2★  [ ] 3★  [ ] 4★  [ ] 5★
  - Trích dẫn câu nói của cha mẹ: "..................................................."

---

## 5. TỔNG KẾT ĐÁNH GIÁ CHỈ SỐ
- [ ] Thỏa mãn tiêu chí $H_0$ (nếu có Early Exit)
- [ ] Thỏa mãn tiêu chí $H_1$ (Chọn trường ngoài định kiến ban đầu)
- [ ] Thỏa mãn tiêu chí $H_2$ (Hiểu bản chất nghề qua trải nghiệm thực chứng)
- [ ] Thỏa mãn tiêu chí $H_3$ (Phụ huynh đồng thuận và thay đổi góc nhìn)
