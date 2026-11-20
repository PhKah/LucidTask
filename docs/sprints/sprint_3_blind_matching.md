# HỒ SƠ ĐIỀU PHỐI: SPRINT 3 — HỒ SƠ NĂNG LỰC & KHUNG GHÉP NỐI ẨN DANH
**Giai đoạn:** Giai đoạn 3 (Sprint 3)  
**Thời lượng dự kiến:** 2 – 3 ngày  
**Mục tiêu Sprint:** Xây dựng màn hình hiển thị 3 thước đo năng lực trực quan (Tư duy Logic, Độ kiên nhẫn, Sức bền giờ G) và cơ chế Blind Matching (che tên trường thật, mở khóa danh tính bằng nút hành động và hiệu ứng pháo hoa `canvas-confetti`).

---

## 1. Danh Mục Tài Liệu Bắt Buộc Đọc (Reading Dossier)
1. [specs/UI_UX_Wireframe_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/UI_UX_Wireframe_Spec.md):
   - Mục 3: Wireframe Màn hình 2 (Bảng Ghép Nối Ẩn Danh & Hồ Sơ Năng Lực).
2. [specs/SRS.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/SRS.md):
   - `FR-05` (Hồ sơ năng lực 3 trục), `FR-06` (Ghép nối chương trình ẩn danh & Mở khóa thực chứng).
3. [specs/QA_TEST_PLAN.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/QA_TEST_PLAN.md):
   - Ca kiểm thử bất biến `IT-BLIND-01`: Khẳng định tên trường thật tuyệt đối không tồn tại trong DOM dưới bất kỳ dạng nào trước khi người dùng kích hoạt hành động Reveal.
4. [specs/SOFTWARE_DESIGN_DOCUMENT.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/SOFTWARE_DESIGN_DOCUMENT.md):
   - Mục 4.2: Biểu đồ tuần tự Sequence Diagram Luồng Ghép Nối Ẩn Danh & Mở Khóa.

---

## 2. Danh Sách Nhiệm Vụ (Sprint Backlog)
* [ ] `TASK-P3-01`: Xây dựng `CompetencyRadar.tsx` (3 thanh đo trực quan cam/xanh/đỏ và 2 nhận định định tính).
* [ ] `TASK-P3-02`: Xây dựng `BlindMatchingCards.tsx` (thẻ mã hóa Alpha/Beta, nút mở khóa, hiệu ứng `canvas-confetti`, render thông tin trường sau khi mở khóa).
* [ ] `TASK-P3-03`: Viết Invariant Test `tests/integration/blindMatching.test.tsx` (`IT-BLIND-01`, `IT-REVEAL-01`).

---

## 3. Cổng Nghiệm Thu Chất Lượng (Sprint 3 DoD Gate)
```bash
npm test tests/integration/blindMatching.test.tsx
```
- **Tiêu chí:** Test `IT-BLIND-01` PASS 100% (quét `document.body.innerHTML` không chứa từ khóa "Bách Khoa", "FPT", "RMIT"... trước khi Reveal); sau khi mở khóa, thông tin hiển thị chính xác.
