/**
 * Telemetry Event System & Payloads — LucidTask v2.0
 * Captures active manipulation, passive self-verification, and AI Co-pilot critical thinking.
 */

import { MissionId } from './mission';

export type TelemetryEventType =
  | 'mission_started'
  | 'allocation_updated'
  | 'data_cell_flagged'
  | 'flow_node_flagged'
  | 'tab_switched'
  | 'ai_copilot_triggered'
  | 'ai_copilot_overridden'
  | 'ai_copilot_accepted'
  | 'plan_note_updated'
  | 'stress_spike_entered'
  | 'panic_click_flag'
  | 'mission_submitted';

export interface TelemetryPayloadMap {
  mission_started: { mission_id: MissionId; time_limit_sec: number };
  allocation_updated: { lot_id: string; resource_id: string; tons: number };
  data_cell_flagged: { order_id: string; defect_category: string | null };
  flow_node_flagged: { node_id: string; reason_id: string | null };
  tab_switched: { from_tab: string; to_tab: string };
  ai_copilot_triggered: { mission_id: MissionId };
  ai_copilot_overridden: { mission_id: MissionId; method: 'EXPLICIT_BUTTON' | 'MANUAL_FIX' };
  ai_copilot_accepted: { mission_id: MissionId };
  plan_note_updated: { char_count: number };
  stress_spike_entered: { remaining_sec: number };
  panic_click_flag: { click_rate_per_sec: number; area: string };
  mission_submitted: { mission_id: MissionId; elapsed_sec: number; composite_score: number };
}

export interface TelemetryEvent<K extends TelemetryEventType = TelemetryEventType> {
  event_id: string;
  event_name: K;
  timestamp_ms: number;
  payload: TelemetryPayloadMap[K];
}
