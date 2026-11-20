# ĐẶC TẢ KỊCH BẢN & MA TRẬN CHẤM ĐIỂM HÀNH VI (Scenario_&_Scoring_Spec.md)
**Dự án:** LucidTask — Nền tảng Hướng nghiệp & Trải nghiệm Tác vụ Thực chứng  
**Mục tiêu tài liệu:** Bản đặc tả chi tiết dành cho Nhóm Soạn thảo Nội dung (Content) và Nhóm Thuật toán (Data/Scoring Engine)  
**Tài liệu Yêu cầu Tổng thể:** [SRS.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/SRS.md)  
**Phiên bản:** 2.0 (Streamlined Domain & Math Specification)  

---

## 1. Kịch bản Tác vụ Chi tiết & Nguyên Tắc Game Hóa Lao Động (Diegetic Workplace Scenarios)

> **Nguyên tắc Vàng & Khung Chuẩn Hóa 5+5 (Workplace-to-Game Conversion Standard):**  
> Mọi kịch bản nghề nghiệp trong LucidTask (hiện tại và các ngành mở rộng sau này) bắt buộc tuân thủ **5 yếu tố tâm lý hành vi & 5 điều kiện chuyển đổi từ hình mẫu "Nợ Có Ơi"** (chi tiết tại [docs/roadmap/gamification_diegetic_ui_rfc.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/docs/roadmap/gamification_diegetic_ui_rfc.md#L98-L185)):
> 1. **Vòng lặp phản hồi khép kín theo 2 thái cực ngành:** Ngành luật cứng (Kế toán, Pháp chế, Dữ liệu, Logistics) chấm khớp số học/quy tắc tức thì (báo đỏ `Lệch ...` khi chưa cân); Ngành kết quả mở (Marketing, Truyền thông, Quản trị) lượng hóa thành các chỉ số xung đột trực tiếp (*Ngân sách – Lượng khách – Uy tín*).
> 2. **Nén thời gian (*Time Compression*):** Thu gọn cả tuần/tháng làm việc vào 3–5 phút, cắt bỏ hoàn toàn thời gian chết.
> 3. **Thao tác kiến tạo chủ động (*Active Construction* — Không trắc nghiệm A/B hay Radio):** Tự soi chứng từ đa dòng và chạm đúng dòng có bẫy (`is_flawed: true`) hoặc bấm `Hợp lệ ✓` nếu chứng từ sạch; tự lắp thẻ và số liệu/bằng chứng vào khay đối ứng cho hết số `Lệch đỏ`.
> 4. **Điểm cân bằng trừu tượng hóa (*Abstraction Sweet Spot*) & Dẫn nhập bình dân (*Micro-scaffolding*):** Loại bỏ kiến thức hàn lâm, dùng hình ảnh đời thường gần gũi (như *"Kế toán vỉa hè"*) nhưng bảo toàn 100% cấu trúc tư duy của nghề.
> 5. **Đời sống công sở (`🛡️ Uy tín` vs `❤️ Thiện cảm`, `Sai sót ẩn`) & Điểm chốt giải tỏa (*Closure & Catharsis*):** Tái hiện mâu thuẫn giữa giữ nguyên tắc (`+Uy tín / -Thiện cảm`) và nể nang đồng nghiệp (`+Thiện cảm` nhưng tích tụ `Sai sót ẩn` bị khui lúc cuối kỳ), kết thúc bằng nghi thức **Khóa sổ / Chốt bảng cân đối khớp từng đồng (`A = B ✓`)**.

### Cụm ngành 1: Kỹ thuật Phần mềm & Khoa học Dữ liệu (Software & Data Operations)

#### ◈ Chặng 1 (Sơ tuyển - 90 giây): "Bàn Kiểm Duyệt Dữ Liệu Đơn Hàng Trà Sữa / Sàn Thương Mại" (*Papers, Please* Docket Style)
- **Vai trò:** Nhân viên Quản trị Dữ liệu & Trực ban Vận hành (Data & Incident Triage).
- **Bảng Quy định SOP 3 Dòng (Ghim cố định trên góc màn hình):**
  1. **Quy tắc Kết nối / Hệ thống (`CONN_ERR`):** Đơn hàng bị treo cổng thanh toán (`TIMEOUT`, `MẤT KẾT NỐI`, `UNREACHABLE`) $\rightarrow$ Đóng dấu **[CHẶN LỖI KẾT NỐI]**.
  2. **Quy tắc Dữ liệu / Nhập liệu (`DATA_ERR`):** Đơn hàng bị lỗi dữ liệu (giá tiền âm, sai định dạng ngày tháng, trùng mã khách hàng `NULL_POINTER / INVALID_FORMAT`) $\rightarrow$ Đóng dấu **[CHẶN LỖI DỮ LIỆU]**.
  3. **Áp lực:** Mỗi quyết định làm biến động trực tiếp thanh **Chất lượng Dữ liệu** và **Hài lòng của Sếp**.
- **Dữ liệu thực thi:** 8 phiếu đơn hàng/log xuất hiện liên tiếp dạng hồ sơ trên bàn làm việc; hỗ trợ đóng dấu hoặc phím tắt phản xạ.
- **Tiêu chí sàng lọc sớm (Early Exit):** Tỷ lệ chính xác $< 60\%$ hoặc tốc độ thao tác $< 1.2$s/thẻ $\rightarrow$ Ngắt bài test, chuyển sang màn hình phân tích xu hướng.

#### ◈ Chặng 2 (Năng lực Cốt lõi - 3.5 phút): "Phòng Chat Tác Chiến Cứu Sập Cổng Thanh Toán Flash-Sale" (*Simulacra / Slack War Room*)
- **Vai trò:** Kỹ sư Phân tích & Điều phối Sự cố (Incident Response Lead).
- **Tình huống & Khung Chat Công Việc (Zalo/Slack):** 1.000 đơn hàng trà sữa/thương mại điện tử bị treo lúc 14:02 giữa giờ vàng khuyến mãi. Tin nhắn từ Sếp và CSKH đổ về dồn dập kèm hiệu ứng âm báo.
- **Hệ thống 3 Thanh Chỉ Số Đánh Đổi (Trade-off Bars):**
  - 🟢 **Chất lượng Hệ thống (Quality / Accuracy)**
  - 🟡 **Sự hài lòng Sếp / Khách (Stakeholder Trust)**
  - 🔴 **Thời gian / Tinh thần Giờ G (Time / Sanity)**
- **3 Tab dữ liệu đối soát thực chứng:**
  - *Tab 1 (Tin nhắn Phàn nàn Khách hàng):* Khách dùng thẻ ngân hàng đều bị trừ tiền nhưng đơn báo lỗi kết nối.
  - *Tab 2 (Bảng Theo dõi Trạng thái Máy chủ):* Ghi nhận lỗi đứt kết nối bảo mật (`SSL Handshake Failure`) bắt đầu đúng 14:02.
  - *Tab 3 (Nhật ký Cập nhật Phiên bản):* Ghi nhận bản cập nhật `v2.1` vừa được đẩy lên lúc 14:00 có thay đổi cấu hình bảo mật SSL.
- **Yếu tố gây nhiễu (Red-herring):** Cảnh báo đầy bộ nhớ tạm (Cache) lúc 13:45 (thông tin không liên quan).
- **Hành động khắc phục & Đánh đổi:** Học sinh đối chiếu 3 nguồn để bác bỏ phương án "Tắt bảo mật" (nhanh nhưng rủi ro mất tiền) và chọn đúng **[Ra lệnh Khôi phục (Rollback) về bản v2.0]**.

---

### Cụm ngành 2: Logistics & Quản trị Vận hành Chuỗi Cung ứng (Supply Chain & Fleet Dispatch)

#### ◈ Chặng 1 (Sơ tuyển - 90 giây): "Bộ lọc Cân bằng Tải trọng Xe tải"
- **Vai trò:** Nhân viên điều độ kho bãi.
- **Bảng Quy định SOP 3 Dòng:** Xe A tải trọng tối đa 1.5 tấn; Xe B tải trọng 2.0 tấn; Kiện hàng dán nhãn `Dễ vỡ` bắt buộc xếp trên cùng.
- **Dữ liệu thực thi:** 6 kiện hàng có khối lượng và ký hiệu khác nhau cần phân bổ nhanh lên 2 thùng xe.
- **Tiêu chí sàng lọc sớm:** Làm sập tải xe $> 2$ lần do không kiểm tra thông số tải trọng $\rightarrow$ Kích hoạt Early Exit.

#### ◈ Chặng 2 (Năng lực Cốt lõi - 3.5 phút): "Điều phối Đa điểm khi Xảy ra Sạt lở Cầu Vận tải"
- **Vai trò:** Chuyên viên điều phối mạng lưới giao hàng cứu trợ.
- **Ràng buộc nghiệp vụ:** Điểm A bắt buộc nhận hàng trước 10:00 (nước lũ đang dâng). Cầu dẫn vào điểm C giới hạn tải trọng xe $\le 2.5$ tấn.
- **Biến cố động (Dynamic Disruption ở phút 2.0):** Tin nhắn khẩn báo đường nối sang điểm B bị sạt lở, xe phải đi vòng thêm 45 phút.
- **Hành động khắc phục:** Học sinh sử dụng Thẻ quẹt quyết định (*Reigns* Card-Swipe) để đánh đổi giữa Chi phí nhiên liệu, Thời gian cứu trợ và An toàn tải trọng.

---

### Cụm ngành 3 & 4 (Mở rộng Đa ngành): Luật Kinh tế & Marketing Sự kiện

| Ngành Nghề | Kịch Bản Bối Cảnh Đời Thường (Không Cần Kiến Thức Nền) | Cơ Chế Game Hóa (Diegetic UI) | Năng Lực Lao Động Đo Lường |
| :--- | :--- | :--- | :--- |
| **Luật Kinh tế** | Cho sẵn "Quy định công ty" gồm 3 gạch đầu dòng ngắn. Học sinh đọc nhanh 4 đoạn thỏa thuận thuê ca sĩ biểu diễn trường (5–6 dòng) và đóng dấu chỉ ra câu chữ có "bẫy" gài sẵn (như mập mờ thời hạn phạt). | **Bàn Kiểm Duyệt Hợp Đồng (*Papers, Please*)** + Đóng dấu `[ĐẠT]` / `[CÓ BẪY RỦI RO]`. | Khả năng đọc kỹ chi tiết văn bản; sự nhạy bén với câu chữ và rủi ro pháp lý. |
| **Marketing** | Cho ngân sách 10 triệu kéo khách đến sự kiện trường. Sếp nhắn tin Zalo/Slack dồn dập đòi vừa đông khách vừa sang trọng. Học sinh quẹt thẻ trái/phải chọn phương án đánh đổi (thuê KOL tốn tiền nhưng nhanh vs tự làm content rẻ nhưng rủi ro ít view). | **Thẻ Quẹt Quyết Định (*Reigns* Card-Swipe)** + **3 Thanh Trade-off Bars** (Ngân sách / Lượng khách / Hài lòng của Sếp). | Tư duy đánh đổi nguồn lực; khả năng chịu áp lực từ yêu cầu mâu thuẫn của cấp trên. |

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
