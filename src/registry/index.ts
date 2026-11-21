import { EducationalProgram, IndustryMarketIntelligence } from '../types/program';
import { LogisticsScenario, MissionId, QaDataScenario } from '../types/mission';

import { LOGISTICS_COLDCHAIN_SCENARIO } from './logistics_coldchain/scenario';
import logIndustry from './logistics_coldchain/industry.json';
import logPrograms from './logistics_coldchain/programs.json';

import { QA_DATA_CLEANING_SCENARIO } from './qa_data_cleaning/scenario';
import qaIndustry from './qa_data_cleaning/industry.json';
import qaPrograms from './qa_data_cleaning/programs.json';

export interface MissionIndustryModule {
  id: MissionId;
  name: string;
  shortTag: string;
  headline: string;
  durationLabel: string;
  riasecFocusLabel: string;
  keyHighlights: string[];
  scenario: LogisticsScenario | QaDataScenario;
  programs: EducationalProgram[];
  marketIntelligence: IndustryMarketIntelligence;
}

export const registry: Record<MissionId, MissionIndustryModule> = {
  IND_LOG_COLDCHAIN: {
    id: 'IND_LOG_COLDCHAIN',
    name: logIndustry.industry_name,
    shortTag: 'LOGISTICS & CHUỖI LẠNH',
    headline: logIndustry.headline,
    durationLabel: '10–15 phút',
    riasecFocusLabel: 'Realistic (45%) • Enterprising (30%) • Conventional (25%)',
    keyHighlights: [
      'Bảng điều phối 3 cột thực chiến với Bảng thống kê thụ động (tự kiểm soát tải trọng 15t / 5t)',
      'Bài toán đánh đổi thiệt hại tài chính (phạt trễ SLA vs. nguy cơ hỏng hàng qua đêm)',
      'Cạm bẫy AI Co-pilot & Bản giải trình gửi Giám đốc Vận hành',
    ],
    scenario: LOGISTICS_COLDCHAIN_SCENARIO,
    programs: logPrograms as unknown as EducationalProgram[],
    marketIntelligence: logIndustry as unknown as IndustryMarketIntelligence,
  },
  IND_QA_DATA: {
    id: 'IND_QA_DATA',
    name: qaIndustry.industry_name,
    shortTag: 'QA & LÀM SẠCH DỮ LIỆU (THAY LẬP TRÌNH)',
    headline: qaIndustry.headline,
    durationLabel: '10–15 phút',
    riasecFocusLabel: 'Investigative (50%) • Conventional (35%) • Realistic (15%)',
    keyHighlights: [
      'Săn lỗi trực tiếp trên Bảng 15 đơn hàng (sai ngày, giá âm, sai tổng, trùng khách, thiếu SĐT)',
      'Kiểm thử Sơ đồ Luồng Thanh toán 100% bằng Tiếng Việt — 0 dòng code',
      'Cạm bẫy AI Auto-QA & Quyết định Chặn/Duyệt Release 20:00',
    ],
    scenario: QA_DATA_CLEANING_SCENARIO,
    programs: qaPrograms as unknown as EducationalProgram[],
    marketIntelligence: qaIndustry as unknown as IndustryMarketIntelligence,
  },
};

export const IndustryRegistry = {
  getIndustry(id: MissionId): MissionIndustryModule {
    return registry[id];
  },

  getAllIndustries(): MissionIndustryModule[] {
    return [registry.IND_LOG_COLDCHAIN, registry.IND_QA_DATA];
  },

  getLogisticsScenario(): LogisticsScenario {
    return LOGISTICS_COLDCHAIN_SCENARIO;
  },

  getQaScenario(): QaDataScenario {
    return QA_DATA_CLEANING_SCENARIO;
  },

  getPrograms(id: MissionId): EducationalProgram[] {
    return registry[id].programs;
  },

  getAllPrograms(): EducationalProgram[] {
    return [
      ...(logPrograms as unknown as EducationalProgram[]),
      ...(qaPrograms as unknown as EducationalProgram[]),
    ];
  },

  getMarketIntelligence(id: MissionId): IndustryMarketIntelligence {
    return registry[id].marketIntelligence;
  },
};

export default IndustryRegistry;
