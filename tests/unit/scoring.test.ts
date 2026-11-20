import { describe, it, expect } from 'vitest';
import { ScoringEngine } from '../../src/engine/ScoringEngine';
import { evaluateLogisticsMission, evaluateQaDataMission } from '../../src/engine/MissionEvaluators';

describe('ScoringEngine Unified Profile Builder Suite (v2.0)', () => {
  it('builds Logistics CompetencyProfile with 50/35/15 Big Five weights and 60% -> 100% confidence scaling', () => {
    const logEval = evaluateLogisticsMission({
      allocation: {
        LOT_A: { TRUCK_20FT: 15, VAN_1: 1, VAN_2: 0, VAN_3: 0, COLD_STORAGE_HP: 0, NEXT_DAY_PORT: 2 },
        LOT_B: { TRUCK_20FT: 0, VAN_1: 4, VAN_2: 5, VAN_3: 5, COLD_STORAGE_HP: 0, NEXT_DAY_PORT: 0 },
        LOT_C: { TRUCK_20FT: 0, VAN_1: 0, VAN_2: 0, VAN_3: 0, COLD_STORAGE_HP: 10, NEXT_DAY_PORT: 0 },
      },
      estimatedDamageMillionVnd: 72,
      contingencyPlanText: 'Cứu 14t trái cây tránh hỏng 160tr, chấp nhận phạt SLA 72tr 2t cá hồi.',
      aiTriggered: false,
      aiExplicitlyRejected: false,
      elapsedSeconds: 300,
      editCount: 12,
      panicClicksCount: 0,
    });

    const profile1 = ScoringEngine.buildCompetencyProfile(logEval, 1);
    expect(profile1.mission_id).toBe('IND_LOG_COLDCHAIN');
    expect(profile1.big_five_weights).toEqual({
      conscientiousness: 50,
      emotional_stability: 35,
      openness: 15,
    });
    expect(profile1.confidence_level).toBe(60);
    expect(profile1.riasec.top_code).toBe('R-E-C');

    const profile2 = ScoringEngine.buildCompetencyProfile(logEval, 2);
    expect(profile2.confidence_level).toBe(100);
  });

  it('builds QA/Data CompetencyProfile with 45/35/20 Big Five weights and I-C-R top code', () => {
    const qaEval = evaluateQaDataMission({
      flaggedOrders: {
        'ORD-02': 'INVALID_DATE',
        'ORD-04': 'NEGATIVE_OR_MATH_ERROR',
        'ORD-06': 'MISSING_OR_CORRUPT_FIELD',
        'ORD-08': 'NEGATIVE_OR_MATH_ERROR',
        'ORD-10': 'DUPLICATE_RECORD',
        'ORD-11': 'INVALID_DATE',
        'ORD-13': 'MISSING_OR_CORRUPT_FIELD',
        'ORD-14': 'DUPLICATE_RECORD',
      },
      flaggedNodes: { NODE_3: 'N3_CORRECT', NODE_5: 'N5_CORRECT' },
      releaseDecision: 'BLOCK_RELEASE',
      bugReportNote: 'Chặn release do 8 lỗi dữ liệu ngày 30/02 và 2 lỗi logic Bước 3 âm tiền, Bước 5 trừ ví không hoàn.',
      aiTriggered: true,
      aiExplicitlyRejected: true,
      elapsedSeconds: 350,
      tabSwitchCount: 2,
      panicClicksCount: 0,
    });

    const profile = ScoringEngine.buildCompetencyProfile(qaEval, 2);
    expect(profile.mission_id).toBe('IND_QA_DATA');
    expect(profile.big_five_weights).toEqual({
      conscientiousness: 45,
      openness: 35,
      emotional_stability: 20,
    });
    expect(profile.ai_trap_verdict).toBe('TRIGGERED_AND_REJECTED');
    expect(profile.riasec.top_code).toBe('I-C-R');
    expect(profile.confidence_level).toBe(100);
  });
});
