# ĐẶC TẢ KỊCH BẢN & MA TRẬN CHẤM ĐIỂM HÀNH VI (Scenario_&_Scoring_Spec.md)
**Dự án:** LucidTask — Nền tảng Hướng nghiệp & Trải nghiệm Tác vụ Thực chứng  
**Mục tiêu tài liệu:** Bản đặc tả chi tiết dành cho Nhóm Soạn thảo Nội dung (Content) và Nhóm Thuật toán (Data/Scoring Engine)  
**Tài liệu Yêu cầu Tổng thể:** [SRS.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/SRS.md)  
**Phiên bản:** 2.0 (Streamlined Domain & Math Specification)  

---

## 1. Kịch bản Tác vụ Chi tiết cho 2 Cụm Ngành Thử nghiệm

### Cụm ngành 1: Kỹ thuật Phần mềm & Đảm bảo Chất lượng (Software Engineering & QA)

#### ◈ Chặng 1 (Sơ tuyển - 90 giây): "Bộ lọc Tỉ mỉ & So khớp Mã Log"
- **Vai trò:** Nhân viên trực ban tiếp nhận báo cáo lỗi đơn hàng.
- **Sổ tay quy tắc (15s):**
  - Chứa `TIMEOUT`, `CONNECTION_REFUSED`, `UNREACHABLE` $\rightarrow$ Thùng `Lỗi Kết nối`.
  - Chứa `NULL_POINTER`, `INVALID_FORMAT`, `OUT_OF_BOUNDS` $\rightarrow$ Thùng `Lỗi Dữ liệu`.
- **Dữ liệu thực thi:** 8 thẻ mã log xuất hiện lần lượt.
- **Tiêu chí sàng lọc sớm (Early Exit):** Tỷ lệ chính xác $< 60\%$ hoặc tốc độ thao tác $< 1.2$s/thẻ $\rightarrow$ Ngắt bài test, chuyển sang màn hình phân tích xu hướng.

#### ◈ Chặng 2 (Năng lực Cốt lõi - 3.5 phút): "Điều tra Nguyên nhân Gốc Sập Cổng Thanh toán Flash-Sale"
- **Vai trò:** Kỹ sư phân tích sự cố (Incident Response Engineer).
- **Tình huống:** 1000 giao dịch thanh toán bị treo trong đợt sale.
- **3 Tab dữ liệu đối soát:**
  - *Tab 1 (Báo cáo người dùng):* Khách thẻ ngân hàng Techcombank và Vietcombank đều bị treo đơn.
  - *Tab 2 (Server Logs):* Ghi nhận lỗi `Handshake failure on SSL layer` từ thời điểm 14:02.
  - *Tab 3 (Lịch sử Cập nhật Mã):* Ghi nhận bản cập nhật phiên bản 2.1 được deploy lúc 14:00 có thay đổi chứng chỉ SSL.
- **Yếu tố gây nhiễu (Red-herring):** Một số log báo lỗi bộ nhớ cache (thông tin không liên quan).
- **Hành động khắc phục:** Học sinh phải xâu chuỗi thông tin để chỉ ra nguyên nhân gốc là do bản deploy 2.1 và bấm nút `[Ra lệnh Rollback về bản 2.0]`.

---

### Cụm ngành 2: Logistics & Quản trị Vận hành Chuỗi Cung ứng (Supply Chain & Fleet Dispatch)

#### ◈ Chặng 1 (Sơ tuyển - 90 giây): "Bộ lọc Cân bằng Tải trọng Xe tải"
- **Vai trò:** Nhân viên điều độ kho bãi.
- **Sổ tay quy tắc (15s):** Xe A tải trọng tối đa 1.5 tấn; Xe B tải trọng 2.0 tấn. Kiện hàng dán nhãn `Dễ vỡ` phải xếp trên cùng.
- **Dữ liệu thực thi:** 6 kiện hàng có khối lượng và ký hiệu khác nhau cần kéo thả lên 2 thùng xe.
- **Tiêu chí sàng lọc sớm:** Làm sập tải xe $> 2$ lần do không kiểm tra thông số tải trọng $\rightarrow$ Kích hoạt Early Exit.

#### ◈ Chặng 2 (Năng lực Cốt lõi - 3.5 phút): "Điều phối Đa điểm khi Xảy ra Sạt lở Cầu Vận tải"
- **Vai trò:** Chuyên viên điều phối mạng lưới giao hàng cứu trợ.
- **Ràng buộc nghiệp vụ:** Điểm A bắt buộc nhận hàng trước 10:00 (nước lũ đang dâng). Cầu dẫn vào điểm C giới hạn tải trọng xe $\le 2.5$ tấn.
- **Biến cố động (Dynamic Disruption ở phút 2.0):** Đường nối sang điểm B bị sạt lở, xe phải đi vòng thêm 45 phút.
- **Hành động khắc phục:** Học sinh phải tính toán chuyển bớt hàng sang xe khác hoặc hy sinh hoãn chuyến tại điểm ít cấp bách hơn để cứu điểm A.

---

## 2. Danh mục Sự kiện Hành vi Chuẩn hóa (Telemetry Event Catalog)

Engine ngầm ghi nhận toàn bộ các sự kiện sau vào mảng `telemetry_stream[]`:

| Event Name | Thuộc tính (Payload) | Ý nghĩa Năng lực Đo lường |
| :--- | :--- | :--- |
| `task_started` | `{ stage: 1 \| 2, time_limit_sec: number }` | Đánh dấu mốc thời gian $T_0$. |
| `handbook_viewed` | `{ duration_ms: number, view_count: number }` | Đo tính cẩn trọng, thói quen tra cứu tài liệu trước khi làm. |
| `item_classified` | `{ item_id: string, target_id: string, is_correct: boolean }` | Đo độ chính xác tức thì và phản xạ logic. |
| `decision_switched`| `{ item_id: string, from_id: string, to_id: string, latency_ms: number }` | Đo mức độ do dự, thói quen tự kiểm tra lại quyết định. |
| `tab_switched` | `{ from_tab: string, to_tab: string }` | **Chỉ số Tư duy Hệ thống:** Tần suất đối chiếu thông tin đa nguồn. |
| `stress_spike_entered`| `{ remaining_sec: 60, pending_tasks: number }` | Đánh dấu ranh giới bắt đầu áp lực thời gian. |
| `panic_click_flag` | `{ click_rate_per_sec: number }` | Đo mức độ hoảng loạn khi click liên tục $> 3$ lần/giây vào vùng không hợp lệ. |
| `early_exit_fired` | `{ reason: "LOW_ACCURACY" \| "ERRATIC_SPEED", final_accuracy: number }` | Dữ liệu phục vụ kiểm chứng giả thuyết sàng lọc sớm $H_0$. |

---

## 3. Công thức Toán học Tính Điểm & Ghép Nối Ẩn Danh

### 3.1. Điểm số Năng lực 3 Trục (Thang điểm 0 – 100)

1. **Điểm Tư duy Logic & Giải quyết Vấn đề ($S_{\text{Logic}}$):**
   $$S_{\text{Logic}} = \left( 0.50 \times \text{Accuracy} + 0.35 \times \text{RootCauseIsolation} + 0.15 \times \text{OptimalPath} \right) \times 100$$

2. **Điểm Kiên nhẫn & Kỷ luật Chi tiết ($S_{\text{Patience}}$):**
   $$S_{\text{Patience}} = \left( 0.40 \times \text{HandbookMastery} + 0.35 \times \text{TabInspectionRate} + 0.25 \times \text{PacingStability} \right) \times 100$$

3. **Điểm Sức bền & Khả năng Chịu Áp lực ($S_{\text{Resilience}}$):**
   $$S_{\text{Resilience}} = \left( 1 - \max\left(0, \text{ErrorRate}_{\le 60\text{s}} - \text{ErrorRate}_{> 60\text{s}}\right) \right) \times 60 + \left( 1 - \text{PanicClickRate} \right) \times 40$$

### 3.2. Điểm Tổng hợp Chuỗi Tác vụ Lũy tiến
$$S_{\text{Total}} = 0.30 \times S_{\text{Stage 1}} + 0.70 \times S_{\text{Stage 2}}$$

---

### 3.3. Thuật toán So khớp Ẩn danh (Blind Matching Algorithm)
Vector năng lực học sinh $\vec{V}_{\text{Student}} = \left( \frac{S_{\text{Logic}}}{100}, \frac{S_{\text{Patience}}}{100}, \frac{S_{\text{Resilience}}}{100} \right)$ được đối chiếu với Vector yêu cầu của từng chương trình đào tạo $\vec{V}_{\text{Program}} = (w_{\text{L}}, w_{\text{P}}, w_{\text{R}})$:

$$\text{Match\_Score} = \left( \frac{\vec{V}_{\text{Student}} \cdot \vec{V}_{\text{Program}}}{\|\vec{V}_{\text{Student}}\| \|\vec{V}_{\text{Program}}\|} \times \left(1 - \frac{\|\vec{V}_{\text{Student}} - \vec{V}_{\text{Program}}\|}{\sqrt{3}}\right) \right) \times 100\%$$

---

### 3.4. Thuật toán Đối chiếu Chéo 2 Ngành (Cross-Domain Head-to-Head)
Khi học sinh hoàn thành cả 2 ngành $A$ và $B$, hệ thống tính độ chênh lệch:
$$\Delta S_{\text{Domain}} = S_{\text{Total}}(A) - S_{\text{Total}}(B)$$
- Nếu $\Delta S_{\text{Domain}} \ge +15$: Xuất kết luận học sinh có phản xạ và sức bền vượt trội ở ngành $A$.
- Nếu $|\Delta S_{\text{Domain}}| < 10$: Xuất kết luận học sinh có năng lực thích ứng đồng đều ở cả 2 ngành.
