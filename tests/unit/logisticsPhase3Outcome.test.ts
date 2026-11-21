import { describe, expect, it } from 'vitest';
import { evaluateLogisticsMission } from '../../src/engine/MissionEvaluators';
import { getLogisticsDamageComparison, getLogisticsDamageTier } from '../../src/engine/logisticsOutcome';
import { createEmptyLogisticsAllocation, LOGISTICS_COLDCHAIN_SCENARIO } from '../../src/registry/logistics_coldchain/scenario';
import { LogisticsAllocationMatrix, LogisticsSubmission } from '../../src/types/mission';

const makeSubmission = (allocation: LogisticsAllocationMatrix, estimate: number): LogisticsSubmission => ({
  allocation,
  estimatedDamageMillionVnd: estimate,
  contingencyPlanText: 'Ưu tiên lô B chạy xe, cho lô C vào kho lạnh, giữ phần lô A chuyển sáng mai theo định mức.',
  aiTriggered: false,
  aiExplicitlyRejected: false,
  elapsedSeconds: 240,
  editCount: 12,
  panicClicksCount: 0,
});

const valid108 = (): LogisticsAllocationMatrix => {
  const a = createEmptyLogisticsAllocation();
  a.LOT_A.TRUCK_20FT = 15;
  a.LOT_A.NEXT_DAY_PORT = 3;
  a.LOT_B.VAN_1 = 5;
  a.LOT_B.VAN_2 = 5;
  a.LOT_B.VAN_3 = 4;
  a.LOT_C.COLD_STORAGE_HP = 10;
  return a;
};

describe('Phase 3: evidence-based results', () => {
  it('marks a safe 108M plan amber, calculates 36M difference, and never praises a 72M result', () => {
    const result = evaluateLogisticsMission(makeSubmission(valid108(), 108));
    expect(result.totalFinancialDamageVnd).toBe(108_000_000);
    expect(getLogisticsDamageTier(result)).toBe('needs-improvement');
    expect(getLogisticsDamageComparison(result).differenceVnd).toBe(36_000_000);
    expect(getLogisticsDamageComparison(result).actionable).toContain('36.000.000đ');
    expect(result.behaviorFindings.find(x => x.id === 'tradeoff')?.status).toBe('improve');
    expect(result.behaviorFindings.find(x => x.id === 'tradeoff')?.text).toContain('108 triệu');
    expect(result.qualitativeInsights.join(' ')).not.toContain('chấp nhận mức phạt nhỏ 72 triệu');
  });

  it('marks the genuinely optimal 72M plan green', () => {
    const plan = valid108();
    plan.LOT_A.VAN_3 = 1;
    plan.LOT_A.NEXT_DAY_PORT = 2;
    const result = evaluateLogisticsMission(makeSubmission(plan, 72));
    expect(result.totalFinancialDamageVnd).toBe(72_000_000);
    expect(getLogisticsDamageTier(result)).toBe('optimal');
    expect(getLogisticsDamageComparison(result).differenceVnd).toBe(0);
    expect(result.behaviorFindings.find(x => x.id === 'tradeoff')?.status).toBe('strength');
  });

  it('marks unsafe AI trap red even if the nominal damage is 0M', () => {
    const result = evaluateLogisticsMission({
      ...makeSubmission(LOGISTICS_COLDCHAIN_SCENARIO.aiCopilotTrapAllocation, 0),
      aiTriggered: true,
    });
    expect(getLogisticsDamageTier(result)).toBe('unsafe');
    expect(result.behaviorFindings.find(x => x.id === 'ai')?.status).toBe('caution');
  });

  it('scores the money estimate for the actual plan, not an unearned fixed 72M', () => {
    const correct = evaluateLogisticsMission(makeSubmission(valid108(), 108));
    const incorrect = evaluateLogisticsMission(makeSubmission(valid108(), 72));
    expect(correct.planReasoningScore).toBeGreaterThan(incorrect.planReasoningScore);
  });
});
