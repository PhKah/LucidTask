# HỒ SƠ ĐIỀU PHỐI: SPRINT 5 — THỰC NGHIỆM THỰC ĐỊA & XÁC THỰC GIẢ THUYẾT ĐMST
**Giai đoạn:** Giai đoạn 5 (Sprint 5)  
**Thời lượng dự kiến:** 5 – 7 ngày  
**Mục tiêu Sprint:** Triển khai thử nghiệm Pilot nội bộ (N=5) và nghiên cứu thực địa chính thức với 20–30 cặp học sinh & phụ huynh; thu thập số liệu kiểm chứng 4 giả thuyết ($H_0 \rightarrow H_3$) phục vụ nghiệm thu Đồ án Đổi Mới Sáng Tạo.

---

## 1. Danh Mục Tài Liệu Bắt Buộc Đọc (Reading Dossier)
1. [docs/validation/Validation_Plan.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/docs/validation/Validation_Plan.md):
   - Mục 1: Hệ thống 4 Giả thuyết nghiên cứu cốt lõi ($H_0, H_1, H_2, H_3$).
   - Mục 2: Kịch bản thử nghiệm thực tế theo quy trình 4 giai đoạn.
   - Mục 3: Bộ chỉ số thành công (SUS Score, Filter Validity, Decision Shift Rate).
2. [docs/validation/OBSERVATION_LOG_TEMPLATE.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/docs/validation/OBSERVATION_LOG_TEMPLATE.md):
   - Mẫu phiếu ghi chép quan sát hành vi học sinh và phản ứng của phụ huynh.
3. [specs/AI_DLC_Eval_&_Data_Feasibility_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/AI_DLC_Eval_&_Data_Feasibility_Spec.md):
   - Mục 4: Khung 4 Tầng Giảm Thiểu Thiên Vị trong thu thập và đối soát dữ liệu.

---

## 2. Danh Sách Nhiệm Vụ (Sprint Backlog)
* [ ] `TASK-P5-01`: Triển khai ứng dụng lên môi trường live Staging/Production (Vercel).
* [ ] `TASK-P5-02`: Chạy thử nghiệm Pilot nội bộ (N = 5 học sinh) để căn chỉnh độ nhạy Gatekeeper.
* [ ] `TASK-P5-03`: Triển khai thực nghiệm thực địa với 20–30 cặp học sinh và phụ huynh.
* [ ] `TASK-P5-04`: Tổng hợp dữ liệu thực nghiệm vào `docs/validation/FIELD_VALIDATION_REPORT.md` để đưa vào Báo cáo môn học ĐMST.

---

## 3. Cổng Nghiệm Thu Chất Lượng (Sprint 5 DoD Gate)
- **Tiêu chí:**
  - $H_0$: $\ge 75\%$ học sinh bị dừng sớm đồng ý với kết luận.
  - $H_1$: $\ge 40\%$ học sinh chọn trường ngoài danh sách định kiến ban đầu sau khi mở khóa.
  - $H_2$: $\ge 80\%$ người tham gia tin tưởng điểm số đo bằng tác vụ hơn trắc nghiệm.
  - $H_3$: $\ge 70\%$ phụ huynh thay đổi góc nhìn về chọn ngành/trường cho con sau khi đọc báo cáo.
