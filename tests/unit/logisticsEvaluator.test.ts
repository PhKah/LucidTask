import { describe, it, expect } from 'vitest';
import {
  computeLogisticsPassiveTotals,
  evaluateLogisticsMission,
} from '../../src/engine/MissionEvaluators';
import {
  createEmptyLogisticsAllocation,
  LOGISTICS_COLDCHAIN_SCENARIO,
} from '../../src/registry/logistics_coldchain/scenario';
import { LogisticsAllocationMatrix } from '../../src/types/mission';

const createOptimalAllocation = (): LogisticsAllocationMatrix => ({
  LOT_A: {
    TRUCK_20FT: 15,
    VAN_1: 1,
    VAN_2: 0,
    VAN_3: 0,
    COLD_STORAGE_HP: 0,
    NEXT_DAY_PORT: 2,
  },
  LOT_B: {
    TRUCK_20FT: 0,
    VAN_1: 4,
    VAN_2: 5,
    VAN_3: 5,
    COLD_STORAGE_HP: 0,
    NEXT_DAY_PORT: 0,
  },
  LOT_C: {
    TRUCK_20FT: 0,
    VAN_1: 0,
    VAN_2: 0,
    VAN_3: 0,
    COLD_STORAGE_HP: 10,
    NEXT_DAY_PORT: 0,
  },
});

describe('Logistics Cold-Chain Evaluator (Mission 1 Math & Behavioral Audit)', () => {
  it('computes optimal damage = 72,000,000 VND with 0 overloads, high Conscientiousness & R-E-C top code', () => {
    const alloc = createOptimalAllocation();
    const passive = computeLogisticsPassiveTotals(alloc);

    expect(passive.totalAllocatedTons).toBe(42);
    expect(passive.afternoonTons).toBe(30);
    expect(passive.nextDayTons).toBe(12);
    // 6M truck + 3 * 3.5M vans + 10 * 1.5M cold storage = 31.5M
    expect(passive.totalOperationalCostVnd).toBe(31_500_000);

    const result = evaluateLogisticsMission({
      allocation: alloc,
      estimatedDamageMillionVnd: 72,
      contingencyPlanText:
        'Ưu tiên cứu đủ 14 tấn trái cây Lô #B (tránh hỏng 160 triệu), đưa 10 tấn Lô #C vào kho lạnh -18°C và giữ lại 2 tấn cá hồi Lô #A chịu phạt SLA 72 triệu, đảm bảo không vượt tải trọng 15 tấn và 5 tấn.',
      aiTriggered: false,
      aiExplicitlyRejected: false,
      elapsedSeconds: 420,
      editCount: 14,
      panicClicksCount: 0,
    });

    expect(result.overloadViolationsCount).toBe(0);
    expect(result.temperatureViolations.length).toBe(0);
    expect(result.slaPenaltyVnd).toBe(72_000_000);
    expect(result.spoilageDamageVnd).toBe(0);
    expect(result.totalFinancialDamageVnd).toBe(72_000_000);
    expect(result.lotCBufferedProperly).toBe(true);
    expect(result.lotBSavedFully).toBe(true);
    expect(result.scores.conscientiousness).toBe(100);
    expect(result.scores.emotional_stability).toBeGreaterThanOrEqual(95);
    expect(result.riasec.top_code).toBe('R-E-C');
  });

  it('calculates 160,000,000 VND spoilage when keeping 2 tons of Tropical Fruit (Lot #B) overnight', () => {
    const keepFruitAlloc: LogisticsAllocationMatrix = {
      LOT_A: {
        TRUCK_20FT: 15,
        VAN_1: 3,
        VAN_2: 0,
        VAN_3: 0,
        COLD_STORAGE_HP: 0,
        NEXT_DAY_PORT: 0,
      },
      LOT_B: {
        TRUCK_20FT: 0,
        VAN_1: 2,
        VAN_2: 5,
        VAN_3: 5,
        COLD_STORAGE_HP: 0,
        NEXT_DAY_PORT: 2, // 2 tons left at port > 12h => 160M spoiled!
      },
      LOT_C: {
        TRUCK_20FT: 0,
        VAN_1: 0,
        VAN_2: 0,
        VAN_3: 0,
        COLD_STORAGE_HP: 10,
        NEXT_DAY_PORT: 0,
      },
    };

    const result = evaluateLogisticsMission({
      allocation: keepFruitAlloc,
      estimatedDamageMillionVnd: 160,
      contingencyPlanText: 'Chở hết cá hồi để tránh phạt SLA, để lại 2 tấn trái cây sáng mai.',
      aiTriggered: false,
      aiExplicitlyRejected: false,
      elapsedSeconds: 300,
      editCount: 10,
      panicClicksCount: 0,
    });

    expect(result.overloadViolationsCount).toBe(0);
    expect(result.slaPenaltyVnd).toBe(0);
    expect(result.spoilageDamageVnd).toBe(160_000_000);
    expect(result.totalFinancialDamageVnd).toBe(160_000_000);
    expect(result.lotBSavedFully).toBe(false);
    expect(result.scores.emotional_stability).toBeLessThan(75);
  });

  it('catches AI Co-pilot Trap acceptance (18t Lot #A on 15t Truck) and severely penalizes scores', () => {
    const result = evaluateLogisticsMission({
      allocation: LOGISTICS_COLDCHAIN_SCENARIO.aiCopilotTrapAllocation,
      estimatedDamageMillionVnd: 0,
      contingencyPlanText: 'Dùng phương án AI đề xuất 0 đồng tiền phạt.',
      aiTriggered: true,
      aiExplicitlyRejected: false,
      elapsedSeconds: 90,
      editCount: 1,
      panicClicksCount: 0,
    });

    expect(result.overloadViolationsCount).toBe(1);
    expect(result.vehicleAudits.find(v => v.resourceId === 'TRUCK_20FT')?.isOverloaded).toBe(true);
    expect(result.vehicleAudits.find(v => v.resourceId === 'TRUCK_20FT')?.overloadAmount).toBe(3);
    expect(result.aiTrapVerdict).toBe('TRIGGERED_AND_ACCEPTED');
    expect(result.scores.conscientiousness).toBeLessThanOrEqual(50);
    expect(result.scores.openness).toBeLessThanOrEqual(45);
  });

  it('awards maximum Openness critical thinking bonus when rejecting AI Co-pilot and fixing safely', () => {
    const result = evaluateLogisticsMission({
      allocation: createOptimalAllocation(),
      estimatedDamageMillionVnd: 72,
      contingencyPlanText:
        'Bác bỏ đề xuất AI vì AI xếp quá tải 18 tấn lên xe 15 tấn. Chấp nhận 72 triệu phạt SLA cá hồi để cứu 160 triệu trái cây.',
      aiTriggered: true,
      aiExplicitlyRejected: true,
      elapsedSeconds: 500,
      editCount: 18,
      panicClicksCount: 0,
    });

    expect(result.overloadViolationsCount).toBe(0);
    expect(result.aiTrapVerdict).toBe('TRIGGERED_AND_REJECTED');
    expect(result.scores.openness).toBeGreaterThanOrEqual(95);
    expect(result.scores.composite).toBeGreaterThanOrEqual(95);
  });

  it('flags temperature violation when placing tropical fruit in -18C cold storage', () => {
    const badTemp = createEmptyLogisticsAllocation();
    badTemp.LOT_A.TRUCK_20FT = 15;
    badTemp.LOT_A.VAN_1 = 3;
    badTemp.LOT_B.VAN_1 = 2;
    badTemp.LOT_B.VAN_2 = 5;
    badTemp.LOT_B.VAN_3 = 5;
    badTemp.LOT_B.COLD_STORAGE_HP = 2; // Freezing fruit!
    badTemp.LOT_C.COLD_STORAGE_HP = 10;

    const result = evaluateLogisticsMission({
      allocation: badTemp,
      estimatedDamageMillionVnd: 0,
      contingencyPlanText: 'Đưa 2 tấn trái cây vào kho lạnh Hải Phòng cho mát.',
      aiTriggered: false,
      aiExplicitlyRejected: false,
      elapsedSeconds: 200,
      editCount: 12,
      panicClicksCount: 0,
    });

    expect(result.temperatureViolations.length).toBeGreaterThan(0);
    expect(result.spoilageDamageVnd).toBe(160_000_000);
  });
});
