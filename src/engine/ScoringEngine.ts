/**
 * Mathematical Scoring, Big Five (OCEAN), Holland RIASEC & Vector Space Matching Engine
 * Reference: specs/Scenario_&_Scoring_Spec.md & docs/roadmap/gamification_diegetic_ui_rfc.md
 */

import { EducationalProgram } from '../types/program';
import {
  CompetencyProfile,
  ProgramMatchResult,
  BigFiveProfile,
  RiasecProfile,
} from '../types/state';

export interface GatekeeperInput {
  totalItems: number;
  correctItems: number;
  durationSeconds: number;
}

export interface GatekeeperResult {
  shouldExit: boolean;
  reason?: 'LOW_ACCURACY' | 'ERRATIC_SPEED';
  accuracy: number;
  speedSecondsPerItem: number;
}

export interface LogicScoreInput {
  accuracy: number;          // 0.0 - 1.0
  rootCauseIsolated: boolean;// true = 1.0, false = 0.0
  optimalPathTaken: boolean; // true = 1.0, false = 0.0
}

export interface PatienceScoreInput {
  handbookReadingMs: number; // Reading duration in milliseconds
  tabSwitchCount: number;    // Number of cross-check tab switches
  pacingStability?: number;  // 0.0 - 1.0 (default 1.0 if not erratic)
}

export interface ResilienceScoreInput {
  errorRateNormal: number;   // Error rate before last 60s (0.0 - 1.0)
  errorRateStress: number;   // Error rate during last 60s (0.0 - 1.0)
  panicClicksCount: number;  // Clicks in rapid succession (> 3 clicks/s)
}

export class ScoringEngine {
  /**
   * Evaluate Stage 1 Gatekeeper filter
   * Triggers Early Exit if Accuracy < 60% OR Average Speed < 1.2s/item
   */
  public static evaluateStage1Gatekeeper(input: GatekeeperInput): GatekeeperResult {
    const { totalItems, correctItems, durationSeconds } = input;
    if (totalItems <= 0) {
      return { shouldExit: false, accuracy: 0, speedSecondsPerItem: 0 };
    }

    const accuracy = correctItems / totalItems;
    const speedSecondsPerItem = durationSeconds / totalItems;

    if (accuracy < 0.60) {
      return {
        shouldExit: true,
        reason: 'LOW_ACCURACY',
        accuracy,
        speedSecondsPerItem,
      };
    }

    if (speedSecondsPerItem < 1.2) {
      return {
        shouldExit: true,
        reason: 'ERRATIC_SPEED',
        accuracy,
        speedSecondsPerItem,
      };
    }

    return {
      shouldExit: false,
      accuracy,
      speedSecondsPerItem,
    };
  }

  /**
   * S_Logic = (0.50 * Accuracy + 0.35 * RootCause + 0.15 * OptimalPath) * 100
   */
  public static calculateLogicScore(input: LogicScoreInput): number {
    const rootCauseVal = input.rootCauseIsolated ? 1.0 : 0.0;
    const optimalVal = input.optimalPathTaken ? 1.0 : 0.0;
    const score = (0.50 * input.accuracy + 0.35 * rootCauseVal + 0.15 * optimalVal) * 100;
    return Math.min(100, Math.max(0, Math.round(score * 10) / 10));
  }

  /**
   * S_Patience = (0.40 * HandbookMastery + 0.35 * TabInspection + 0.25 * PacingStability) * 100
   */
  public static calculatePatienceScore(input: PatienceScoreInput): number {
    // 15 seconds reading = full mastery (1.0)
    const handbookMastery = Math.min(1.0, input.handbookReadingMs / 15000);
    // 4 tab switches = thorough cross-checking (1.0)
    const tabInspection = Math.min(1.0, input.tabSwitchCount / 4);
    const pacing = input.pacingStability !== undefined ? input.pacingStability : 1.0;

    const score = (0.40 * handbookMastery + 0.35 * tabInspection + 0.25 * pacing) * 100;
    return Math.min(100, Math.max(0, Math.round(score * 10) / 10));
  }

  /**
   * S_Resilience = (1 - max(0, ErrorStress - ErrorNormal)) * 60 + (1 - PanicRate) * 40
   */
  public static calculateResilienceScore(input: ResilienceScoreInput): number {
    const errorDelta = Math.max(0, input.errorRateStress - input.errorRateNormal);
    const panicRate = Math.min(1.0, input.panicClicksCount / 5);

    const stressComposure = (1.0 - errorDelta) * 60;
    const panicFreeBonus = (1.0 - panicRate) * 40;

    const score = Math.max(0, stressComposure + panicFreeBonus);
    return Math.min(100, Math.max(0, Math.round(score * 10) / 10));
  }

  /**
   * Compute Big Five (OCEAN) Personality Traits from empirical micro-task telemetry
   */
  public static computeBigFiveProfile(
    logicScore: number,
    patienceScore: number,
    resilienceScore: number,
    pinnedCluesCount: number = 1,
    completedTasksCount: number = 2
  ): BigFiveProfile {
    const clamp = (val: number) => Math.min(100, Math.max(20, Math.round(val)));

    // 1. Conscientiousness (Tận tâm): SOP discipline & patience
    const conscientiousness = clamp(0.65 * patienceScore + 0.35 * logicScore);
    // 2. Openness (Cởi mở): Pattern recognition & clue pinning
    const openness = clamp(0.70 * logicScore + 0.20 * patienceScore + Math.min(10, pinnedCluesCount * 4));
    // 3. Emotional Stability (Ổn định cảm xúc): Composure under countdown stress
    const emotional_stability = clamp(0.80 * resilienceScore + 0.20 * patienceScore);
    // 4. Agreeableness (Hòa đồng): Stakeholder balance & empathy
    const agreeableness = clamp(0.50 * patienceScore + 0.30 * resilienceScore + Math.min(20, completedTasksCount * 4));
    // 5. Extraversion (Hướng ngoại): Proactive interaction & multi-domain engagement
    const extraversion = clamp(0.45 * resilienceScore + 0.35 * logicScore + Math.min(20, completedTasksCount * 4));

    return {
      conscientiousness,
      openness,
      extraversion,
      agreeableness,
      emotional_stability,
    };
  }

  /**
   * Map Big Five (OCEAN) + domain behavioral signals to Holland RIASEC 6 career dimensions
   */
  public static computeRiasecProfile(
    bigFive: BigFiveProfile,
    logicScore: number,
    patienceScore: number,
    resilienceScore: number
  ): RiasecProfile {
    const clamp = (val: number) => Math.min(100, Math.max(15, Math.round(val)));

    const realistic = clamp(0.50 * logicScore + 0.50 * resilienceScore);
    const investigative = clamp(0.60 * bigFive.openness + 0.40 * logicScore);
    const artistic = clamp(0.65 * bigFive.openness + 0.35 * bigFive.extraversion);
    const social = clamp(0.60 * bigFive.agreeableness + 0.40 * bigFive.extraversion);
    const enterprising = clamp(0.55 * bigFive.extraversion + 0.45 * bigFive.emotional_stability);
    const conventional = clamp(0.65 * bigFive.conscientiousness + 0.35 * patienceScore);

    const pairs: Array<{ code: string; val: number }> = [
      { code: 'R', val: realistic },
      { code: 'I', val: investigative },
      { code: 'A', val: artistic },
      { code: 'S', val: social },
      { code: 'E', val: enterprising },
      { code: 'C', val: conventional },
    ];
    pairs.sort((a, b) => b.val - a.val);
    const top_code = `${pairs[0].code}-${pairs[1].code}-${pairs[2].code}`;

    return {
      realistic,
      investigative,
      artistic,
      social,
      enterprising,
      conventional,
      top_code,
    };
  }

  /**
   * Compute full 3-axis profile, Big Five (OCEAN), Holland RIASEC and qualitative insights
   */
  public static generateCompetencyProfile(
    logicInput: LogicScoreInput,
    patienceInput: PatienceScoreInput,
    resilienceInput: ResilienceScoreInput,
    stage1Accuracy: number,
    earlyExitTriggered: boolean = false,
    completedMicroTasksCount: number = 2
  ): CompetencyProfile {
    const logic_score = this.calculateLogicScore(logicInput);
    const patience_score = this.calculatePatienceScore(patienceInput);
    const resilience_score = this.calculateResilienceScore(resilienceInput);

    const stage1Score = stage1Accuracy * 100;
    const stage2Score = (logic_score + patience_score + resilience_score) / 3;
    const composite_score = Math.round((0.30 * stage1Score + 0.70 * stage2Score) * 10) / 10;

    const qualitative_insights: string[] = [];

    if (logic_score >= 80) {
      qualitative_insights.push("Tư duy phân tích nguyên nhân gốc sắc bén, phát hiện chính xác nguồn gốc lỗi không bị đánh lừa bởi dữ liệu nhiễu.");
    } else {
      qualitative_insights.push("Cần rèn luyện thêm khả năng xâu chuỗi dữ liệu đa chiều để tránh bị phân tâm bởi các cảnh báo giả.");
    }

    if (patience_score >= 75) {
      qualitative_insights.push("Tính cẩn trọng cao, chủ động tra cứu quy tắc nghiệp vụ trong sổ tay Handbook trước khi đưa ra quyết định.");
    } else {
      qualitative_insights.push("Có xu hướng dựa vào trực giác ban đầu hơn là đối soát kỹ lưỡng các tài liệu đặc tả.");
    }

    if (resilience_score >= 75) {
      qualitative_insights.push("Giữ vững sự bình tĩnh xuất sắc trong giai đoạn áp lực đếm ngược 60s cuối, không có hành vi bấm chuột hoảng loạn.");
    } else {
      qualitative_insights.push("Tỷ lệ sai sót có dấu hiệu gia tăng khi đồng hồ báo đỏ, cần cải thiện khả năng làm chủ áp lực giờ G.");
    }

    const big_five = this.computeBigFiveProfile(
      logic_score,
      patience_score,
      resilience_score,
      patienceInput.tabSwitchCount,
      completedMicroTasksCount
    );

    const riasec = this.computeRiasecProfile(
      big_five,
      logic_score,
      patience_score,
      resilience_score
    );

    // Minimum 5 Micro-Tasks reaches 100% framework confidence
    const confidence_level = Math.min(100, Math.round((completedMicroTasksCount / 5) * 100));

    return {
      logic_score,
      patience_score,
      resilience_score,
      composite_score,
      qualitative_insights,
      early_exit_triggered: earlyExitTriggered,
      big_five,
      riasec,
      completed_micro_tasks_count: completedMicroTasksCount,
      confidence_level,
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

    // Euclidean distance penalty normalized by sqrt(3) (max theoretical distance in [0,1]^3)
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
    const userVector: [number, number, number] = [
      profile.logic_score / 100,
      profile.patience_score / 100,
      profile.resilience_score / 100,
    ];

    const scored = programs.map(prog => {
      const progVector: [number, number, number] = [
        prog.match_traits.weight_logic,
        prog.match_traits.weight_patience,
        prog.match_traits.weight_resilience,
      ];

      const matchCoefficient = this.computeCosineMatch(userVector, progVector);
      const matchPercentage = Math.round(matchCoefficient * 100);

      return {
        program: prog,
        match_percentage: matchPercentage,
        is_revealed: false,
        rank: 0,
      };
    });

    // Sort descending by match percentage
    scored.sort((a, b) => b.match_percentage - a.match_percentage);

    // Assign 1-based ranks
    return scored.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }
}

export default ScoringEngine;
