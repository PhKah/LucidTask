import { describe, it, expect } from 'vitest';
import { ScoringEngine } from '../../src/engine/ScoringEngine';
import { IndustryRegistry } from '../../src/registry/index';

describe('Blind Matching & Vector Space Suite (UT-COSINE-01 & UT-COSINE-02)', () => {
  it('achieves >= 99.9% match for identical collinear vectors (UT-COSINE-01)', () => {
    const v1: [number, number, number] = [0.5, 0.3, 0.2];
    const v2: [number, number, number] = [0.5, 0.3, 0.2];

    const match = ScoringEngine.computeCosineMatch(v1, v2);
    expect(match).toBeGreaterThanOrEqual(0.999);
  });

  it('yields 0.0 match for orthogonal vectors (UT-COSINE-02)', () => {
    const v1: [number, number, number] = [1.0, 0, 0];
    const v2: [number, number, number] = [0, 1.0, 0];

    const match = ScoringEngine.computeCosineMatch(v1, v2);
    expect(match).toBe(0.0);
  });

  it('ranks real seed programs correctly according to Ground Truth', () => {
    // Student with strong logic (90), balanced patience (70), and resilient (80)
    // Vector approx: (0.9, 0.7, 0.8) -> normalized: (0.64, 0.50, 0.57)
    // Expected top matches: Systems/Cloud or AI/Data or Applied SWE
    const profile = {
      logic_score: 90,
      patience_score: 70,
      resilience_score: 80,
      composite_score: 85,
      qualitative_insights: [],
      early_exit_triggered: false,
    };

    const allPrograms = IndustryRegistry.getAllPrograms();
    expect(allPrograms.length).toBe(8);

    const ranked = ScoringEngine.rankPrograms(profile, allPrograms);
    expect(ranked.length).toBe(8);
    expect(ranked[0].rank).toBe(1);
    expect(ranked[0].match_percentage).toBeGreaterThanOrEqual(ranked[1].match_percentage);
    expect(ranked[7].rank).toBe(8);

    // Verify top program has high logic match trait
    expect(ranked[0].program.match_traits.weight_logic).toBeGreaterThanOrEqual(0.35);
  });
});
