# HỒ SƠ ĐIỀU PHỐI: SPRINT 4 — BÁO CÁO ĐỒNG THUẬN PHỤ HUYNH & TỐI ƯU IN KHỔ A4
**Giai đoạn:** Giai đoạn 4 (Sprint 4)  
**Thời lượng dự kiến:** 2 ngày  
**Mục tiêu Sprint:** Xây dựng Báo cáo Đồng thuận Phụ huynh 2 cột song song (năng lực thực chứng vs thị trường lao động/rủi ro 185 triệu), Vùng Đồng thuận với 3 câu hỏi bàn ăn gia đình và căn chỉnh CSS `@media print` xuất file PDF đúng 1 trang A4 chuẩn.

---

## 1. Danh Mục Tài Liệu Bắt Buộc Đọc (Reading Dossier)
1. [specs/UI_UX_Wireframe_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/UI_UX_Wireframe_Spec.md):
   - Mục 4: Wireframe Màn hình 3 (Báo Cáo Đồng Thuận Phụ Huynh).
   - Mục 5: Đặc tả CSS Cho Khổ Giấy In A4 (`@page { size: A4 portrait; margin: 10mm; }`, `.no-print`).
2. [specs/SRS.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/SRS.md):
   - `FR-07` (Báo cáo đồng thuận 2 cột), `FR-08` (Bộ câu hỏi gợi mở thảo luận bữa tối), `FR-09` (Xuất báo cáo bản in PDF/A4), `NFR-04` (Khả năng in ấn chuẩn xác).
3. [specs/Data_Schema_&_Seed_Data.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Data_Schema_&_Seed_Data.md):
   - Bảng tính chi phí lãng phí 185.000.000 VNĐ khi chọn sai ngành/bỏ học giữa chừng.

---

## 2. Danh Sách Nhiệm Vụ (Sprint Backlog)
* [ ] `TASK-P4-01`: Xây dựng `ParentAlignmentKit.tsx` (bố cục 2 cột, cảnh báo 185 triệu, 3 câu hỏi bàn ăn).
* [ ] `TASK-P4-02`: Tinh chỉnh CSS in ấn trong `src/index.css` và nút gọi `window.print()`.
* [ ] `TASK-P4-03`: Tích hợp toàn bộ luồng vào `src/App.tsx` và viết kiểm thử E2E `tests/integration/e2eFlow.test.tsx`.

---

## 3. Cổng Nghiệm Thu Chất Lượng (Sprint 4 DoD Gate)
```bash
npm test && npm run build
```
- **Tiêu chí:** Toàn bộ test suite PASS 100%, in thử nghiệm trên trình duyệt ra file PDF gọn trong 1 trang A4 portrait không bị vỡ layout hay nhảy dòng chữ.
