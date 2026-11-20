# TÀI LIỆU QUẢN TRỊ TIẾN TRÌNH & LỘ TRÌNH DỰ ÁN (PROJECT LIFECYCLE & EXECUTION HUB)
**Dự án:** LucidTask — Nền tảng Hướng nghiệp & Trải nghiệm Tác vụ Thực chứng  
**Mục tiêu thư mục:** Quản lý quy trình triển khai từng Sprint, hồ sơ thực nghiệm UAT thực địa và bản đồ phát triển tương lai (Post-MVP)  
**Mối quan hệ với `specs/`:** [specs/](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs) lưu giữ 10 bản vẽ đặc tả kỹ thuật nền tảng (SSOT); `docs/` là nơi điều phối vòng đời thực thi theo phương pháp Agile/Scrum.

---

## 1. Cấu Trúc Tổng Quan Thư Mục `docs/`

```
docs/
├── README.md                          # (File này) Cổng điều hướng tổng quan vòng đời dự án
├── PHASED_IMPLEMENTATION_PLAN.md      # Kế hoạch tổng thể 5 giai đoạn & ma trận Đầu vào / Đầu ra
│
├── sprints/                           # HỒ SƠ ĐIỀU PHỐI TỪNG SPRINT (Reading Dossiers)
│   ├── sprint_0_scaffolding.md        # Sprint 0: Scaffolding, Design Tokens & Build Tooling
│   ├── sprint_1_core_engine.md        # Sprint 1: Type Contracts, Động cơ Tính điểm & Seed Data
│   ├── sprint_2_task_workspace.md     # Sprint 2: Không gian Tác vụ, 2 Archetypes & Live HUD
│   ├── sprint_3_blind_matching.md     # Sprint 3: Radar 3 trục & Khung Ghép nối Ẩn danh
│   ├── sprint_4_parent_alignment.md   # Sprint 4: Báo cáo Phụ huynh & Xuất bản in A4
│   └── sprint_5_field_validation.md   # Sprint 5: Thực nghiệm Thực địa ĐMST (N=20-30 cặp)
│
├── validation/                        # HỒ SƠ THỰC NGHIỆM ĐMST
│   ├── Validation_Plan.md             # Kế hoạch thực nghiệm 4 bước & kịch bản phỏng vấn
│   └── OBSERVATION_LOG_TEMPLATE.md    # Mẫu phiếu quan sát thực địa cho học sinh & phụ huynh
│
└── roadmap/                           # LỘ TRÌNH MỞ RỘNG TƯƠNG LAI (POST-MVP & COMMERCIAL)
    ├── post_mvp_features.md           # Kế hoạch mở rộng 20+ cụm ngành nghề, Task CMS & B2B Portal
    └── architecture_evolution.md      # Lộ trình nâng cấp: Backend PostgreSQL, Cloud Sync, Mobile PWA
```

---

## 2. Phân Định Ranh Giới: `specs/` vs `docs/` vs `task/`

```
┌─────────────────────────────────┐      ┌─────────────────────────────────┐      ┌─────────────────────────────────┐
│            specs/               │      │             docs/               │      │             task/               │
│    (ĐẶC TẢ KỸ THUẬT GỐC)        │      │    (QUẢN TRỊ VÒNG ĐỜI & SPRINT) │      │     (THỰC THI & KIỂM TOÁN)      │
├─────────────────────────────────┤      ├─────────────────────────────────┤      ├─────────────────────────────────┤
│ • PRD, SRS, SDD, ERD            │ ───► │ • Hồ sơ đọc từng Sprint         │ ───► │ • task_template.md              │
│ • Architecture, Schemas, Tokens │      │ • Lộ trình 5 Giai đoạn          │      │ • Log/[Date]_[TASK-ID].md       │
│ • Scoring Math, QA Test Plan    │      │ • Nghiệm thu UAT & Roadmap      │      │ • Audit Trail & Commit Hash     │
│ [Chân lý kỹ thuật duy nhất]     │      │ [Điều phối Agile & Chiến lược]  │      │ [Minh chứng kiểm định thực tế]  │
└─────────────────────────────────┘      └─────────────────────────────────┘      └─────────────────────────────────┘
```

1. **`specs/` (Chân lý kỹ thuật - SSOT):** Không bao giờ thay đổi theo từng sprint. Đây là nơi chứa bản vẽ thiết kế, hợp đồng dữ liệu, công thức toán học và tiêu chuẩn chất lượng của toàn bộ hệ thống.
2. **`docs/` (Điều phối tiến trình & Tương lai):** Tổ chức việc đọc và chia nhỏ mục tiêu theo từng Sprint ngắn hạn (MVP) và vạch ra lộ trình mở rộng dài hạn (Post-MVP).
3. **`task/` (Nhật ký thực thi tại trận):** Nơi lưu trữ mã nguồn các task chi tiết, checklist kiểm thử và commit hash lịch sử của mỗi lập trình viên / AI Agent.

