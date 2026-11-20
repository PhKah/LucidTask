/**
 * Task Domain Engine Interfaces (Schema-Driven + Diegetic UI Extension)
 * Reference: specs/Task_Engine_Architecture.md & docs/roadmap/gamification_diegetic_ui_rfc.md
 */

export type InteractionArchetype =
  | 'TRIAGE_AND_CLASSIFY'
  | 'CONSTRAINED_ALLOCATION'
  | 'MULTI_SOURCE_INVESTIGATION'
  | 'TRADE_OFF_PRIORITIZATION';

export type TaskStage = 1 | 2;

export interface HandbookRule {
  rule_id: string;
  category: string;
  condition: string;
  target_action: string;
  hint?: string;
}

export interface CustomTriageBin {
  target_id: string;
  label: string;
  short_hint: string;
  key_shortcut: string;
}

export interface WorkChatMessageItem {
  id: string;
  sender: string;
  role: 'BOSS' | 'CLIENT' | 'CSKH' | 'SYSTEM';
  text: string;
  urgency?: 'NORMAL' | 'URGENT';
}

export interface DocumentLineItem {
  label: string;
  value: string;
  is_flawed?: boolean; // True if tapping this row catches the flaw (maps to leftTargetId / CONN_ERR)
}

export interface WorkItem {
  id: string;
  content: string;
  expected_target: string;
  order_title?: string;
  everyday_note?: string;
  boss_feedback_on_error?: string;
  npc_name?: string;
  npc_quote?: string;
  document_type_badge?: string;
  document_rows?: DocumentLineItem[];
  metadata?: Record<string, unknown>;
}

export interface InvestigationSource {
  id: string;
  tab_title: string;
  source_type: 'USER_REPORTS' | 'SERVER_LOGS' | 'COMMIT_HISTORY' | 'METRICS';
  content: string[];
}

export interface TradeOffPreview {
  quality_delta: string;
  stakeholder_delta: string;
  risk_note: string;
}

export interface ResolutionAction {
  id: string;
  label: string;
  is_optimal: boolean;
  explanation: string;
  trade_off_preview?: TradeOffPreview;
}

export interface TaskDefinition {
  id: string;
  stage: TaskStage;
  title: string;
  role_title: string;
  scenario_brief: string;
  time_limit_seconds: number;
  interaction_archetype: InteractionArchetype;
  handbook_rules: HandbookRule[];
  sop_quick_rules?: string[];
  custom_bins?: CustomTriageBin[];
  work_chat_messages?: WorkChatMessageItem[];
  work_items?: WorkItem[];
  investigation_sources?: InvestigationSource[];
  resolution_actions?: ResolutionAction[];
  cut_off_thresholds?: {
    min_accuracy?: number;
    min_speed_seconds_per_item?: number;
    max_error_stress_ratio?: number;
  };
}
