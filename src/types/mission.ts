/**
 * Domain-Specific Mission Schemas (Anti-Dogma Architecture)
 * Each career defines its own authentic workplace data & manipulation types.
 */

export type MissionId = 'IND_LOG_COLDCHAIN' | 'IND_QA_DATA';

export type AiTrapVerdict =
  | 'NOT_TRIGGERED'
  | 'TRIGGERED_AND_REJECTED'
  | 'TRIGGERED_AND_ACCEPTED';

export interface MissionCriterionAudit {
  id: string;
  label: string;
  status: 'PASS' | 'PARTIAL' | 'FAIL';
  summary: string;
  detail: string;
}

/* ============================================================================
 * MISSION 1: LOGISTICS — COLD-CHAIN SUPPLY DISPATCH SIMULATOR
 * ============================================================================ */

export type CargoLotId = 'LOT_A' | 'LOT_B' | 'LOT_C';

export type ResourceSlotId =
  | 'TRUCK_20FT'
  | 'VAN_1'
  | 'VAN_2'
  | 'VAN_3'
  | 'COLD_STORAGE_HP'
  | 'NEXT_DAY_PORT';

export interface CargoLot {
  id: CargoLotId;
  code: string;
  name: string;
  totalTons: number;
  shelfLifeHours: number;
  shelfLifeLabel: string;
  tempRequirementLabel: string;
  minTempC: number;
  maxTempC: number;
  deadlineLabel: string;
  slaPenaltyPerTonPerHourVnd: number;
  valuePerTonVnd: number;
  totalValueVnd: number;
  spoilageRiskNote: string;
}

export interface TransportResource {
  id: ResourceSlotId;
  shortLabel: string;
  name: string;
  category: 'AFTERNOON_VEHICLE' | 'COLD_STORAGE' | 'NEXT_DAY_STAGING';
  maxCapacityTons: number | null; // null = staging yard (unbounded capacity, ambient temp)
  departureTime: string;
  arrivalTime: string;
  fixedCostVnd: number;          // per trip (for vehicles)
  costPerTonVnd: number;         // per ton/day (for cold storage)
  tempRangeLabel: string;
  description: string;
}

/** Matrix mapping CargoLotId -> ResourceSlotId -> tons assigned */
export type LogisticsAllocationMatrix = Record<CargoLotId, Record<ResourceSlotId, number>>;

export interface LogisticsScenario {
  missionId: 'IND_LOG_COLDCHAIN';
  title: string;
  roleTitle: string;
  durationMinutes: number;
  currentClock: string;
  nextConvoySchedule: string;
  contextStory: string;
  objectives: string[];
  lots: CargoLot[];
  resources: TransportResource[];
  aiCopilotTrapAllocation: LogisticsAllocationMatrix;
  aiCopilotMessage: string;
  optimalDamageVnd: number;
  baselineWrongDamageVnd: number;
}

export interface LogisticsSubmission {
  allocation: LogisticsAllocationMatrix;
  estimatedDamageMillionVnd: number | null;
  contingencyPlanText: string;
  aiTriggered: boolean;
  aiExplicitlyRejected: boolean;
  elapsedSeconds: number;
  editCount: number;
  panicClicksCount: number;
}

export interface VehicleAuditRow {
  resourceId: ResourceSlotId;
  resourceName: string;
  assignedTons: number;
  maxCapacityTons: number | null;
  isOverloaded: boolean;
  overloadAmount: number;
}

export interface LogisticsEvaluationResult {
  missionId: 'IND_LOG_COLDCHAIN';
  totalAllocatedTons: number;
  vehicleAudits: VehicleAuditRow[];
  overloadViolationsCount: number;
  temperatureViolations: string[];
  slaPenaltyVnd: number;
  spoilageDamageVnd: number;
  totalFinancialDamageVnd: number;
  transportAndStorageCostVnd: number;
  optimalDamageVnd: number;
  lotCBufferedProperly: boolean;
  lotBSavedFully: boolean;
  planReasoningScore: number; // 0 - 100
  aiTrapVerdict: AiTrapVerdict;
  scores: {
    conscientiousness: number;
    emotional_stability: number;
    openness: number;
    composite: number;
  };
  riasec: {
    realistic: number;
    enterprising: number;
    conventional: number;
    investigative: number;
    social: number;
    artistic: number;
    top_code: string;
  };
  criteria: MissionCriterionAudit[];
  qualitativeInsights: string[];
}

/* ============================================================================
 * MISSION 2: QA SOFTWARE TESTING & DATA CLEANING SIMULATOR
 * ============================================================================ */

export type DefectCategory =
  | 'INVALID_DATE'
  | 'NEGATIVE_OR_MATH_ERROR'
  | 'DUPLICATE_RECORD'
  | 'MISSING_OR_CORRUPT_FIELD';

export interface DefectRule {
  id: DefectCategory;
  code: string;
  label: string;
  shortDesc: string;
  example: string;
}

export interface OrderRecord {
  id: string;
  orderCode: string;
  orderDate: string;
  orderTime: string;
  customerName: string;
  phone: string;
  productName: string;
  quantity: number;
  unitPriceVnd: number;
  totalPriceVnd: number;
  address: string;
  /** Ground truth — hidden from UI during mission */
  expectedDefect: DefectCategory | null;
  defectExplanation: string;
  highlightField?: keyof OrderRecord;
}

export interface LogicFlowNode {
  id: string;
  stepNumber: number;
  title: string;
  vietnameseRule: string;
  actor: string;
  /** Ground truth — hidden from UI during mission */
  hasLogicBug: boolean;
  expectedBugReason: string;
  bugOptions: Array<{
    id: string;
    label: string;
    isCorrect: boolean;
  }>;
}

export interface QaDataScenario {
  missionId: 'IND_QA_DATA';
  title: string;
  roleTitle: string;
  durationMinutes: number;
  currentClock: string;
  releaseDeadline: string;
  contextStory: string;
  objectives: string[];
  rules: DefectRule[];
  orders: OrderRecord[];
  flowNodes: LogicFlowNode[];
  aiAutoQaTrap: {
    flaggedOrders: Record<string, DefectCategory>;
    flaggedNodes: Record<string, string>;
    recommendedDecision: 'APPROVE_RELEASE' | 'BLOCK_RELEASE';
    aiMessage: string;
  };
}

export type ReleaseDecision = 'BLOCK_RELEASE' | 'APPROVE_RELEASE';

export interface QaSubmission {
  flaggedOrders: Record<string, DefectCategory>;
  flaggedNodes: Record<string, string>; // nodeId -> selected bugOptionId
  releaseDecision: ReleaseDecision;
  bugReportNote: string;
  aiTriggered: boolean;
  aiExplicitlyRejected: boolean;
  elapsedSeconds: number;
  tabSwitchCount: number;
  panicClicksCount: number;
}

export interface OrderAuditRow {
  orderCode: string;
  expectedDefect: DefectCategory | null;
  userFlagged: DefectCategory | null;
  status: 'TRUE_POSITIVE' | 'WRONG_CATEGORY' | 'MISSED_BUG' | 'FALSE_POSITIVE' | 'CLEAN_OK';
  explanation: string;
}

export interface FlowNodeAuditRow {
  stepNumber: number;
  title: string;
  hasLogicBug: boolean;
  userFlagged: boolean;
  reasonCorrect: boolean;
  status: 'CAUGHT_EXACT' | 'CAUGHT_PARTIAL' | 'MISSED_BUG' | 'FALSE_POSITIVE' | 'CLEAN_OK';
  explanation: string;
}

export interface QaEvaluationResult {
  missionId: 'IND_QA_DATA';
  orderAudits: OrderAuditRow[];
  flowAudits: FlowNodeAuditRow[];
  totalExpectedDataBugs: number;
  dataBugsCaughtExact: number;
  dataBugsWrongCategory: number;
  dataFalsePositives: number;
  totalExpectedFlowBugs: number;
  flowBugsCaught: number;
  flowFalsePositives: number;
  releaseDecisionCorrect: boolean;
  reportQualityScore: number; // 0 - 100
  aiTrapVerdict: AiTrapVerdict;
  scores: {
    conscientiousness: number;
    openness: number;
    emotional_stability: number;
    composite: number;
  };
  riasec: {
    investigative: number;
    conventional: number;
    realistic: number;
    enterprising: number;
    social: number;
    artistic: number;
    top_code: string;
  };
  criteria: MissionCriterionAudit[];
  qualitativeInsights: string[];
}

export type MissionEvaluationResult = LogisticsEvaluationResult | QaEvaluationResult;
