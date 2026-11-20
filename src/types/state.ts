/**
 * Finite State Machine (FSM) & User Session State
 * Reference: specs/SOFTWARE_DESIGN_DOCUMENT.md & docs/roadmap/gamification_diegetic_ui_rfc.md
 */

import { EducationalProgram } from './program';

export type TaskWorkflowState =
  | 'IDLE'                  // Chọn ngành ban đầu
  | 'STAGE1_TASK'           // Đang thực hiện Chặng 1 (90s)
  | 'EARLY_EXIT_SCREEN'     // Bị kích hoạt Sàng lọc sớm (Click ẩu / Thiếu kiên nhẫn)
  | 'STAGE2_TASK'           // Đang thực hiện Chặng 2 (3.5m)
  | 'SCORING_CALCULATING'   // Đang tính toán điểm 3 trục
  | 'BLIND_MATCHING'        // Xem thẻ trường ẩn danh
  | 'REVEALED_REPORT';      // Đã mở khóa tên trường & Xem báo cáo đồng thuận 2 cột

export interface BigFiveProfile {
  conscientiousness: number;   // Tận tâm (0 - 100)
  openness: number;            // Cởi mở (0 - 100)
  extraversion: number;        // Hướng ngoại (0 - 100)
  agreeableness: number;       // Hòa đồng (0 - 100)
  emotional_stability: number; // Ổn định cảm xúc (0 - 100)
}

export interface RiasecProfile {
  realistic: number;           // Kỹ thuật (0 - 100)
  investigative: number;       // Nghiên cứu (0 - 100)
  artistic: number;            // Nghệ thuật (0 - 100)
  social: number;              // Xã hội (0 - 100)
  enterprising: number;        // Quản lý / Kinh doanh (0 - 100)
  conventional: number;        // Nghiệp vụ (0 - 100)
  top_code: string;            // Mã Holland 3 chữ cái cao nhất (VD: "I-C-E")
}

export interface CompetencyProfile {
  logic_score: number;       // S_Logic (0 - 100)
  patience_score: number;    // S_Patience (0 - 100)
  resilience_score: number;  // S_Resilience (0 - 100)
  composite_score: number;   // S_Total (0.30 * S1 + 0.70 * S2)
  qualitative_insights: string[];
  early_exit_triggered: boolean;
  big_five?: BigFiveProfile;
  riasec?: RiasecProfile;
  completed_micro_tasks_count?: number;
  confidence_level?: number; // % Độ tin cậy hồ sơ (tối đa 100% khi hoàn thành >= 5 Micro-Tasks)
}

export interface ProgramMatchResult {
  program: EducationalProgram;
  match_percentage: number;
  is_revealed: boolean;
  rank: number;
}

export interface UserSessionState {
  session_id: string;
  selected_industry_id: string | null;
  workflow_state: TaskWorkflowState;
  competency_profile: CompetencyProfile | null;
  matched_programs: ProgramMatchResult[];
  selected_program_id: string | null;
}
