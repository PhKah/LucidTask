## 📋 Mô Tả Thay Đổi (PR Summary)
<!-- Tóm tắt ngắn gọn tính năng, bản sửa lỗi hoặc cập nhật đặc tả trong PR này -->

- **Loại thay đổi (Type of change):**
  - [ ] `feat`: Tính năng mới
  - [ ] `fix`: Sửa lỗi
  - [ ] `specs`: Cập nhật tài liệu đặc tả / kiến trúc
  - [ ] `test`: Thêm hoặc cập nhật ca kiểm thử
  - [ ] `refactor`: Tái cấu trúc mã nguồn không đổi logic
  - [ ] `ci`: Cấu hình GitHub Actions / Tooling

- **Liên kết yêu cầu / Issue liên quan:**
  - Đáp ứng mã yêu cầu trong SRS: `[FR-___]`, `[NFR-___]`
  - Giả thuyết kiểm chứng: `[$H____]`

---

## ✅ Bảng Kiểm Tra Tiêu Chuẩn Hoàn Thành (Definition of Done — DoD)

*Vui lòng tích chọn toàn bộ các mục trước khi yêu cầu review:*

- [ ] **1. Code Quality & Typecheck:** Không có cảnh báo linting, `tsc --noEmit` chạy thành công.
- [ ] **2. Test Coverage:** Đã bổ sung Unit/Integration tests cho logic mới. Code coverage đạt $\ge 80\%$.
- [ ] **3. Invariant Check:** Tên trường và logo tuyệt đối **KHÔNG** tồn tại trong DOM ở trạng thái `BLIND_MODE`.
- [ ] **4. Responsive & Accessibility:** Đã kiểm tra hiển thị trên Desktop ($1440\times 900$) và Tablet ($1024\times 768$).
- [ ] **5. Performance Check:** Độ trễ thu Telemetry $\le 50\text{ms}$, thời gian tải task $\le 1.0\text{s}$.
- [ ] **6. In ấn Báo cáo:** Đã kiểm tra tính năng xuất in A4 `@media print` không bị đứt trang.
- [ ] **7. Đồng bộ Đặc tả:** Nếu thay đổi logic, đã cập nhật tương ứng vào các file trong `specs/` theo nguyên tắc SSOT.

---

## 📸 Ảnh chụp / Video Minh Họa (Nghiệm thu Giao diện nếu có)
<!-- Đính kèm ảnh chụp màn hình hoặc GIF thao tác thực tế -->

