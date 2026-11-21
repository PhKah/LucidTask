import { describe, it, expect } from 'vitest';
import { ScoringEngine } from '../../src/engine/ScoringEngine';
import { IndustryRegistry } from '../../src/registry/index';
import { CompetencyProfile } from '../../src/types/state';

const MOCK_PROFILE: CompetencyProfile = {
  mission_id: 'IND_LOG_COLDCHAIN',
  mission_title: 'Logistics',
  logic_score: 88,
  patience_score: 92,
  resilience_score: 85,
  composite_score: 90,
  qualitative_insights: [],
  big_five: {
    conscientiousness: 92,
    openness: 86,
    emotional_stability: 85,
    agreeableness: 78,
    extraversion: 76,
  },
  big_five_weights: { conscientiousness: 50, emotional_stability: 35, openness: 15 },
  riasec: {
    realistic: 90,
    enterprising: 80,
    conventional: 78,
    investigative: 65,
    social: 55,
    artistic: 45,
    top_code: 'R-E-C',
  },
  ai_trap_verdict: 'TRIGGERED_AND_REJECTED',
  criteria_breakdown: [],
  completed_missions_count: 1,
  confidence_level: 60,
};

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

  it('ranks Logistics and QA seed programs cleanly in descending compatibility order', () => {
    const logPrograms = IndustryRegistry.getPrograms('IND_LOG_COLDCHAIN');
    const qaPrograms = IndustryRegistry.getPrograms('IND_QA_DATA');

    expect(logPrograms.length).toBe(5);
    expect(qaPrograms.length).toBe(5);
    expect(IndustryRegistry.getAllPrograms().length).toBe(10);

    const ranked = ScoringEngine.rankPrograms(MOCK_PROFILE, logPrograms);
    expect(ranked[0].rank).toBe(1);
    expect(ranked[0].match_percentage).toBeGreaterThanOrEqual(ranked[1].match_percentage);
    expect(ranked[0].match_percentage).toBeGreaterThanOrEqual(80);
    expect(ranked[ranked.length - 1].rank).toBe(5);
  });
});
