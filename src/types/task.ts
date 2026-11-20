/**
 * Task Domain Engine Interfaces (Schema-Driven)
 * Reference: specs/Task_Engine_Architecture.md & specs/Data_Schema_&_Seed_Data.md
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

export interface WorkItem {
  id: string;
  content: string;
  expected_target: string;
  metadata?: Record<string, unknown>;
}

export interface InvestigationSource {
  id: string;
  tab_title: string;
  source_type: 'USER_REPORTS' | 'SERVER_LOGS' | 'COMMIT_HISTORY' | 'METRICS';
  content: string[];
}

export interface ResolutionAction {
  id: string;
  label: string;
  is_optimal: boolean;
  explanation: string;
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
  work_items?: WorkItem[];
  investigation_sources?: InvestigationSource[];
  resolution_actions?: ResolutionAction[];
  cut_off_thresholds?: {
    min_accuracy?: number;
    min_speed_seconds_per_item?: number;
    max_error_stress_ratio?: number;
  };
}

