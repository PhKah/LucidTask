# QUY CHUẨN ĐÓNG GÓP & QUẢN LÝ PHIÊN BẢN (CONTRIBUTING & SCM GUIDE)
**Dự án:** LucidTask — Nền tảng Hướng nghiệp & Trải nghiệm Tác vụ Thực chứng  
**Mục tiêu:** Thống nhất chiến lược phân nhánh Git, quy tắc đặt tên commit và cấu hình các môi trường phát triển độc lập trên GitHub  

---

## 1. Chiến Lược Phân Nhánh Git (Branching Strategy — GitHub Flow)

Dự án áp dụng mô hình **GitHub Flow Tinh gọn (Trunk-based with Feature Branches)**:

```
  main ──────────────────────────────────────────●────── (Luôn sẵn sàng deploy / Production)
         \                                      /
          \── feat/task-engine-runner ─────────/ (Pull Request + CI Check + DoD)
```

### Quy ước đặt tên nhánh:
- `feat/<tên-tính-năng>`: Xây dựng tính năng mới (ví dụ: `feat/early-exit-gatekeeper`, `feat/blind-matching-reveal`).
- `fix/<tên-lỗi>`: Sửa lỗi hệ thống (ví dụ: `fix/timer-stress-spike-freeze`, `fix/print-a4-page-break`).
- `specs/<tên-đặc-tả>`: Cập nhật tài liệu kỹ thuật (ví dụ: `specs/update-scoring-formula`).
- `test/<tên-bộ-test>`: Bổ sung ca kiểm thử (ví dụ: `test/cosine-similarity-unit-tests`).
- `refactor/<tên-module>`: Tái cấu trúc mã nguồn (ví dụ: `refactor/telemetry-bus-pubsub`).

---

## 2. Quy Tắc Đặt Tên Commit (Conventional Commits)

Mọi commit bắt buộc tuân theo định dạng chuẩn quốc tế:
```
<type>(<scope>): <mô tả ngắn bằng tiếng Việt hoặc tiếng Anh>
```

### Bảng phân loại `type`:
- `feat`: Tính năng mới (ví dụ: `feat(engine): add 4 interaction archetypes resolver`).
- `fix`: Sửa lỗi (ví dụ: `fix(scoring): correct cosine distance calculation when vector has zero component`).
- `specs`: Cập nhật tài liệu đặc tả (ví dụ: `specs(srs): add non-functional requirements section`).
- `test`: Viết thêm unit/integration test (ví dụ: `test(gatekeeper): add unit tests for erratic click detection`).
- `style`: Định dạng code, giao diện CSS (ví dụ: `style(ui): apply #fa9000 brand eyebrow bar to card header`).
- `ci`: Thay đổi cấu hình GitHub Actions (ví dụ: `ci: add coverage threshold check to github workflow`).

---

## 3. Thiết Lập Môi Trường Phát Triển Độc Lập (Environment Setup)

Để quá trình phát triển không ảnh hưởng lẫn nhau và bảo vệ an toàn dữ liệu thử nghiệm, hệ thống chia làm 3 không gian làm việc độc lập:

| Môi trường | Nhánh Git | Mục đích sử dụng | Nơi Triển khai | Cấu hình Đặc thù |
| :--- | :--- | :--- | :--- | :--- |
| **Local (Môi trường Lập trình)** | `feat/*`, `fix/*` | Lập trình viên code trực tiếp trên máy tính cá nhân. | `http://localhost:5173` | Bật cờ `VITE_DEBUG_TELEMETRY=true`, in toàn bộ log sự kiện ra Console. |
| **Staging (Môi trường Kiểm thử/Test)** | `develop` hoặc PR Preview | Chạy thử nghiệm pilot với 5 học sinh đầu tiên để kiểm tra lỗi thực tế. | Vercel Preview URL | Nạp dữ liệu seed thử nghiệm, bật công cụ đo hiệu năng. |
| **Production (Môi trường Thực địa)** | `main` | Dùng cho đợt thử nghiệm chính thức với 20–30 cặp học sinh/phụ huynh để lấy số liệu báo cáo ĐMST. | Tên miền chính thức / Vercel Production | Tắt toàn bộ console log debug, kích hoạt bộ nhớ đệm tối ưu tải trang $\le 1.0$s. |

---

## 4. Quy Trình Tạo Pull Request & Kiểm Thử Tự Động

1. Tạo nhánh mới từ `main`: `git checkout -b feat/task-workspace-ui`.
2. Lập trình và viết Unit test tương ứng.
3. Chạy kiểm tra cục bộ trước khi push:
   - Chạy linter: `npm run lint`
   - Chạy type-check: `npm run type-check`
   - Chạy tests: `npm test`
4. Push lên GitHub: `git push origin feat/task-workspace-ui`.
5. Mở Pull Request trên GitHub $\rightarrow$ Điền đầy đủ Checklist trong **[PULL_REQUEST_TEMPLATE.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/.github/PULL_REQUEST_TEMPLATE.md)**.
6. GitHub Actions tự động kích hoạt pipeline kiểm tra:
   - Nếu CI xanh ($100\%$ pass) + Được ít nhất 1 thành viên Approve $\implies$ Tiến hành Merge vào `main`.
