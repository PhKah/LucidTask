/**
 * Telemetry Event System & Payloads
 * Reference: specs/Scenario_&_Scoring_Spec.md (Section 2)
 */

export type TelemetryEventType =
  | 'task_started'
  | 'handbook_viewed'
  | 'item_classified'
  | 'decision_switched'
  | 'tab_switched'
  | 'stress_spike_entered'
  | 'panic_click_flag'
  | 'early_exit_fired'
  | 'action_executed'
  | 'task_completed';

export interface TelemetryPayloadMap {
  task_started: { stage: 1 | 2; time_limit_sec: number };
  handbook_viewed: { duration_ms: number; view_count: number };
  item_classified: { item_id: string; target_id: string; is_correct: boolean; latency_ms: number };
  decision_switched: { item_id: string; from_id: string; to_id: string; latency_ms: number };
  tab_switched: { from_tab: string; to_tab: string; timestamp_ms?: number };
  stress_spike_entered: { remaining_sec: number; pending_tasks: number };
  panic_click_flag: { click_rate_per_sec: number; area: string };
  early_exit_fired: { reason: 'LOW_ACCURACY' | 'ERRATIC_SPEED'; final_accuracy: number; speed_sec_per_item: number };
  action_executed: { action_id: string; is_optimal: boolean; latency_ms: number };
  task_completed: { stage: 1 | 2; total_duration_sec: number };
}

export interface TelemetryEvent<K extends TelemetryEventType = TelemetryEventType> {
  event_id: string;
  event_name: K;
  timestamp_ms: number;
  payload: TelemetryPayloadMap[K];
}
