import { describe, expect, it } from 'vitest';
import { createEmptyLogisticsAllocation, LOGISTICS_COLDCHAIN_SCENARIO } from '../../src/registry/logistics_coldchain/scenario';
import { checkLogisticsPlan, previewCargoTransfer } from '../../src/engine/logisticsDragDrop';

const scenario = LOGISTICS_COLDCHAIN_SCENARIO;

describe('Logistics DnD Phase 1 helper rules', () => {
  it('allocates no more than a lot has remaining; never creates extra cargo', () => {
    const matrix = createEmptyLogisticsAllocation();
    matrix.LOT_A.TRUCK_20FT = 15;
    expect(previewCargoTransfer(matrix, scenario, 'LOT_A', 5).allowedTons).toBe(3);
    expect(previewCargoTransfer(matrix, scenario, 'LOT_A', 'REMAINING').allowedTons).toBe(3);
    matrix.LOT_A.VAN_1 = 3;
    expect(previewCargoTransfer(matrix, scenario, 'LOT_A', 1).allowedTons).toBe(0);
    expect(previewCargoTransfer(matrix, scenario, 'LOT_A', -2).allowedTons).toBe(0);
  });

  it('audits capacity only when called; keeps intentional AI overcapacity possible', () => {
    const aiMatrix = scenario.aiCopilotTrapAllocation;
    const violations = checkLogisticsPlan(aiMatrix, scenario);
    expect(violations.some(msg => msg.id === 'capacity-TRUCK_20FT' && msg.type === 'error')).toBe(true);
    expect(violations.find(msg => msg.id === 'capacity-TRUCK_20FT')?.text).toContain('vượt 3 tấn');
  });

  it('matches existing mission cold storage/port loss rules', () => {
    const matrix = createEmptyLogisticsAllocation();
    matrix.LOT_B.COLD_STORAGE_HP = 2;
    matrix.LOT_B.NEXT_DAY_PORT = 1;
    matrix.LOT_C.NEXT_DAY_PORT = 3;
    const ids = checkLogisticsPlan(matrix, scenario).map(msg => msg.id);
    expect(ids).toContain('temp-b-cold');
    expect(ids).toContain('temp-b-port');
    expect(ids).toContain('temp-c-port');
  });

  it('gives non-spoiler success for a valid complete 42-ton plan', () => {
    const matrix = createEmptyLogisticsAllocation();
    matrix.LOT_A.TRUCK_20FT = 15;
    matrix.LOT_A.VAN_1 = 1;
    matrix.LOT_A.NEXT_DAY_PORT = 2;
    matrix.LOT_B.VAN_1 = 4;
    matrix.LOT_B.VAN_2 = 5;
    matrix.LOT_B.VAN_3 = 5;
    matrix.LOT_C.COLD_STORAGE_HP = 10;
    const messages = checkLogisticsPlan(matrix, scenario);
    expect(messages).toHaveLength(1);
    expect(messages[0].type).toBe('success');
    expect(messages[0].text).toContain('chi phí');
  });
});
