import { describe, it, expect } from 'vitest';
import { ScoringEngine } from '../../src/engine/ScoringEngine';

describe('Gatekeeper Early Exit Suite (UT-GATE-01 .. UT-GATE-03)', () => {
  it('triggers Early Exit when accuracy is below 60% (UT-GATE-01)', () => {
    // 8 items: 4 incorrect, 4 correct => accuracy = 50%
    const result = ScoringEngine.evaluateStage1Gatekeeper({
      totalItems: 8,
      correctItems: 4,
      durationSeconds: 20, // 2.5s/item (speed is fine, but accuracy is low)
    });

    expect(result.shouldExit).toBe(true);
    expect(result.reason).toBe('LOW_ACCURACY');
    expect(result.accuracy).toBe(0.5);
  });

  it('triggers Early Exit when average speed is under 1.2s per item (UT-GATE-02)', () => {
    // 8 items in 7.2s => average speed = 0.9s/item (erratic clicking)
    const result = ScoringEngine.evaluateStage1Gatekeeper({
      totalItems: 8,
      correctItems: 7, // High accuracy (87.5%), but clicking too fast without reading
      durationSeconds: 7.2,
    });

    expect(result.shouldExit).toBe(true);
    expect(result.reason).toBe('ERRATIC_SPEED');
    expect(result.speedSecondsPerItem).toBeCloseTo(0.9, 1);
  });

  it('does NOT trigger Early Exit when student is careful and accurate (UT-GATE-03)', () => {
    // 8 items: 7 correct, 1 incorrect => accuracy = 87.5%, average speed = 3.5s/item
    const result = ScoringEngine.evaluateStage1Gatekeeper({
      totalItems: 8,
      correctItems: 7,
      durationSeconds: 28,
    });

    expect(result.shouldExit).toBe(false);
    expect(result.reason).toBeUndefined();
    expect(result.accuracy).toBe(0.875);
    expect(result.speedSecondsPerItem).toBe(3.5);
  });

  it('handles edge cases gracefully (zero items)', () => {
    const result = ScoringEngine.evaluateStage1Gatekeeper({
      totalItems: 0,
      correctItems: 0,
      durationSeconds: 0,
    });

    expect(result.shouldExit).toBe(false);
  });
});
