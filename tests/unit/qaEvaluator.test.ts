import { describe, it, expect } from 'vitest';
import { evaluateQaDataMission } from '../../src/engine/MissionEvaluators';
import { QA_DATA_CLEANING_SCENARIO } from '../../src/registry/qa_data_cleaning/scenario';
import { DefectCategory } from '../../src/types/mission';

const PERFECT_ORDER_FLAGS: Record<string, DefectCategory> = {
  'ORD-02': 'INVALID_DATE',
  'ORD-04': 'NEGATIVE_OR_MATH_ERROR',
  'ORD-06': 'MISSING_OR_CORRUPT_FIELD',
  'ORD-08': 'NEGATIVE_OR_MATH_ERROR',
  'ORD-10': 'DUPLICATE_RECORD',
  'ORD-11': 'INVALID_DATE',
  'ORD-13': 'MISSING_OR_CORRUPT_FIELD',
  'ORD-14': 'DUPLICATE_RECORD',
};

const PERFECT_NODE_FLAGS: Record<string, string> = {
  NODE_3: 'N3_CORRECT',
  NODE_5: 'N5_CORRECT',
};

describe('QA Software Testing & Data Cleaning Evaluator (Mission 2 Audit)', () => {
  it('scores near-perfect with 8/8 data bugs, 2/2 flow bugs, BLOCK_RELEASE and I-C-R top code', () => {
    const result = evaluateQaDataMission({
      flaggedOrders: PERFECT_ORDER_FLAGS,
      flaggedNodes: PERFECT_NODE_FLAGS,
      releaseDecision: 'BLOCK_RELEASE',
      bugReportNote:
        'Bắt được 8 lỗi dữ liệu (ngày 30/02, giá âm, sai tính tổng, trùng đơn, thiếu SĐT/địa chỉ) và 2 lỗi logic Bước 3 âm tiền giảm giá 100k, Bước 5 trừ tiền ví không hoàn tiền khi hết tồn kho. Chặn release.',
      aiTriggered: false,
      aiExplicitlyRejected: false,
      elapsedSeconds: 480,
      tabSwitchCount: 3,
      panicClicksCount: 0,
    });

    expect(result.dataBugsCaughtExact).toBe(8);
    expect(result.dataFalsePositives).toBe(0);
    expect(result.flowBugsCaught).toBe(2);
    expect(result.flowFalsePositives).toBe(0);
    expect(result.releaseDecisionCorrect).toBe(true);
    expect(result.scores.conscientiousness).toBe(100);
    expect(result.scores.openness).toBeGreaterThanOrEqual(95);
    expect(result.riasec.top_code).toBe('I-C-R');
  });

  it('fairly credits flagging the first occurrence of a duplicate pair (ORD-05 / ORD-12) without false positive penalty', () => {
    const altFlags: Record<string, DefectCategory> = {
      ...PERFECT_ORDER_FLAGS,
    };
    delete altFlags['ORD-10'];
    delete altFlags['ORD-14'];
    altFlags['ORD-05'] = 'DUPLICATE_RECORD';
    altFlags['ORD-12'] = 'DUPLICATE_RECORD';

    const result = evaluateQaDataMission({
      flaggedOrders: altFlags,
      flaggedNodes: PERFECT_NODE_FLAGS,
      releaseDecision: 'BLOCK_RELEASE',
      bugReportNote: 'Phát hiện lỗi ngày, giá, trùng lặp đơn hàng và lỗi bước 3 bước 5.',
      aiTriggered: false,
      aiExplicitlyRejected: false,
      elapsedSeconds: 400,
      tabSwitchCount: 2,
      panicClicksCount: 0,
    });

    expect(result.dataBugsCaughtExact).toBe(8);
    expect(result.dataFalsePositives).toBe(0);
  });

  it('detects falling for AI Auto-QA trap (APPROVE_RELEASE + false positive on ORD-07 + missing NODE_5)', () => {
    const trap = QA_DATA_CLEANING_SCENARIO.aiAutoQaTrap;
    const result = evaluateQaDataMission({
      flaggedOrders: trap.flaggedOrders,
      flaggedNodes: trap.flaggedNodes,
      releaseDecision: trap.recommendedDecision,
      bugReportNote: 'AI báo hệ thống an toàn 100%, duyệt release.',
      aiTriggered: true,
      aiExplicitlyRejected: false,
      elapsedSeconds: 60,
      tabSwitchCount: 0,
      panicClicksCount: 0,
    });

    expect(result.aiTrapVerdict).toBe('TRIGGERED_AND_ACCEPTED');
    expect(result.releaseDecisionCorrect).toBe(false);
    expect(result.dataBugsCaughtExact).toBe(4);
    expect(result.dataFalsePositives).toBe(1);
    expect(result.flowBugsCaught).toBe(1);
    expect(result.scores.composite).toBeLessThan(45);
  });
});
