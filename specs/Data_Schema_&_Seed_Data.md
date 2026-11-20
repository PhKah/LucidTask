# ĐẶC TẢ CẤU TRÚC DỮ LIỆU & DỮ LIỆU MỒI (Data_Schema_&_Seed_Data.md)
**Dự án:** LucidTask — Nền tảng Hướng nghiệp & Trải nghiệm Tác vụ Thực chứng  
**Mục tiêu tài liệu:** Cung cấp Hợp đồng dữ liệu TypeScript và Bộ dữ liệu mồi (Seed Data) chuẩn hóa để chạy độc lập không cần backend  
**Tài liệu Yêu cầu Tổng thể:** [SRS.md](file:///Users/phamkhanh/Documents/2026.1/DMST/LucidTask/specs/SRS.md)  
**Phiên bản:** 2.0 (Complete Self-contained Seed Data)  

---

## 1. Hợp đồng Dữ liệu (TypeScript Interfaces)

```typescript
// 1.1. Hồ sơ Chương trình Đào tạo (Cho Blind Matching)
export interface EducationalProgram {
  id: string;                         // Mã định danh (VD: "PROG_SWE_01")
  match_traits: {
    weight_logic: number;             // Trọng số Logic (0.0 - 1.0)
    weight_patience: number;          // Trọng số Kiên nhẫn (0.0 - 1.0)
    weight_resilience: number;        // Trọng số Chịu áp lực (0.0 - 1.0)
  };
  
  // TẦNG 1: Hiển thị Ẩn danh (Blind Mode - Học sinh nhìn thấy trước)
  anonymous_profile: {
    code_name: string;                // Tên mã hóa
    industry_cluster: string;         // Cụm ngành
    focus_headline: string;           // Khẩu hiệu đào tạo cốt lõi
    core_curriculum_pillars: string[];// 3 trụ cột môn học/đồ án thực tế
    practical_project_example: string;// Ví dụ đồ án tốt nghiệp tiêu biểu
    career_pathway: string;           // Vị trí việc làm cụ thể sau ra trường
    estimated_grad_salary_vnd: {
      min: number;
      max: number;
    };
  };

  // TẦNG 2: Bị Khóa (Chỉ mở sau khi học sinh click chọn để Reveal)
  revealed_profile: {
    institution_name: string;         // Tên trường thật (VD: "Đại học Bách Khoa TP.HCM")
    institution_type: "PUBLIC_TOP" | "PRIVATE_APPLIED" | "VOCATIONAL_PRACTICAL" | "INTERNATIONAL_JOINT";
    campus_location: string;          // Khu vực
    annual_tuition_vnd: number;       // Học phí ước tính / năm (VNĐ)
    training_duration_years: number;  // Thời gian đào tạo (năm)
    employment_rate_within_1yr: number;// Tỷ lệ có việc làm đúng ngành 1 năm (%)
    admissions_benchmark_note: string;// Ghi chú thực tế về điểm chuẩn xét tuyển
  };
}

// 1.2. Dữ liệu Thị trường Lao động & Chi phí Rủi ro (Cho Báo cáo Gia đình)
export interface IndustryMarketIntelligence {
  industry_id: string;                // Mã cụm ngành (VD: "IND_TECH_SW")
  industry_name: string;              // Tên ngành chuẩn hóa
  data_sources: string[];             // Nguồn dữ liệu trích dẫn
  market_metrics: {
    salary_range_0_to_2_years_vnd: { min: number; max: number; median: number };
    salary_range_3_to_5_years_vnd: { min: number; max: number; median: number };
    long_term_growth_projection_2030: string;
    automation_ai_risk_level: "LOW" | "MEDIUM" | "HIGH";
    automation_risk_explanation: string;
  };
  academic_risk_stats: {
    industry_dropout_or_shift_rate: number;
    root_cause_breakdown: {
      gap_between_expectation_and_reality: number;
      peer_or_parental_pressure: number;
      academic_struggle: number;
    };
    estimated_wasted_cost_1year_vnd: number;
    wasted_cost_breakdown: {
      tuition_lost: number;
      living_expenses_lost: number;
      opportunity_cost_youth_lost: number;
    };
  };
}
```

---

## 2. Bộ Dữ liệu Mẫu 8 Chương trình Đào tạo (Seed Data for Blind Matching)

```json
[
  {
    "id": "PROG_SWE_01",
    "match_traits": { "weight_logic": 0.45, "weight_patience": 0.35, "weight_resilience": 0.20 },
    "anonymous_profile": {
      "code_name": "Kỹ thuật Phần mềm Hệ thống & Dịch vụ Đám mây",
      "industry_cluster": "Công nghệ Thông tin",
      "focus_headline": "Đào tạo kỹ sư chuyên sâu về tư duy thuật toán cốt lõi, kiến trúc hệ thống chịu tải cao và gỡ lỗi phần mềm phức tạp.",
      "core_curriculum_pillars": [
        "Cấu trúc Dữ liệu & Giải thuật nâng cao (Toán & Logic)",
        "Kiến trúc Hệ thống phân tán & Điện toán đám mây",
        "Đảm bảo Chất lượng Phần mềm & Tự động hóa kiểm thử (QA/DevOps)"
      ],
      "practical_project_example": "Đồ án Xây dựng hệ thống sàn giao dịch chịu tải 100,000 giao dịch/giây, tự động phục hồi sự cố trong 5 giây.",
      "career_pathway": "Kỹ sư Backend, Kỹ sư Đảm bảo chất lượng (QA Automation), Kỹ sư DevOps",
      "estimated_grad_salary_vnd": { "min": 13000000, "max": 20000000 }
    },
    "revealed_profile": {
      "institution_name": "Đại học Bách Khoa (ĐHQG)",
      "institution_type": "PUBLIC_TOP",
      "campus_location": "TP.HCM / Hà Nội",
      "annual_tuition_vnd": 32000000,
      "training_duration_years": 4.5,
      "employment_rate_within_1yr": 96.5,
      "admissions_benchmark_note": "Điểm chuẩn THPT rất cao (> 26.5 điểm), thiên về toán lý nặng tính học thuật."
    }
  },
  {
    "id": "PROG_SWE_02",
    "match_traits": { "weight_logic": 0.35, "weight_patience": 0.40, "weight_resilience": 0.25 },
    "anonymous_profile": {
      "code_name": "Công nghệ Phần mềm Doanh nghiệp & Ứng dụng Thực chiến",
      "industry_cluster": "Công nghệ Thông tin",
      "focus_headline": "Đào tạo theo mô hình 'Làm dự án thực tế ngay từ học kỳ 3', cọ xát trực tiếp với quy trình làm phần mềm tại doanh nghiệp.",
      "core_curriculum_pillars": [
        "Quy trình Phát triển Agile/Scrum & Quản trị mã nguồn",
        "Lập trình Fullstack Web/Mobile trên môi trường Cloud",
        "Kỳ thực tập doanh nghiệp (OJT) bắt buộc 6 tháng full-time"
      ],
      "practical_project_example": "Xây dựng ứng dụng quản lý chuỗi bán lẻ thực tế cho đối tác doanh nghiệp đang vận hành.",
      "career_pathway": "Lập trình viên Web/App Fullstack, Kỹ sư tích hợp phần mềm doanh nghiệp",
      "estimated_grad_salary_vnd": { "min": 11000000, "max": 18000000 }
    },
    "revealed_profile": {
      "institution_name": "Đại học FPT",
      "institution_type": "PRIVATE_APPLIED",
      "campus_location": "Hà Nội / Đà Nẵng / TP.HCM / Cần Thơ",
      "annual_tuition_vnd": 88000000,
      "training_duration_years": 4.0,
      "employment_rate_within_1yr": 95.0,
      "admissions_benchmark_note": "Xét tuyển học bạ + Đánh giá năng lực hoặc bài luận phỏng vấn, cơ sở vật chất hiện đại."
    }
  },
  {
    "id": "PROG_SWE_03",
    "match_traits": { "weight_logic": 0.30, "weight_patience": 0.45, "weight_resilience": 0.25 },
    "anonymous_profile": {
      "code_name": "Lập trình Thực hành & Kiểm thử Ứng dụng Chuyên sâu",
      "industry_cluster": "Công nghệ Thông tin",
      "focus_headline": "Bỏ bớt lý thuyết hàn lâm, 70% thời lượng là thực hành viết mã và kiểm thử lỗi, sẵn sàng đi làm ngay sau 2.5 năm.",
      "core_curriculum_pillars": [
        "Kỹ thuật Viết mã sạch (Clean Code) & Kiểm soát lỗi",
        "Kiểm thử phần mềm thủ công & Công cụ tự động (Selenium/Postman)",
        "Bảo trì và Vận hành Hệ thống Web/Database vừa và nhỏ"
      ],
      "practical_project_example": "Viết bộ kiểm thử tự động dò tìm toàn bộ lỗi thanh toán cho một trang web thương mại điện tử mẫu.",
      "career_pathway": "Chuyên viên Kiểm thử (Software Tester/QA), Lập trình viên Front-End Junior",
      "estimated_grad_salary_vnd": { "min": 9000000, "max": 14000000 }
    },
    "revealed_profile": {
      "institution_name": "Cao đẳng Thực hành FPT Polytechnic",
      "institution_type": "VOCATIONAL_PRACTICAL",
      "campus_location": "Toàn quốc",
      "annual_tuition_vnd": 36000000,
      "training_duration_years": 2.5,
      "employment_rate_within_1yr": 93.8,
      "admissions_benchmark_note": "Xét tuyển tốt nghiệp THPT, thời gian học ngắn, tập trung hoàn toàn vào kỹ năng nghề nghiệp."
    }
  },
  {
    "id": "PROG_LOG_01",
    "match_traits": { "weight_logic": 0.40, "weight_patience": 0.35, "weight_resilience": 0.25 },
    "anonymous_profile": {
      "code_name": "Quản trị Chuỗi Cung ứng & Vận tải Quốc tế",
      "industry_cluster": "Logistics & Chuỗi Cung ứng",
      "focus_headline": "Nghiên cứu sâu về mạng lưới logistics toàn cầu, tối ưu hóa tuyến vận tải đa phương thức và pháp lý ngoại thương.",
      "core_curriculum_pillars": [
        "Quy hoạch Mạng lưới Vận tải & Quản trị Tồn kho",
        "Thủ tục Hải quan, Luật Hàng hải & Ngoại thương quốc tế",
        "Mô hình hóa và Tối ưu Chi phí Chuỗi cung ứng"
      ],
      "practical_project_example": "Đề tài Tối ưu hóa hải trình và giải phóng container tồn bãi tại Cụm cảng nước sâu Cái Mép - Thị Vải.",
      "career_pathway": "Chuyên viên Quản lý Vận tải, Điều phối Xuất Nhập khẩu tại tập đoàn giao nhận quốc tế",
      "estimated_grad_salary_vnd": { "min": 10000000, "max": 16000000 }
    },
    "revealed_profile": {
      "institution_name": "Đại học Giao thông Vận tải / ĐH Hàng hải",
      "institution_type": "PUBLIC_TOP",
      "campus_location": "Hà Nội / Hải Phòng / TP.HCM",
      "annual_tuition_vnd": 24000000,
      "training_duration_years": 4.0,
      "employment_rate_within_1yr": 92.5,
      "admissions_benchmark_note": "Điểm chuẩn khá (22 - 25 điểm), truyền thống đào tạo chuyên sâu ngành vận tải."
    }
  },
  {
    "id": "PROG_LOG_02",
    "match_traits": { "weight_logic": 0.35, "weight_patience": 0.35, "weight_resilience": 0.30 },
    "anonymous_profile": {
      "code_name": "Logistics Thông minh & Vận hành Trung tâm Hoàn tất Đơn hàng",
      "industry_cluster": "Logistics & Chuỗi Cung ứng",
      "focus_headline": "Đào tạo điều hành kho bãi hiện đại, tự động hóa đóng gói và phân bổ đơn hàng thương mại điện tử quy mô lớn.",
      "core_curriculum_pillars": [
        "Hệ thống Quản lý Kho bãi tự động (WMS) & Phân phối (TMS)",
        "Tự động hóa Kho hàng (Robotics & IoT trong Logistics)",
        "Quản trị Đội xe & Tối ưu Giao nhận Chặng cuối (Last-mile Delivery)"
      ],
      "practical_project_example": "Thiết lập quy trình điều phối hoàn tất 50,000 đơn hàng/ngày cho một Fulfillment Center.",
      "career_pathway": "Giám sát Vận hành Kho vận (Hub/Fulfillment Supervisor), Chuyên viên Phân tích Dữ liệu Vận chuyển",
      "estimated_grad_salary_vnd": { "min": 11000000, "max": 17000000 }
    },
    "revealed_profile": {
      "institution_name": "Đại học Quốc tế RMIT Việt Nam",
      "institution_type": "INTERNATIONAL_JOINT",
      "campus_location": "Hà Nội / TP.HCM",
      "annual_tuition_vnd": 320000000,
      "training_duration_years": 3.0,
      "employment_rate_within_1yr": 96.0,
      "admissions_benchmark_note": "Xét tuyển bằng cấp tiếng Anh quốc tế (IELTS >= 6.5) và học bạ, chuẩn quốc tế."
    }
  },
  {
    "id": "PROG_LOG_03",
    "match_traits": { "weight_logic": 0.30, "weight_patience": 0.40, "weight_resilience": 0.30 },
    "anonymous_profile": {
      "code_name": "Quản trị Kho bãi & Khai thác Cảng Thực hành",
      "industry_cluster": "Logistics & Chuỗi Cung ứng",
      "focus_headline": "Đào tạo thực chiến về chứng từ giao nhận, xếp dỡ kho bãi và vận hành phần mềm khai báo hiện trường.",
      "core_curriculum_pillars": [
        "Chứng từ Giao nhận Vận tải & Khai báo Hải quan điện tử",
        "Kỹ thuật Xếp dỡ, Đóng gói & An toàn Hàng hóa",
        "Thực hành Phần mềm Điều độ Hiện trường Cảng biển"
      ],
      "practical_project_example": "Mô phỏng quy trình kiểm đếm, đóng pallet và cấp mã vạch theo dõi cho 1 lô hàng xuất khẩu sang EU.",
      "career_pathway": "Nhân viên Hiện trường Logistics (Ops Fieldman), Nhân viên Khai báo Hải quan, Điều độ Cảng",
      "estimated_grad_salary_vnd": { "min": 8500000, "max": 13000000 }
    },
    "revealed_profile": {
      "institution_name": "Cao đẳng Kỹ thuật Cao Thắng",
      "institution_type": "VOCATIONAL_PRACTICAL",
      "campus_location": "TP.HCM",
      "annual_tuition_vnd": 20000000,
      "training_duration_years": 2.5,
      "employment_rate_within_1yr": 94.2,
      "admissions_benchmark_note": "Xét học bạ hoặc điểm thi THPT, uy tín cao về đào tạo kỹ thuật thực hành."
    }
  },
  {
    "id": "PROG_DATA_01",
    "match_traits": { "weight_logic": 0.50, "weight_patience": 0.35, "weight_resilience": 0.15 },
    "anonymous_profile": {
      "code_name": "Khoa học Dữ liệu & Trí tuệ Nhân tạo Ứng dụng",
      "industry_cluster": "Khoa học Dữ liệu & AI",
      "focus_headline": "Tập trung vào nền tảng toán xác suất thống kê, máy học (Machine Learning) và xử lý dữ liệu lớn để ra quyết định kinh doanh.",
      "core_curriculum_pillars": [
        "Xác suất Thống kê Nâng cao & Đại số Tuyến tính",
        "Thuật toán Học máy (Machine Learning) & Xử lý Dữ liệu lớn (Big Data)",
        "Khai phá Dữ liệu & Trực quan hóa Thông tin (Data Mining & BI)"
      ],
      "practical_project_example": "Xây dựng mô hình AI dự đoán biến động nhu cầu thị trường nông sản và phát hiện gian lận thẻ tín dụng.",
      "career_pathway": "Chuyên viên Phân tích Dữ liệu (Data Analyst), Kỹ sư Khoa học Dữ liệu (Data Scientist)",
      "estimated_grad_salary_vnd": { "min": 14000000, "max": 22000000 }
    },
    "revealed_profile": {
      "institution_name": "Đại học Khoa học Tự nhiên (ĐHQG)",
      "institution_type": "PUBLIC_TOP",
      "campus_location": "TP.HCM / Hà Nội",
      "annual_tuition_vnd": 28000000,
      "training_duration_years": 4.0,
      "employment_rate_within_1yr": 95.8,
      "admissions_benchmark_note": "Điểm chuẩn khối A00/A01 top đầu, yêu cầu tư duy toán học xuất sắc."
    }
  },
  {
    "id": "PROG_FIN_01",
    "match_traits": { "weight_logic": 0.40, "weight_patience": 0.45, "weight_resilience": 0.15 },
    "anonymous_profile": {
      "code_name": "Công nghệ Tài chính & Kiểm soát Rủi ro (FinTech)",
      "industry_cluster": "Tài chính & FinTech",
      "focus_headline": "Giao thoa giữa nghiệp vụ tài chính ngân hàng truyền thống và giải pháp công nghệ thanh toán số, phân tích định lượng.",
      "core_curriculum_pillars": [
        "Mô hình Định giá Tài sản & Quản trị Rủi ro Tín dụng",
        "Công nghệ Chuỗi khối (Blockchain) & Hệ thống Thanh toán số",
        "Kiểm toán Dữ liệu Tài chính & Luật Kinh tế số"
      ],
      "practical_project_example": "Xây dựng mô hình chấm điểm tín dụng tự động cho người vay cá nhân không cần chứng minh thu nhập.",
      "career_pathway": "Chuyên viên Phân tích Rủi ro FinTech, Chuyên viên Vận hành Hệ thống Thanh toán Ngân hàng",
      "estimated_grad_salary_vnd": { "min": 12000000, "max": 19000000 }
    },
    "revealed_profile": {
      "institution_name": "Đại học Kinh tế TP.HCM (UEH) / ĐH Kinh tế Quốc dân (NEU)",
      "institution_type": "PUBLIC_TOP",
      "campus_location": "TP.HCM / Hà Nội",
      "annual_tuition_vnd": 38000000,
      "training_duration_years": 4.0,
      "employment_rate_within_1yr": 96.2,
      "admissions_benchmark_note": "Điểm chuẩn top đầu khối kinh tế, đòi hỏi tiếng Anh tốt."
    }
  }
]
```

---

## 3. Dữ liệu Thị trường Lao động & Chi phí Rủi ro (Seed Data for Parents)

```json
[
  {
    "industry_id": "IND_TECH_SW",
    "industry_name": "Kỹ thuật Phần mềm & Công nghệ Thông tin",
    "data_sources": [
      "Báo cáo Thị trường IT Việt Nam 2024 - TopCV",
      "Báo cáo Lương & Tuyển dụng Đông Nam Á - Adecco",
      "Thống kê Sinh viên Tốt nghiệp Bộ Giáo dục & Đào tạo"
    ],
    "market_metrics": {
      "salary_range_0_to_2_years_vnd": { "min": 10500000, "max": 18000000, "median": 13500000 },
      "salary_range_3_to_5_years_vnd": { "min": 22000000, "max": 45000000, "median": 30000000 },
      "long_term_growth_projection_2030": "+18.5% mỗi năm (Nhu cầu cao ở Kỹ sư AI, Cloud và An toàn thông tin)",
      "automation_ai_risk_level": "MEDIUM",
      "automation_risk_explanation": "AI đã tự động hóa việc viết mã cơ bản. Vị trí gõ code thuần túy sẽ bị đào thải. Nhu cầu chuyển mạnh sang nhân lực có tư duy logic giải quyết vấn đề, kiểm thử và thiết kế hệ thống."
    },
    "academic_risk_stats": {
      "industry_dropout_or_shift_rate": 22.4,
      "root_cause_breakdown": {
        "gap_between_expectation_and_reality": 58.0,
        "peer_or_parental_pressure": 24.0,
        "academic_struggle": 18.0
      },
      "estimated_wasted_cost_1year_vnd": 185000000,
      "wasted_cost_breakdown": {
        "tuition_lost": 45000000,
        "living_expenses_lost": 60000000,
        "opportunity_cost_youth_lost": 80000000
      }
    }
  },
  {
    "industry_id": "IND_LOG_SCM",
    "industry_name": "Logistics & Quản trị Chuỗi Cung ứng",
    "data_sources": [
      "Báo cáo Logistics Việt Nam - Bộ Công Thương",
      "Khảo sát Nhân lực Logistics Hiệp hội VLA",
      "Báo cáo Lương Thị trường Vận tải - ManpowerGroup"
    ],
    "market_metrics": {
      "salary_range_0_to_2_years_vnd": { "min": 9000000, "max": 15000000, "median": 11500000 },
      "salary_range_3_to_5_years_vnd": { "min": 18000000, "max": 35000000, "median": 24000000 },
      "long_term_growth_projection_2030": "+14.0% mỗi năm (Được thúc đẩy bởi làn sóng chuyển dịch chuỗi cung ứng toàn cầu về Việt Nam)",
      "automation_ai_risk_level": "LOW",
      "automation_risk_explanation": "Logistics đòi hỏi phối hợp hiện trường phức tạp, xử lý sự cố đứt gãy tức thì và đàm phán con người. Tự động hóa hỗ trợ quản lý kho nhưng không thể thay thế nhân sự điều phối."
    },
    "academic_risk_stats": {
      "industry_dropout_or_shift_rate": 19.8,
      "root_cause_breakdown": {
        "gap_between_expectation_and_reality": 52.0,
        "peer_or_parental_pressure": 28.0,
        "academic_struggle": 20.0
      },
      "estimated_wasted_cost_1year_vnd": 165000000,
      "wasted_cost_breakdown": {
        "tuition_lost": 35000000,
        "living_expenses_lost": 55000000,
        "opportunity_cost_youth_lost": 75000000
      }
    }
  }
]
```
