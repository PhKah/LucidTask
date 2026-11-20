# ĐẶC TẢ SẢN PHẨM & PHẠM VI MVP (PRD_MVP.md)
**Dự án:** LucidTask — Nền tảng Hướng nghiệp & Trải nghiệm Tác vụ Thực chứng  
**Mục tiêu tài liệu:** Chốt ranh giới "LÀM GÌ và CẮT BỎ CÁI GÌ" ở phiên bản đầu tiên nhằm bảo đảm tiến độ thử nghiệm  
**Tài liệu Yêu cầu Kỹ thuật Đi kèm:** [SRS.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/SRS.md)  
**Phiên bản:** 2.0 (Streamlined Scope Definition)  

---

## 1. Tuyên ngôn Sản phẩm & Mục tiêu Thử nghiệm

### 1.1. Bối cảnh & Giá trị Cốt lõi
LucidTask ra đời nhằm giải quyết 3 đứt gãy lớn trong hướng nghiệp THPT: (1) Mù mờ về tác vụ thực tế, (2) Định kiến thương hiệu trường top, và (3) Xung đột kỳ vọng trong gia đình.

### 1.2. Mục tiêu Tối thiểu của Bản MVP (Minimum Viable Product Goals)
Phiên bản MVP **không nhằm mục đích trở thành một hệ thống thương mại hoàn chỉnh**, mà được thiết kế để thu thập dữ liệu kiểm chứng 4 giả thuyết khoa học:
- **Khả năng sàng lọc của Task ngắn ($H_0$):** Task ma sát 90s có thể nhận diện sớm học sinh không phù hợp để dừng bài test hay không?
- **Sức thuyết phục của Blind Matching ($H_1$):** Che tên trường có giúp học sinh chọn trường theo nội dung học thực tế hay không?
- **Tính chân thực của Thực chứng ($H_2$):** Thao tác giải quyết bài toán phức tạp có bộc lộ năng lực tốt hơn trắc nghiệm tự chấm hay không?
- **Khả năng hòa giải của Báo cáo Gia đình ($H_3$):** Bảng đối chiếu 2 cột có giúp cha mẹ và con cái đồng thuận chọn trường hay không?

---

## 2. Ranh giới Tính năng Phân cấp theo MoSCoW (Scope Boundaries)

Đây là ranh giới bắt buộc tuân theo để ngăn chặn tình trạng ôm đồm tính năng (Feature Creep):

| Phân cấp | Tên tính năng | Quyết định triển khai trong MVP | Lý do chiến lược |
| :--- | :--- | :--- | :--- |
| **MUST-HAVE** *(Bắt buộc)* | **1. Pipeline Chuỗi Tác vụ Lũy tiến** | Triển khai Chặng 1 (Sơ tuyển 90s) và Chặng 2 (Cốt lõi 3.5 phút) cho 2 cụm ngành mẫu (IT & Logistics). | Đo lường phản xạ kỷ luật và tư duy giải quyết vấn đề cốt lõi. |
| **MUST-HAVE** | **2. Cơ chế Sàng lọc Dừng Sớm (Early Exit)** | Kích hoạt màn hình dừng bài test văn minh khi học sinh bấm ẩu hoặc không đạt chuẩn ở Chặng 1. | Tiết kiệm thời gian người dùng, kiểm chứng giả thuyết $H_0$. |
| **MUST-HAVE** | **3. Động cơ Ghép nối Ẩn danh (Blind Matching)** | Hiển thị 3–4 thẻ chương trình ẩn danh, chỉ lộ diện tên trường khi học sinh bấm chọn và nhấn mở khóa. | Trọng tâm kiểm chứng giả thuyết $H_1$ (xóa bỏ định kiến trường top). |
| **MUST-HAVE** | **4. Báo cáo Đồng thuận Gia đình 2 Cột** | Đối chiếu song song Năng lực thực chứng của con vs Dữ liệu thị trường và chi phí rủi ro lãng phí 185 triệu. | Trọng tâm kiểm chứng giả thuyết $H_3$ (tạo đồng thuận gia đình). |
| **MUST-HAVE** | **5. In / Lưu Báo cáo PDF Chuẩn A4** | Tối ưu hóa `@media print` xuất file A4 trực tiếp từ trình duyệt. | Để học sinh mang bản in về nhà thảo luận cùng phụ huynh trong bữa tối. |
| **SHOULD-HAVE** *(Nên có)* | **6. Đòn bẩy Đối chiếu Chéo 2 Ngành** | Tùy chọn làm thêm ngành thứ 2 để mở khóa Bảng so sánh năng lực đối đầu (Head-to-head Matrix). | Hỗ trợ giải quyết mâu thuẫn khi con thích ngành A nhưng bố mẹ muốn ngành B. |
| **COULD-HAVE** *(Nếu kịp)* | **7. Hiệu ứng Mở khóa (Reveal Animation)** | Hiệu ứng lật thẻ (Card Flip) giải mã tên trường. | Tăng cảm xúc tò mò cho học sinh. |
| **OUT-OF-SCOPE** *(Cắt bỏ 100%)* | **8. Đăng ký / Đăng nhập / User Database** | CẮT BỎ HOÀN TOÀN. Dùng phiên ẩn danh (`SessionID`). | Giảm ma sát gia nhập, không thu thập thông tin cá nhân học sinh. |
| **OUT-OF-SCOPE** | **9. CMS Tuyển sinh B2B cho Trường ĐH** | CẮT BỎ HOÀN TOÀN. Toàn bộ chương trình dùng dữ liệu mồi tĩnh (Seed JSON). | Tránh phức tạp hóa hệ thống quản trị không cần thiết cho thử nghiệm. |
| **OUT-OF-SCOPE** | **10. Cổng Thanh toán / Mua gói** | CẮT BỎ HOÀN TOÀN. Thử nghiệm phi thương mại 100%. | Giữ tính trung lập nghiên cứu khoa học. |
| **OUT-OF-SCOPE** | **11. Chatbot Tư vấn Mở / Diễn đàn** | CẮT BỎ HOÀN TOÀN. | Tránh rủi ro AI bịa thông tin và phân tán trải nghiệm thực chứng. |

---

## 3. Ràng buộc Vận hành & Tiêu chuẩn Bàn giao

- **Thời lượng trải nghiệm hoàn chỉnh:** Toàn bộ luồng từ lúc chọn ngành đến khi in báo cáo không được vượt quá **10 phút** đối với trải nghiệm 1 ngành, và **15 phút** đối với trải nghiệm 2 ngành đối chiếu chéo.
- **Tính độc lập của dữ liệu:** Hệ thống phải chạy được độc lập trên môi trường máy tính cục bộ (Localhost) hoặc web tĩnh (Vercel/Netlify) mà không cần cài đặt cơ sở dữ liệu SQL/NoSQL phức tạp.
- **Tiêu chuẩn kỹ thuật chi tiết:** Toàn bộ danh mục yêu cầu chức năng (FR-01 $\rightarrow$ FR-09), yêu cầu phi chức năng (NFR-01 $\rightarrow$ NFR-06) và ma trận nghiệm thu được chuẩn hóa tại [specs/SRS.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/SRS.md).
