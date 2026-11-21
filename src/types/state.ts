/**
 * Finite State Machine (FSM) & User Session State — LucidTask v2.0
 * Focused on 2 Deep Practical Missions: Logistics Cold-Chain & QA/Data Cleaning
 */

import { EducationalProgram } from './program';
import { AiTrapVerdict, LogisticsBehaviorFinding, MissionCriterionAudit, MissionId } from './mission';

export type TaskWorkflowState =
  | 'IDLE'              // Chọn 1 trong 2 nhiệm vụ (Logistics / QA-Data)
  | 'MISSION_BRIEFING'  // Dẫn nhập 30s (Vai trò, bối cảnh, mục tiêu)
  | 'MISSION_ACTIVE'    // Bàn làm việc mô phỏng thực chiến (10-15p)
  | 'MISSION_DEBRIEF'   // Biên bản đối soát & Giải tỏa (Closure & Catharsis)
  | 'BLIND_MATCHING'    // Hồ sơ Big Five / RIASEC & Thẻ trường ẩn danh (IT-BLIND-01)
  | 'REVEALED_REPORT';  // Mở khóa danh tính trường & Báo cáo Đồng thuận A4

export interface BigFiveProfile {
  conscientiousness: number;   // Tận tâm (0 - 100)
  openness: number;            // Cởi mở & Tư duy phản biện (0 - 100)
  extraversion: number;        // Hướng ngoại (0 - 100)
  agreeableness: number;       // Hòa đồng (0 - 100)
  emotional_stability: number; // Ổn định cảm xúc (0 - 100)
}

export interface RiasecProfile {
  realistic: number;           // Kỹ thuật / Vận hành thực tế (0 - 100)
  investigative: number;       // Nghiên cứu / Điều tra phân tích (0 - 100)
  artistic: number;            // Nghệ thuật (0 - 100)
  social: number;              // Xã hội (0 - 100)
  enterprising: number;        // Quản lý / Kinh doanh (0 - 100)
  conventional: number;        // Nghiệp vụ / Quy chuẩn (0 - 100)
  top_code: string;            // Mã Holland 3 chữ cái cao nhất (VD: "R-E-C" hoặc "I-C-R")
}

export interface BigFiveWeights {
  conscientiousness: number;
  emotional_stability: number;
  openness: number;
}

export interface CompetencyProfile {
  mission_id: MissionId;
  mission_title: string;
  logic_score: number;       // Trục 1: Tư duy Hệ thống / Phân tích & Toán tối ưu (0 - 100)
  patience_score: number;    // Trục 2: Kỷ luật Tự kiểm soát & Tỉ mỉ chi tiết (0 - 100)
  resilience_score: number;  // Trục 3: Bản lĩnh Áp lực & Phản biện độc lập (0 - 100)
  composite_score: number;   // Điểm tổng hợp có trọng số theo đặc thù ngành (0 - 100)
  qualitative_insights: string[];
  behavior_findings?: LogisticsBehaviorFinding[];
  big_five: BigFiveProfile;
  big_five_weights: BigFiveWeights;
  riasec: RiasecProfile;
  ai_trap_verdict: AiTrapVerdict;
  criteria_breakdown: MissionCriterionAudit[];
  completed_missions_count: number;
  confidence_level: number;  // 60% khi hoàn thành 1/2 nhiệm vụ, 100% khi hoàn thành 2/2
}

export interface ProgramMatchResult {
  program: EducationalProgram;
  match_percentage: number;
  is_revealed: boolean;
  rank: number;
}

export interface UserSessionState {
  session_id: string;
  selected_mission_id: MissionId | null;
  workflow_state: TaskWorkflowState;
  competency_profile: CompetencyProfile | null;
  matched_programs: ProgramMatchResult[];
  selected_program_id: string | null;
}
