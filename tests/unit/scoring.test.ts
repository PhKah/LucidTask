import { describe, it, expect } from 'vitest';
import { ScoringEngine } from '../../src/engine/ScoringEngine';

describe('Competency Profile Scoring Suite (UT-SCORE-01 & UT-SCORE-02)', () => {
  it('calculates S_Logic accurately to 100.0 with 100% precision and optimal path (UT-SCORE-01)', () => {
    const score = ScoringEngine.calculateLogicScore({
      accuracy: 1.0,
      rootCauseIsolated: true,
      optimalPathTaken: true,
    });

    expect(score).toBe(100.0);
  });

  it('penalizes S_Resilience when error rate spikes during stress period with panic clicks (UT-SCORE-02)', () => {
    // errorRateStress = 0.5, errorRateNormal = 0.1, panicClicks = 5
    // Delta error = 0.4 => stress composure = (1 - 0.4) * 60 = 36.0
    // Panic rate = 5 / 5 = 1.0 => panic free bonus = (1 - 1.0) * 40 = 0.0
    // Expected total <= 36.0
    const score = ScoringEngine.calculateResilienceScore({
      errorRateNormal: 0.1,
      errorRateStress: 0.5,
      panicClicksCount: 5,
    });

    expect(score).toBeLessThanOrEqual(36.0);
    expect(score).toBeCloseTo(36.0, 1);
  });

  it('calculates S_Patience based on handbook reading, tab inspections and pacing', () => {
    // 15s reading (1.0 * 40 = 40)
    // 4 tab switches (1.0 * 35 = 35)
    // pacing 1.0 (1.0 * 25 = 25)
    // Total = 100
    const perfectScore = ScoringEngine.calculatePatienceScore({
      handbookReadingMs: 15000,
      tabSwitchCount: 4,
      pacingStability: 1.0,
    });
    expect(perfectScore).toBe(100.0);

    // Minimal inspection: 0ms reading, 1 tab switch
    const lowScore = ScoringEngine.calculatePatienceScore({
      handbookReadingMs: 0,
      tabSwitchCount: 1,
      pacingStability: 0.5,
    });
    expect(lowScore).toBeLessThan(30.0);
  });

  it('generates full competency profile with composite score and qualitative insights', () => {
    const profile = ScoringEngine.generateCompetencyProfile(
      { accuracy: 0.875, rootCauseIsolated: true, optimalPathTaken: true },
      { handbookReadingMs: 16000, tabSwitchCount: 5 },
      { errorRateNormal: 0.1, errorRateStress: 0.15, panicClicksCount: 0 },
      0.875, // Stage 1 accuracy
      false  // Not early exited
    );

    expect(profile.logic_score).toBeGreaterThanOrEqual(80);
    expect(profile.patience_score).toBeGreaterThanOrEqual(80);
    expect(profile.resilience_score).toBeGreaterThanOrEqual(80);
    expect(profile.composite_score).toBeGreaterThan(80);
    expect(profile.qualitative_insights.length).toBe(3);
    expect(profile.early_exit_triggered).toBe(false);
  });
});
