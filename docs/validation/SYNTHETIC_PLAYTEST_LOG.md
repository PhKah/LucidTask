# NHẬT KÝ KIỂM THỬ GIẢ LẬP HỌC SINH THPT & VÒNG LẶP CẢI TIẾN UX LIÊN TỤC (SYNTHETIC PLAYTEST LOG)

**Dự án:** LucidTask v2.0 MVP — Nền tảng Hướng nghiệp & Trải nghiệm Tác vụ Thực chứng  
**Mã tài liệu:** `VAL-PLAYTEST-2026-02`  
**Giai đoạn:** Phase 2 — Synthetic High-School Playtest Loop + Continuous UX Patching  
**Môi trường kiểm thử thực tế:** `http://localhost:5173/` (Vite 5.4.21 + Google Chrome `158.0.8127.36` qua `playwright-core` độc lập tại `/tmp/lucidtask-pw`)  
**Phạm vi màn hình:** `IndustrySelector` → `MissionBriefing` → `IND_LOG_COLDCHAIN` (`LogisticsDispatchBoard.tsx`) → `IND_QA_DATA` (`QaDataWorkbench.tsx`) → `MissionDebrief.tsx` → `CompetencyRadar` & `BlindMatchingCards` (`IT-BLIND-01`) → `ParentAlignmentKit`  
**Tổng số vòng lặp:** 3 vòng (`Round 1 Baseline` → `Round 2 Sau Vá Đợt 1` → `Round 3 Xác Minh Cuối`)  
**Kết quả cuối cùng:** Đạt mục tiêu **toàn bộ 3 persona $\ge 4.5 / 5$ ở cả 5 tiêu chí**, **0 điểm nghẽn P0/P1 tồn đọng**, bảo toàn **100% bất biến R3**.

---

## 1. Phương Pháp Kiểm Thử & Hồ Sơ 3 Persona THPT

### 1.1. Thiết kế 3 Persona Đại Diện
1. **Minh Anh (Lớp 11, khối A01 — Cẩn thận, thích tự tính toán | Viewport: `1440×900`)**
   - *Hành vi:* Đọc kỹ số liệu Cột Trái, tự nhẩm phép tính đánh đổi (`2 tấn × 12 giờ × 3tr = 72 triệu` phạt SLA Lô #A so với `2 tấn × 80tr = 160 triệu` hỏng Lô #B), nhập số liệu trực tiếp vào ô ma trận, rà soát toàn bộ 15 đơn hàng và 7 bước sơ đồ tiếng Việt, đối chiếu kỹ màn hình `MissionDebrief` và `BlindMatchingCards`.
   - *Trọng tâm kiểm tra:* Tốc độ & độ mượt thao tác nhập liệu, độ khớp giữa phép tính tay và kết quả Debrief, độ tin cậy của tỷ lệ `% Tương thích` ở `BlindMatchingCards`.
2. **Gia Huy (Lớp 12 — Nhanh ẩu, dễ tin vào AI Co-pilot | Viewport: `1440×900`)**
   - *Hành vi:* Đọc lướt, bấm ngay **`AI Co-pilot: Tối ưu lịch trình`** (Logistics) và **`AI Auto-QA: Quét lỗi tự động`** (QA), tin vào lời hứa `"0đ phạt SLA"` và `"DUYỆT RELEASE"`, bỏ trống ô tự tính thiệt hại, không mở Tab 2 Sơ đồ luồng, chốt lệnh nhanh.
   - *Trọng tâm kiểm tra:* Độ chân thực của mồi nhử AI, tính thụ động tuyệt đối của `Passive Resource Ledger` (không lộ cảnh báo đỏ trước khi nộp), và sức nặng "cảnh tỉnh" tại `MissionDebrief`.
3. **Khánh Linh (Lớp 11 — Zero kiến thức nền Logistics & CNTT | Viewport: `1280×800`)**
   - *Hành vi:* Không biết trước các khái niệm `SLA`, `Cấp đông sâu`, `Release`, `Bug logic`; dựa hoàn toàn vào `MissionBriefing` ($\le 30$ giây) và bố cục trực quan trên màn hình laptop phổ thông `1280×800`.
   - *Trọng tâm kiểm tra:* Khả năng hiểu luật trong $\le 30$ giây, hiện tượng tràn/cắt cột trên `1280×800`, độ thân thiện ngôn ngữ, và liệu câu hỏi kiểm tra bước sạch ở Tab 2 QA có gây ngộ nhận dẫn tới bấm nhầm lỗi hay không.

### 1.2. Thang Chấm 5 Tiêu Chí (Scale `1–5`)
1. **Tiêu chí 1 — Độ dễ hiểu đầu vào ($\le 30\text{s}$):** Học sinh chưa có nền tảng nắm được mục tiêu & luật chơi trong $\le 30$ giây.
2. **Tiêu chí 2 — Tính chủ động phi trắc nghiệm:** Trải nghiệm mang tính kiến tạo/điều phối/săn lỗi thật thay vì chọn đáp án A/B/C/D.
3. **Tiêu chí 3 — Bố cục thị giác & thao tác:** Phân tầng rõ ràng, không cắt cột/tràn ngang trên `1280×800` & `1440×900`, thao tác nhập/bấm mượt.
4. **Tiêu chí 4 — Độ sắc bén Cạm bẫy AI & Bảng thụ động:** Bẫy AI đủ sức thuyết phục; `Passive Resource Ledger` giữ nguyên trung tính 100% lúc chơi.
5. **Tiêu chí 5 — Hiệu ứng giải tỏa (*Closure & Catharsis*):** `MissionDebrief` & `BlindMatchingCards` đối chiếu rõ ràng phương án học sinh vs. chuẩn nghề nghiệp, khép lại bằng điểm nhấn cảm xúc thuyết phục.

---

## 2. Vòng 1 — Kiểm Thử Baseline (Chưa Vá)

### 2.1. Hành Trình Thực Tế & Ảnh Chụp Màn Hình (Round 1)
- **Minh Anh (`1440×900`):**
  - Hoàn thành tối ưu `IND_LOG_COLDCHAIN` (`99/100`, thiệt hại `72.000.000đ`) và `IND_QA_DATA` (`95/100`, `8/8` lỗi dữ liệu, `2/2` lỗi logic, `CHẶN RELEASE`), $0$ lỗi console/page.
  - **Quan sát ma sát thực tế:** Khi click vào ô `Lô #A - Xe 20ft #1` (đang chứa giá trị `0`) và gõ `15` từ bàn phím, ô nhập liệu tạo ra chuỗi **`"015"`** (`typedValOnClickType15: "015"`). Ở `MissionDebrief`, con số tự tính `72` mà Minh Anh nhập không được hiển thị lại để đối chiếu. Khi sang `BlindMatchingCards`, cả 3 thẻ đầu (`THẺ ALPHA`, `THẺ BETA`, `THẺ GAMMA`) đều hiển thị **`35% TƯƠNG THÍCH`** dù điểm năng lực đạt `99/100`, và nhãn `MÃ HOLLAND: R-E-C` bị xuống dòng thành `R-E-\nC`.
  - Ảnh minh chứng: [`minh_anh_01_landing.png`](./screenshots/round_1/minh_anh_01_landing.png), [`minh_anh_02_log_briefing.png`](./screenshots/round_1/minh_anh_02_log_briefing.png), [`minh_anh_03_log_board.png`](./screenshots/round_1/minh_anh_03_log_board.png), [`minh_anh_04_log_debrief.png`](./screenshots/round_1/minh_anh_04_log_debrief.png), [`minh_anh_05_blind_matching.png`](./screenshots/round_1/minh_anh_05_blind_matching.png), [`minh_anh_06_qa_grid.png`](./screenshots/round_1/minh_anh_06_qa_grid.png), [`minh_anh_07_qa_flow.png`](./screenshots/round_1/minh_anh_07_qa_flow.png), [`minh_anh_08_qa_debrief.png`](./screenshots/round_1/minh_anh_08_qa_debrief.png), [`minh_anh_09_revealed_cards.png`](./screenshots/round_1/minh_anh_09_revealed_cards.png), [`minh_anh_10_parent_report.png`](./screenshots/round_1/minh_anh_10_parent_report.png).
- **Gia Huy (`1440×900`):**
  - Bấm `AI Co-pilot: Tối ưu lịch trình` → `Passive Resource Ledger` hiển thị `Xe 20ft #1: 18 tấn` hoàn toàn trung tính (0 class đỏ, 0 chữ cảnh báo quá tải). Chốt lệnh nhanh (bỏ trống ô tự tính) → Debrief chấm `42/100` và bật banner đỏ **`CẢNH BÁO PHỤ THUỘC AI: BẠN ĐÃ DÍNH BẪY AI CO-PILOT!`**.
  - Sang `IND_QA_DATA`, bấm `AI Auto-QA: Quét lỗi tự động` và nộp ngay **không hề mở Tab 2** → Debrief chấm `20/100`, bắt dính bẫy `APPROVE_RELEASE` và `DH-1107`.
  - **Quan sát ma sát thực tế:** Có thể nộp bài QA khi chưa từng mở Tab 2 mà không có bất kỳ dấu nhắc thị giác nào (`CHƯA MỞ`), và Debrief chưa chỉ rõ việc học sinh bỏ trống ô tự tính thiệt hại hoặc bỏ qua Tab 2.
  - Ảnh minh chứng: [`gia_huy_01_log_ai_trap.png`](./screenshots/round_1/gia_huy_01_log_ai_trap.png), [`gia_huy_02_log_debrief_trap.png`](./screenshots/round_1/gia_huy_02_log_debrief_trap.png), [`gia_huy_03_qa_ai_trap.png`](./screenshots/round_1/gia_huy_03_qa_ai_trap.png), [`gia_huy_04_qa_debrief_trap.png`](./screenshots/round_1/gia_huy_04_qa_debrief_trap.png).
- **Khánh Linh (`1280×800`):**
  - **Quan sát ma sát thực tế (nghiêm trọng):** Trên màn hình `1280×800`, bảng Ma trận Điều phối Logistics ở Cột Giữa có `scrollWidth = 635px` nằm trong vùng chứa `clientWidth = 562px` (`hasHScroll = true`), khiến **cột `Bãi chờ 03:30` bị cắt khuất hoàn toàn và cột `Kho lạnh HP` bị xén một nửa**! Ngoài ra, tiêu đề cột ma trận thiếu mức tải trọng tĩnh (`≤15t`, `≤5t`), chữ báo lệch tổng lô `(dư 1t)` quá mờ (`10px`), chưa có chú thích tiếng Việt bình dân cho `SLA`/`Release`, và khi bấm vào Bước 1 (bước hợp lệ) ở Tab 2 QA, câu hỏi *"Bạn phát hiện lỗ hổng logic nào tại Bước 1?"* dễ khiến người mới hiểu nhầm là bắt buộc phải chọn 1 trong 2 lỗi.
  - Ảnh minh chứng: [`khanh_linh_01_log_briefing_1280.png`](./screenshots/round_1/khanh_linh_01_log_briefing_1280.png), [`khanh_linh_02_log_board_1280.png`](./screenshots/round_1/khanh_linh_02_log_board_1280.png), [`khanh_linh_03_qa_briefing_1280.png`](./screenshots/round_1/khanh_linh_03_qa_briefing_1280.png), [`khanh_linh_04_qa_grid_1280.png`](./screenshots/round_1/khanh_linh_04_qa_grid_1280.png), [`khanh_linh_05_qa_flow_node1_1280.png`](./screenshots/round_1/khanh_linh_05_qa_flow_node1_1280.png).

### 2.2. Bảng Điểm 5 Tiêu Chí — Round 1 (Baseline)

| Persona | (1) Dễ hiểu $\le 30$s | (2) Chủ động phi MCQ | (3) Bố cục & Thao tác | (4) Bẫy AI & Bảng thụ động | (5) Giải tỏa Debrief & Matching | Trung bình |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Minh Anh (11 A01)** | 4.5 | 4.5 | **3.8** | 4.8 | **3.6** | 4.24 |
| **Gia Huy (12)** | **4.4** | **4.2** | **4.2** | 4.8 | **4.0** | 4.32 |
| **Khánh Linh (11)** | **3.8** | **4.0** | **3.2** | 4.6 | **4.1** | 3.94 |

### 2.3. Tổng Hợp Điểm Nghẽn Vòng 1 & Bản Vá Đợt 1 (`Patch Batch 1`)
- **P0 — Tràn ngang & cắt cột Ma trận Logistics trên laptop `1280×800` (`LogisticsDispatchBoard.tsx`):** Bảng `635px` vượt khung `562px` làm khuất cột `Bãi chờ 03:30`.
  - *Bản vá:* Tối ưu độ rộng cột (`w-[108px]` cột Lô hàng, `min-w-[66px]` cột phương tiện, `w-7` cho input số, `px-0.5` padding ô) giúp toàn bộ 6 cột nằm gọn `562/562px` (`hasHScroll = false`), đồng thời bổ sung thông số tĩnh (`15:00 • ≤15t`, `15:00 • ≤5t`, `-18→0°C • ≤15t`, `03:30 • Bãi`) ngay tại tiêu đề cột ma trận (vẫn giữ **Passive Resource Ledger** Cột Phải 100% thụ động chỉ hiện tổng số tấn thô).
- **P1 — Lỗi kẹt số `"015"` khi click gõ vào ô đang có giá trị `0` (`LogisticsDispatchBoard.tsx`):**
  - *Bản vá:* Bổ sung `onFocus={e => e.currentTarget.select()}`, tự động bôi đen số `0` khi click vào, và chuẩn hóa bỏ số `0` đứng đầu trong `onChange` (`replace(/^0+(?=\d)/, '')`).
- **P1 — Lỗi công thức Matching khiến cả 3 thẻ đầu chỉ hiện `35% TƯƠNG THÍCH` (`ScoringEngine.ts` + `CompetencyRadar.tsx`):**
  - *Bản vá:* Chuẩn hóa `userVector` về cùng đơn vị tỷ trọng simplex với `match_traits` của chương trình trước khi gọi `computeCosineMatch` (giữ nguyên hàm `computeCosineMatch` để bảo toàn `UT-COSINE-01`/`UT-COSINE-02`), kết hợp hệ số năng lực `0.62 + 0.38 * (composite / 100)`; sửa thẻ `MÃ HOLLAND: {riasec.top_code}` với `whitespace-nowrap` không bị xuống dòng.
- **P1 — Thiếu phản chiếu con số tự tính & bản giải trình trong `MissionDebrief.tsx` (`types/mission.ts`, `MissionEvaluators.ts`, `MissionDebrief.tsx`):**
  - *Bản vá:* Truyền `estimatedDamageMillionVnd`, `contingencyPlanText`, `tabSwitchCount` vào kết quả đánh giá để `MissionDebrief` hiển thị đối chiếu trực tiếp (`Số bạn tự tính trước đó: 72 triệu VNĐ (Khớp chuẩn!)` hoặc nhắc nhở khi bỏ trống/bỏ qua Tab 2).
- **P1 — Nguy cơ bỏ sót Tab 2 & câu hỏi dẫn dụ bấm nhầm bước sạch trong QA (`QaDataWorkbench.tsx`):**
  - *Bản vá:* Thêm trạng thái `visitedFlowTab` hiển thị nhãn **`CHƯA MỞ`** trên Tab 2 và cảnh báo nhẹ ở chân form nộp bài nếu chưa mở Tab 2; đổi tiêu đề node mở rộng thành *"Kiểm tra Bước X: Bước này có lỗ hổng logic nào không?"* và nâng cấp nút **"Bước này hợp lệ (Không có lỗi — Gỡ thẻ)"** thành nút viền rõ ràng.
- **P1 — Thuật ngữ chuyên ngành (`SLA`, `Release`, `Cấp đông sâu`) & trạng thái cân bằng từng lô mờ (`MissionBriefing.tsx`, `LogisticsDispatchBoard.tsx`, `QaDataWorkbench.tsx`):**
  - *Bản vá:* Thêm hộp **"Giải mã nhanh"** ngắn gọn (2 dòng) ngay trong `MissionBriefing`, đổi `DEADLINE RELEASE` thành `MỐC MỞ BÁN (RELEASE)`, và hiển thị nhãn `(còn Xt)` / `(dư Xt)` / `đủ` có độ tương phản cao trên từng dòng lô hàng.
- **P1 — Edge-case đánh giá khi bác bỏ AI rồi tự chỉnh tay quá tải (`MissionEvaluators.ts`):**
  - *Bản vá:* Tôn trọng cờ `aiExplicitlyRejected` khi người dùng đã bấm bác bỏ đề xuất AI, tránh gắn nhầm nhãn `TRIGGERED_AND_ACCEPTED`.

---

## 3. Vòng 2 — Kiểm Thử Sau Bản Vá Đợt 1

### 3.1. Kết Quả Quan Sát Trên Trình Duyệt Thật (Round 2)
- **Minh Anh (`1440×900`):**
  - Click ô `Lô #A - Xe 20ft #1` và gõ `15` → giá trị hiển thị chuẩn xác **`"15"`** (hết hẳn `"015"`).
  - Tại `MissionDebrief`, hiển thị rõ **`Số bạn tự tính trước đó: 72 triệu VNĐ (Khớp chuẩn!)`** và trích dẫn nguyên văn **`BẢN GIẢI TRÌNH BẠN ĐÃ GỬI GIÁM ĐỐC VẬN HÀNH`**.
  - Tại `BlindMatchingCards`, `MÃ HOLLAND: R-E-C` nằm gọn 1 dòng; 3 thẻ Logistics hiển thị **`96% TƯƠNG THÍCH`**, **`96% TƯƠNG THÍCH`**, **`94% TƯƠNG THÍCH`** (và 3 thẻ QA hiển thị `96% / 95% / 92%`). `IT-BLIND-01` qua sạch (`0` tên trường lộ diện).
  - Ảnh: [`minh_anh_01_log_briefing.png`](./screenshots/round_2/minh_anh_01_log_briefing.png), [`minh_anh_02_log_board.png`](./screenshots/round_2/minh_anh_02_log_board.png), [`minh_anh_03_log_debrief.png`](./screenshots/round_2/minh_anh_03_log_debrief.png), [`minh_anh_04_blind_matching.png`](./screenshots/round_2/minh_anh_04_blind_matching.png), [`minh_anh_05_qa_debrief.png`](./screenshots/round_2/minh_anh_05_qa_debrief.png).
- **Gia Huy (`1440×900`):**
  - `Passive Resource Ledger` vẫn giữ trung tính 100% (`hasRedClass: false`, `hasAlertText: false`, hiển thị `18 tấn`).
  - Debrief Logistics chỉ rõ **`Bạn đã bỏ trống ô tự tính thiệt hại trước khi chốt lệnh`**; Debrief QA cảnh báo đỏ **`Cảnh báo: Bạn đã chốt lệnh mà chưa mở Tab 2 (Sơ đồ luồng)!`**; Blind Matching phân tách rõ mức độ phù hợp xuống `76% / 73% / 73%`.
  - **Phát hiện nhỏ khi soi ảnh [`gia_huy_02_qa_ai_trap_unvisited_tab2.png`](./screenshots/round_2/gia_huy_02_qa_ai_trap_unvisited_tab2.png):** Do nút `DUYỆT RELEASE (APPROVE)` dùng class `transition-all`, ngay khoảnh khắc AI Auto-QA tự động chọn nút đó, nền nút đang chuyển pha sang màu xám trung gian nên chữ trắng bị mờ tạm thời, đồng thời Debrief QA chưa trích dẫn lại `bugReportNote` của học sinh như bên Logistics.
  - Ảnh: [`gia_huy_01_log_debrief_trap.png`](./screenshots/round_2/gia_huy_01_log_debrief_trap.png), [`gia_huy_02_qa_ai_trap_unvisited_tab2.png`](./screenshots/round_2/gia_huy_02_qa_ai_trap_unvisited_tab2.png), [`gia_huy_03_qa_debrief_trap.png`](./screenshots/round_2/gia_huy_03_qa_debrief_trap.png).
- **Khánh Linh (`1280×800`):**
  - Bảng ma trận Logistics vừa khít **`562/562px`** (`hasHScroll: false`, không còn cắt cột `Bãi chờ 03:30` hay `Kho lạnh HP`), đầy đủ thông số tĩnh `15:00 • ≤15t`, `15:00 • ≤5t`, `-18→0°C • ≤15t`, nhãn `(còn 14t)` nổi bật.
  - Hộp **"Giải mã nhanh"** tại Briefing giúp nắm thuật ngữ trong $<30$ giây; nút **"Bước này hợp lệ (Không có lỗi — Gỡ thẻ)"** ở Tab 2 QA loại bỏ hoàn toàn tâm lý bị ép chọn lỗi.
  - Ảnh: [`khanh_linh_01_log_briefing_1280.png`](./screenshots/round_2/khanh_linh_01_log_briefing_1280.png), [`khanh_linh_02_log_board_1280.png`](./screenshots/round_2/khanh_linh_02_log_board_1280.png), [`khanh_linh_03_qa_grid_1280.png`](./screenshots/round_2/khanh_linh_03_qa_grid_1280.png), [`khanh_linh_04_qa_flow_node1_1280.png`](./screenshots/round_2/khanh_linh_04_qa_flow_node1_1280.png).

### 3.2. Bảng Điểm 5 Tiêu Chí — Round 2

| Persona | (1) Dễ hiểu $\le 30$s | (2) Chủ động phi MCQ | (3) Bố cục & Thao tác | (4) Bẫy AI & Bảng thụ động | (5) Giải tỏa Debrief & Matching | Trung bình |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Minh Anh (11 A01)** | 4.8 | 4.9 | 4.8 | 4.9 | 4.7 | 4.82 |
| **Gia Huy (12)** | 4.7 | 4.6 | **4.4** | 4.9 | 4.6 | 4.64 |
| **Khánh Linh (11)** | 4.7 | 4.7 | 4.8 | 4.8 | 4.7 | 4.74 |

*(Lưu ý: Gia Huy Tiêu chí 3 chấm `4.4` do hiệu ứng `transition-all` gây nháy nền xám ở nút `DUYỆT RELEASE` khi AI kích hoạt tự động — kích hoạt Patch Batch 2 và chạy Vòng 3 xác minh).*

### 3.3. Bản Vá Đợt 2 (`Patch Batch 2`)
1. Loại bỏ `transition-all` trên 2 nút `CHẶN RELEASE (BLOCK)` và `DUYỆT RELEASE (APPROVE)` trong `src/components/missions/QaDataWorkbench.tsx` để chuyển trạng thái đen/trắng sắc nét tức thì khi AI Auto-QA tự động chọn.
2. Bổ sung hộp trích dẫn **`Bản báo cáo lỗi bạn đã gửi Đội Kỹ Thuật`** vào `QaAuditDetails` trong `src/components/missions/MissionDebrief.tsx` cho đồng bộ với phần giải trình của Logistics.
3. **Chống rò rỉ đáp án trong câu chữ gợi ý (Anti-Leakage Copy Fixes):**
   - Tại `src/components/missions/QaDataWorkbench.tsx` (`#qa-bug-report-note`), thay `placeholder` cũ có nêu đích danh lỗi (`ngày 30/02, giá âm... Bước 3 (âm tiền) và Bước 5...`) bằng câu dẫn cấu trúc trung tính (*"VD: Tóm tắt các nhóm lỗi dữ liệu bạn phát hiện ở Bảng 15 đơn, bước nào trong Sơ đồ luồng có lỗ hổng gây sai tiền/tồn kho và lý do bạn chọn CHẶN hay DUYỆT release..."*).
   - Tại `src/components/missions/LogisticsDispatchBoard.tsx` (`#estimated-damage-input` và hộp gợi ý bên cạnh), thay `placeholder="VD: 72"` bằng `"Nhập số triệu VNĐ"` và làm mềm câu gợi ý tự tính thành hướng dẫn đối chiếu tiền phạt giao trễ 12 giờ với giá trị hàng hỏng qua đêm theo số liệu ở Thẻ 1 (Cột Trái), không tiết lộ tên lô hàng hay đơn giá cụ thể.
   - Tại `src/registry/index.ts` (màn hình Landing `IndustrySelector.tsx`), thay dòng nổi bật `'Bài toán đánh đổi thiệt hại tài chính (72tr phạt SLA vs 160tr hỏng trái cây)'` bằng `'Bài toán đánh đổi thiệt hại tài chính (phạt trễ SLA vs. nguy cơ hỏng hàng qua đêm)'` để tránh lộ đáp án trước khi vào nhiệm vụ.
   - Tại `src/registry/qa_data_cleaning/scenario.ts` (khung `Quy Chuẩn Dữ Liệu 4 Dòng` Cột Trái trong `QaDataWorkbench.tsx`), thay 4 ví dụ trùng nguyên văn các đơn lỗi thật bằng 4 ví dụ minh họa độc lập (`VD: 31/04/2026 hoặc 2026-25-13`, `VD: Đơn giá âm hoặc 2 × 90k ≠ 150k`, `VD: 18:05 và 18:06 cùng SĐT & mặt hàng`, `VD: SĐT chỉ có 8 số hoặc Địa chỉ để trống`).
4. **Giữ vững nhắc nhở Tab 2 `CHƯA MỞ` khi kích hoạt AI Auto-QA (`QaDataWorkbench.tsx`):** Sửa điều kiện hiển thị nhãn `CHƯA MỞ` trên Tab 2 và cảnh báo ở chân form nộp bài từ `!visitedFlowTab && flaggedNodeCount === 0` thành **`!visitedFlowTab`**, đảm bảo cả hai dấu nhắc vẫn hiển thị ngay cả khi `AI Auto-QA` tự động gắn thẻ `NODE_3`, và chỉ biến mất khi học sinh thực sự mở Tab 2.
5. **Khắc phục 2 edge-case chấm điểm & đặt lại (`QaDataWorkbench.tsx`, `MissionEvaluators.ts`, `MissionDebrief.tsx`, `LogisticsDispatchBoard.tsx`):**
   - Bỏ fallback tự động gán `BLOCK_RELEASE` khi hết giờ trong `QaDataWorkbench.tsx` (`releaseDecision: ReleaseDecision | null`), cập nhật `evaluateQaDataMission` và `MissionDebrief.tsx` để hiển thị rõ **`CHƯA CHỐT RELEASE (HẾT GIỜ) — SAI`** khi `releaseDecision === null`.
   - Cập nhật `handleResetBoard` (`Đặt lại`) trong `LogisticsDispatchBoard.tsx` để đặt lại cả `aiTriggered` và `aiExplicitlyRejected` về `false`, tránh gắn nhầm nhãn `TRIGGERED_AND_ACCEPTED` nếu học sinh bấm `Đặt lại` rồi tự nhập tay quá tải.
   - Rút gọn biểu thức thừa `truck20ftOverloaded >= 18` trong `MissionEvaluators.ts` về `!submission.aiExplicitlyRejected && overloadViolationsCount > 0`.
6. Bổ sung kiểm thử tự động hồi quy trong `tests/unit/matching.test.ts`, `tests/unit/logisticsEvaluator.test.ts`, `tests/unit/qaEvaluator.test.ts` (case `releaseDecision: null` khi hết giờ), `tests/integration/logisticsFlow.test.tsx` (case `Đặt lại` sau `AI Co-pilot`), và `tests/integration/qaDataFlow.test.tsx` (kiểm tra `CHƯA MỞ` + cảnh báo Tab 2 vẫn tồn tại sau khi bấm `AI Auto-QA` cho đến khi mở Tab 2).

---

## 4. Vòng 3 — Xác Minh Cuối Cùng & Chốt Nghiệm Thu

### 4.1. Kết Quả Kiểm Chứng Trực Tiếp Trên Trình Duyệt (Round 3)
- **Minh Anh (`1440×900`):** Xác nhận màn hình Landing hiển thị nội dung trung tính không rò rỉ đáp án `72tr`/`160tr` ([`minh_anh_00_landing_clean.png`](./screenshots/round_3/minh_anh_00_landing_clean.png)); Debrief QA hiển thị trọn vẹn **`BẢN BÁO CÁO LỖI BẠN ĐÃ GỬI ĐỘI KỸ THUẬT`** ([`minh_anh_01_qa_debrief.png`](./screenshots/round_3/minh_anh_01_qa_debrief.png)); Blind Matching đạt `96% / 95% / 92%` (`IT-BLIND-01` đạt, [`minh_anh_02_blind_matching_final.png`](./screenshots/round_3/minh_anh_02_blind_matching_final.png)); Báo cáo Đồng thuận A4 hoàn chỉnh kèm hiệu ứng confetti ([`minh_anh_03_parent_report.png`](./screenshots/round_3/minh_anh_03_parent_report.png)).
- **Gia Huy (`1440×900`):** Xác nhận sau khi bấm `AI Auto-QA: Quét lỗi tự động` (chưa mở Tab 2): Cột Trái `Quy Chuẩn Dữ Liệu 4 Dòng` chỉ hiển thị 4 ví dụ minh họa độc lập (0 rò rỉ đáp án từ 8 đơn lỗi thật), nút `DUYỆT RELEASE (APPROVE)` hiển thị nền đen đặc – chữ trắng sắc nét tức thì (`transitionDuration: 0s`), `placeholder` ô tóm tắt trung tính không rò rỉ đáp án, đồng thời nhãn **`CHƯA MỞ`** trên Tab 2 và cảnh báo **"Lưu ý: Bạn chưa mở Tab 2..."** ở chân form vẫn hiển thị rõ ràng ([`gia_huy_01_qa_ai_trap_crisp.png`](./screenshots/round_3/gia_huy_01_qa_ai_trap_crisp.png)); Debrief cảnh tỉnh sắc bén khi nộp bài mà chưa mở Tab 2 ([`gia_huy_02_qa_debrief_trap.png`](./screenshots/round_3/gia_huy_02_qa_debrief_trap.png)).
- **Khánh Linh (`1280×800`):** Xác nhận bảng Logistics vừa khít `562/562px` không tràn ngang, `placeholder="Nhập số triệu VNĐ"` và gợi ý tự tính trung tính không lộ đáp án `72` hay đơn giá, `Passive Resource Ledger` giữ nguyên trung tính `18 tấn` không cảnh báo đỏ khi kích hoạt bẫy AI, bấm `Đặt lại` xóa sạch trạng thái AI (`TỰ CHỦ ĐỘC LẬP 100%`), 0 lỗi console/page ([`khanh_linh_01_log_board_1280.png`](./screenshots/round_3/khanh_linh_01_log_board_1280.png)).

### 4.2. Bảng Điểm 5 Tiêu Chí — Round 3 (Cuối Cùng)

| Persona | (1) Dễ hiểu $\le 30$s | (2) Chủ động phi MCQ | (3) Bố cục & Thao tác | (4) Bẫy AI & Bảng thụ động | (5) Giải tỏa Debrief & Matching | Trung bình |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Minh Anh (11 A01)** | **4.8** | **4.9** | **4.8** | **4.9** | **4.9** | **4.86** |
| **Gia Huy (12)** | **4.7** | **4.6** | **4.7** | **4.9** | **4.7** | **4.72** |
| **Khánh Linh (11)** | **4.7** | **4.7** | **4.8** | **4.8** | **4.7** | **4.74** |

- **Điểm thấp nhất trên toàn ma trận (3×5 = 15 ô):** **`4.6 / 5`** ($\ge 4.5 / 5$ ở tất cả 15 ô).
- **Điểm nghẽn P0/P1 còn tồn đọng:** **0 P0, 0 P1**.

---

## 5. Xác Minh Ràng Buộc Bất Biến (R3) & Kiểm Tra Kỹ Thuật

| Ràng buộc R3 | Phương pháp kiểm chứng thực tế | Kết quả |
| :--- | :--- | :---: |
| **1. Passive Resource Ledger thụ động 100%** | Kiểm tra DOM `#passive-resource-ledger` trong Chrome thật khi AI Co-pilot nhồi `18 tấn` lên `Xe 20ft #1` (định mức `15t`) + `tests/integration/logisticsFlow.test.tsx`. `hasRedClass = false`, `hasAlertText = false`, chỉ hiển thị `18 tấn`. | **ĐẠT (100%)** |
| **2. Triết lý Anti-Dogma (`gamification_diegetic_ui_rfc.md`)** | `IND_LOG_COLDCHAIN` dùng ma trận phân bổ tài nguyên có giới hạn vật lý; `IND_QA_DATA` dùng bảng dữ liệu 15 đơn + sơ đồ 7 bước tiếng Việt thuần túy; Briefing kèm giải mã nhanh hiểu trong $\le 30$s. Không áp đặt sổ kế toán lên nghề khác. | **ĐẠT (100%)** |
| **3. Bảo mật Ẩn danh `IT-BLIND-01`** | Quét `document.body.innerHTML` trên Chrome thật ở `BLIND_MATCHING` trước khi nhấn `MỞ KHÓA DANH TÍNH CƠ SỞ ĐÀO TẠO` cho cả Logistics và QA (`leaked = []` qua cả 8 tên trường) + `tests/integration/blindMatching.test.tsx`. | **ĐẠT (100%)** |
| **4. Cổng chất lượng mã nguồn** | Chạy `npm run type-check && npm test && npm run build` sau bản vá cuối cùng. | **ĐẠT (0 lỗi)** |

### Kết quả chính xác của chuỗi lệnh kiểm tra cuối cùng
- `npm run type-check` (`tsc --noEmit`): **0 lỗi** (exit code `0`).
- `npm test` (`vitest run`): **9 test files passed (9), 26 tests passed (26)**.
- `npm run build` (`tsc && vite build`): **2164 modules transformed**, tạo `dist/` thành công với **0 lỗi**.
