/**
 * Scoring, Big Five (OCEAN), Holland RIASEC & Vector Space Matching Engine — LucidTask v2.0
 * Bridges domain-specific mission evaluations (Logistics & QA/Data) into unified psychometric profiles
 * and Blind Matching program recommendations.
 */

import { EducationalProgram } from '../types/program';
import {
  CompetencyProfile,
  ProgramMatchResult,
} from '../types/state';
import {
  LogisticsEvaluationResult,
  MissionEvaluationResult,
  QaEvaluationResult,
} from '../types/mission';

const clamp = (val: number, min = 15, max = 100): number =>
  Math.min(max, Math.max(min, Math.round(val)));

export class ScoringEngine {
  /**
   * Convert a Logistics or QA/Data evaluation result into a unified CompetencyProfile
   * ready for CompetencyRadar, BlindMatchingCards, and ParentAlignmentKit.
   */
  public static buildCompetencyProfile(
    evaluation: MissionEvaluationResult,
    completedMissionsCount: number = 1
  ): CompetencyProfile {
    const confidence_level = completedMissionsCount >= 2 ? 100 : 60;

    if (evaluation.missionId === 'IND_LOG_COLDCHAIN') {
      return this.fromLogisticsEvaluation(evaluation, completedMissionsCount, confidence_level);
    }

    return this.fromQaEvaluation(evaluation, completedMissionsCount, confidence_level);
  }

  private static fromLogisticsEvaluation(
    ev: LogisticsEvaluationResult,
    completedMissionsCount: number,
    confidenceLevel: number
  ): CompetencyProfile {
    const logic_score = clamp(
      0.55 * ev.scores.openness + 0.45 * (ev.totalFinancialDamageVnd <= 72_000_000 && ev.overloadViolationsCount === 0 ? 96 : ev.scores.emotional_stability),
      15,
      100
    );
    const patience_score = ev.scores.conscientiousness;
    const resilience_score = ev.scores.emotional_stability;

    return {
      mission_id: 'IND_LOG_COLDCHAIN',
      mission_title: 'Logistics — Điều Phối Chuỗi Cung Ứng Lạnh',
      logic_score,
      patience_score,
      resilience_score,
      composite_score: ev.scores.composite,
      qualitative_insights: ev.qualitativeInsights,
      big_five: {
        conscientiousness: ev.scores.conscientiousness,
        emotional_stability: ev.scores.emotional_stability,
        openness: ev.scores.openness,
        agreeableness: clamp(0.5 * ev.scores.conscientiousness + 0.5 * ev.planReasoningScore, 25, 92),
        extraversion: clamp(0.55 * ev.scores.emotional_stability + 0.45 * ev.planReasoningScore, 25, 92),
      },
      big_five_weights: {
        conscientiousness: 50,
        emotional_stability: 35,
        openness: 15,
      },
      riasec: ev.riasec,
      ai_trap_verdict: ev.aiTrapVerdict,
      criteria_breakdown: ev.criteria,
      completed_missions_count: completedMissionsCount,
      confidence_level: confidenceLevel,
    };
  }

  private static fromQaEvaluation(
    ev: QaEvaluationResult,
    completedMissionsCount: number,
    confidenceLevel: number
  ): CompetencyProfile {
    const logic_score = ev.scores.openness;
    const patience_score = ev.scores.conscientiousness;
    const resilience_score = ev.scores.emotional_stability;

    return {
      mission_id: 'IND_QA_DATA',
      mission_title: 'Kiểm Thử Phần Mềm (QA) & Làm Sạch Dữ Liệu',
      logic_score,
      patience_score,
      resilience_score,
      composite_score: ev.scores.composite,
      qualitative_insights: ev.qualitativeInsights,
      big_five: {
        conscientiousness: ev.scores.conscientiousness,
        openness: ev.scores.openness,
        emotional_stability: ev.scores.emotional_stability,
        agreeableness: clamp(0.5 * ev.scores.conscientiousness + 0.5 * ev.reportQualityScore, 25, 92),
        extraversion: clamp(0.5 * ev.scores.openness + 0.5 * ev.reportQualityScore, 25, 90),
      },
      big_five_weights: {
        conscientiousness: 45,
        openness: 35,
        emotional_stability: 20,
      },
      riasec: ev.riasec,
      ai_trap_verdict: ev.aiTrapVerdict,
      criteria_breakdown: ev.criteria,
      completed_missions_count: completedMissionsCount,
      confidence_level: confidenceLevel,
    };
  }

  /**
   * Cosine Similarity Vector Matching with Axis Deviation Penalty
   * Match_Score = ( (V_Student . V_Prog) / (|V_Student| * |V_Prog|) ) * (1 - |V_Student - V_Prog| / sqrt(3))
   */
  public static computeCosineMatch(
    userVector: [number, number, number],
    programVector: [number, number, number]
  ): number {
    const [u1, u2, u3] = userVector;
    const [p1, p2, p3] = programVector;

    const dotProduct = u1 * p1 + u2 * p2 + u3 * p3;
    const normU = Math.sqrt(u1 * u1 + u2 * u2 + u3 * u3);
    const normP = Math.sqrt(p1 * p1 + p2 * p2 + p3 * p3);

    if (normU === 0 || normP === 0) {
      return 0.0;
    }

    const cosineSimilarity = dotProduct / (normU * normP);

    const distance = Math.sqrt(
      Math.pow(u1 - p1, 2) + Math.pow(u2 - p2, 2) + Math.pow(u3 - p3, 2)
    );
    const penalty = Math.max(0, 1 - distance / Math.sqrt(3));

    const finalScore = cosineSimilarity * penalty;
    return Math.max(0.0, Math.min(1.0, finalScore));
  }

  /**
   * Rank programs in descending order of compatibility with user's competency profile
   */
  public static rankPrograms(
    profile: CompetencyProfile,
    programs: EducationalProgram[]
  ): ProgramMatchResult[] {
    const rawSum = profile.logic_score + profile.patience_score + profile.resilience_score;
    const userVector: [number, number, number] =
      rawSum > 0
        ? [
            profile.logic_score / rawSum,
            profile.patience_score / rawSum,
            profile.resilience_score / rawSum,
          ]
        : [1 / 3, 1 / 3, 1 / 3];

    // Modulate pure trait-shape cosine match by composite readiness (range ~0.62..1.00)
    const readinessFactor = 0.62 + 0.38 * (profile.composite_score / 100);

    const scored = programs.map(prog => {
      const progSum =
        prog.match_traits.weight_logic +
        prog.match_traits.weight_patience +
        prog.match_traits.weight_resilience;
      const progVector: [number, number, number] =
        progSum > 0
          ? [
              prog.match_traits.weight_logic / progSum,
              prog.match_traits.weight_patience / progSum,
              prog.match_traits.weight_resilience / progSum,
            ]
          : [1 / 3, 1 / 3, 1 / 3];

      const matchCoefficient = this.computeCosineMatch(userVector, progVector);
      const matchPercentage = Math.min(
        99,
        Math.max(25, Math.round(matchCoefficient * readinessFactor * 100))
      );

      return {
        program: prog,
        match_percentage: matchPercentage,
        is_revealed: false,
        rank: 0,
      };
    });

    scored.sort((a, b) => b.match_percentage - a.match_percentage);

    return scored.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }
}

export default ScoringEngine;
