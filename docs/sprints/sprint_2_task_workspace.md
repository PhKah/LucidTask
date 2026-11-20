# HỒ SƠ ĐIỀU PHỐI: SPRINT 2 — KHÔNG GIAN TÁC VỤ & 2 ARCHETYPES TƯƠNG TÁC
**Giai đoạn:** Giai đoạn 2 (Sprint 2)  
**Thời lượng dự kiến:** 3 – 4 ngày  
**Mục tiêu Sprint:** Xây dựng giao diện lựa chọn ngành, không gian tác vụ thực chứng 2 chặng lũy tiến, bộ đếm thời gian với hiệu ứng căng thẳng $\le 60$s, 2 Archetypes tương tác (`Triage` và `Multi-Source Inspection`), sổ tay Drawer và màn hình Dừng Sớm Early Exit.

---

## 1. Danh Mục Tài Liệu Bắt Buộc Đọc (Reading Dossier)
1. [specs/Task_Engine_Architecture.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/Task_Engine_Architecture.md):
   - Mục 2: Đặc tả 4 Universal Interaction Archetypes (Tập trung Archetype 1 - Triage & Classify và Archetype 3 - Multi-Source Investigation).
2. [specs/UI_UX_Wireframe_Spec.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/UI_UX_Wireframe_Spec.md):
   - Mục 2: Wireframe Màn hình 1 (Không gian tác vụ, Stepper, Live HUD, Drawer tra cứu quy tắc).
   - Mục 4: Wireframe Màn hình Dừng Sớm (Early Exit Compass Screen).
3. [specs/SRS.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/SRS.md):
   - `FR-01` (Chọn ngành nghề), `FR-02` (Không gian mô phỏng), `FR-03` (Bộ lọc Early Exit), `FR-04` (Sổ tay Handbook tra cứu).
4. [.AGENTS/DESIGN.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/.AGENTS/DESIGN.md):
   - Quy cách Header console tối màu `#100e2f`, logo block cam `#fa9000`, thẻ trắng viền hairline `#d8d8d8`.

---

## 2. Danh Sách Nhiệm Vụ (Sprint Backlog)
* [ ] `TASK-P2-01`: Xây dựng `AppShell.tsx` và `IndustrySelector.tsx`.
* [ ] `TASK-P2-02`: Xây dựng `TaskWorkspace.tsx`, đồng hồ đếm ngược (đổi viền đỏ `#c31833` khi $\le 60$s) và `HandbookDrawer.tsx`.
* [ ] `TASK-P2-03`: Xây dựng 2 Archetype components (`TriageClassifier.tsx` và `MultiSourceInspector.tsx`).
* [ ] `TASK-P2-04`: Xây dựng `EarlyExitScreen.tsx` và bộ điều hướng la bàn tư vấn khi click ẩu.
* [ ] `TASK-P2-05`: Viết Integration Tests `tests/integration/workspace.test.tsx` (`IT-WORK-01`, `IT-WORK-02`).

---

## 3. Cổng Nghiệm Thu Chất Lượng (Sprint 2 DoD Gate)
```bash
npm test tests/integration/workspace.test.tsx
```
- **Tiêu chí:** Thao tác click ẩu (< 1.2s hoặc độ chính xác < 60%) tự động kích hoạt `EarlyExitScreen` trước mốc 90s; thao tác chuẩn chuyển tiếp mượt mà sang Chặng 2 trong $\le 1$ giây.
