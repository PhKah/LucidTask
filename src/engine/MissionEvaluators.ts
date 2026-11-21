import {
  AiTrapVerdict,
  CargoLotId,
  DefectCategory,
  FlowNodeAuditRow,
  LogisticsAllocationMatrix,
  LogisticsEvaluationResult,
  LogisticsBehaviorFinding,
  LogisticsSubmission,
  MissionCriterionAudit,
  OrderAuditRow,
  QaEvaluationResult,
  QaSubmission,
  ResourceSlotId,
  VehicleAuditRow,
} from '../types/mission';
import { LOGISTICS_COLDCHAIN_SCENARIO } from '../registry/logistics_coldchain/scenario';
import { QA_DATA_CLEANING_SCENARIO, QA_DUPLICATE_PAIRS } from '../registry/qa_data_cleaning/scenario';

const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(max, Math.max(min, Math.round(value)));

const formatMillion = (vnd: number): string => {
  const m = vnd / 1_000_000;
  return Number.isInteger(m) ? `${m} triệu` : `${m.toFixed(1)} triệu`;
};

/* ============================================================================
 * LOGISTICS PASSIVE LEDGER HELPER (RAW CUMULATIVE NUMBERS ONLY — NO ALERTS)
 * ============================================================================ */

export interface LogisticsPassiveLedgerTotals {
  perLotAllocated: Record<CargoLotId, number>;
  perResourceAllocated: Record<ResourceSlotId, number>;
  totalAllocatedTons: number;
  afternoonTons: number;
  nextDayTons: number;
  vehicleTripCostVnd: number;
  coldStorageCostVnd: number;
  totalOperationalCostVnd: number;
}

export function computeLogisticsPassiveTotals(
  allocation: LogisticsAllocationMatrix
): LogisticsPassiveLedgerTotals {
  const perLotAllocated: Record<CargoLotId, number> = {
    LOT_A: 0,
    LOT_B: 0,
    LOT_C: 0,
  };

  const perResourceAllocated: Record<ResourceSlotId, number> = {
    TRUCK_20FT: 0,
    VAN_1: 0,
    VAN_2: 0,
    VAN_3: 0,
    COLD_STORAGE_HP: 0,
    NEXT_DAY_PORT: 0,
  };

  const lotIds: CargoLotId[] = ['LOT_A', 'LOT_B', 'LOT_C'];
  const resourceIds: ResourceSlotId[] = [
    'TRUCK_20FT',
    'VAN_1',
    'VAN_2',
    'VAN_3',
    'COLD_STORAGE_HP',
    'NEXT_DAY_PORT',
  ];

  for (const lotId of lotIds) {
    for (const resId of resourceIds) {
      const tons = Math.max(0, Number(allocation[lotId]?.[resId] || 0));
      perLotAllocated[lotId] += tons;
      perResourceAllocated[resId] += tons;
    }
  }

  const totalAllocatedTons = perLotAllocated.LOT_A + perLotAllocated.LOT_B + perLotAllocated.LOT_C;
  const afternoonTons =
    perResourceAllocated.TRUCK_20FT +
    perResourceAllocated.VAN_1 +
    perResourceAllocated.VAN_2 +
    perResourceAllocated.VAN_3;
  const nextDayTons =
    perResourceAllocated.COLD_STORAGE_HP + perResourceAllocated.NEXT_DAY_PORT;

  let vehicleTripCostVnd = 0;
  let coldStorageCostVnd = 0;

  for (const res of LOGISTICS_COLDCHAIN_SCENARIO.resources) {
    const usedTons = perResourceAllocated[res.id];
    if (res.category === 'AFTERNOON_VEHICLE' && usedTons > 0) {
      vehicleTripCostVnd += res.fixedCostVnd;
    }
    if (res.category === 'COLD_STORAGE' && usedTons > 0) {
      coldStorageCostVnd += usedTons * res.costPerTonVnd;
    }
  }

  return {
    perLotAllocated,
    perResourceAllocated,
    totalAllocatedTons,
    afternoonTons,
    nextDayTons,
    vehicleTripCostVnd,
    coldStorageCostVnd,
    totalOperationalCostVnd: vehicleTripCostVnd + coldStorageCostVnd,
  };
}

/* ============================================================================
 * MISSION 1 EVALUATOR: LOGISTICS COLD-CHAIN DISPATCH
 * ============================================================================ */

function scoreLogisticsPlanText(
  planText: string,
  estimatedDamageMillion: number | null,
  actualDamageVnd: number,
  aiRejected: boolean
): number {
  const normalized = planText.toLowerCase();
  let score = 0;

  // 1. Written length substance
  if (normalized.trim().length >= 30) score += 20;
  if (normalized.trim().length >= 80) score += 10;

  // 2. Score the player's estimate against *their submitted plan*, not
  // the fixed optimal 72M example. A 72M estimate for a 108M plan is incorrect.
  if (estimatedDamageMillion !== null && Number.isFinite(estimatedDamageMillion)) {
    const actualMillion = actualDamageVnd / 1_000_000;
    const error = Math.abs(estimatedDamageMillion - actualMillion);
    if (error <= 3) score += 30;
    else if (error <= 5) score += 20;
  }

  // 3. Key tradeoff reasoning cues
  const mentionsSlaVsSpoilage =
    (normalized.includes('72') || normalized.includes('sla') || normalized.includes('phạt') || normalized.includes('cá hồi')) &&
    (normalized.includes('160') || normalized.includes('trái cây') || normalized.includes('hỏng') || normalized.includes('80'));
  if (mentionsSlaVsSpoilage) score += 25;

  const mentionsConstraint =
    normalized.includes('15 tấn') ||
    normalized.includes('tải trọng') ||
    normalized.includes('30 tấn') ||
    normalized.includes('kho lạnh') ||
    normalized.includes('-18') ||
    normalized.includes('quá tải');
  if (mentionsConstraint) score += 15;

  if (aiRejected && (normalized.includes('ai') || normalized.includes('quá tải') || normalized.includes('18'))) {
    score += 10;
  }

  return clamp(score, 0, 100);
}

export function evaluateLogisticsMission(
  submission: LogisticsSubmission
): LogisticsEvaluationResult {
  const scenario = LOGISTICS_COLDCHAIN_SCENARIO;
  const totals = computeLogisticsPassiveTotals(submission.allocation);
  const alloc = submission.allocation;

  // 1. Physical Capacity Audit (Hạng mục 3/4 — Self-Verification)
  const vehicleAudits: VehicleAuditRow[] = scenario.resources.map(res => {
    const assignedTons = totals.perResourceAllocated[res.id];
    const isOverloaded =
      res.maxCapacityTons !== null && assignedTons > res.maxCapacityTons;
    const overloadAmount =
      res.maxCapacityTons !== null ? Math.max(0, assignedTons - res.maxCapacityTons) : 0;

    return {
      resourceId: res.id,
      resourceName: res.name,
      assignedTons,
      maxCapacityTons: res.maxCapacityTons,
      isOverloaded,
      overloadAmount,
    };
  });

  const overloadViolationsCount = vehicleAudits.filter(v => v.isOverloaded).length;

  // 2. Temperature & Cold-Chain Buffering Audit (Hạng mục 1/4)
  const temperatureViolations: string[] = [];
  const lotBInColdStorage = alloc.LOT_B.COLD_STORAGE_HP || 0;
  const lotBOnPort = alloc.LOT_B.NEXT_DAY_PORT || 0;
  const lotCOnPort = alloc.LOT_C.NEXT_DAY_PORT || 0;
  const lotCInColdStorage = alloc.LOT_C.COLD_STORAGE_HP || 0;

  if (lotBInColdStorage > 0) {
    temperatureViolations.push(
      `Đưa ${lotBInColdStorage} tấn Trái cây Lô #B (+4°C) vào Kho lạnh âm độ (-18°C → 0°C) làm đông hỏng 100% giá trị (${formatMillion(lotBInColdStorage * 80_000_000)}).`
    );
  }
  if (lotCOnPort > 0) {
    temperatureViolations.push(
      `Bỏ ${lotCOnPort} tấn Thủy sản cấp đông sâu Lô #C (-18°C) ngoài bãi chờ nhiệt độ thường 13 giờ làm rã đông hỏng hoàn toàn (${formatMillion(lotCOnPort * 120_000_000)}).`
    );
  }

  const lotCBufferedProperly = lotCInColdStorage === 10 && lotCOnPort === 0;
  const lotBSavedFully = lotBInColdStorage === 0 && lotBOnPort === 0 && totals.perLotAllocated.LOT_B === 14;

  // 3. Financial Damage Calculation (Hạng mục 2/4 — Damage-Minimization Math)
  // Delay from 18:00 today -> 06:00 tomorrow = 12 hours
  const lotAOvernightTons = (alloc.LOT_A.COLD_STORAGE_HP || 0) + (alloc.LOT_A.NEXT_DAY_PORT || 0);
  const slaPenaltyVnd = lotAOvernightTons * 12 * 3_000_000;
  const spoilageDamageVnd =
    (lotBInColdStorage + lotBOnPort) * 80_000_000 +
    lotCOnPort * 120_000_000;
  const totalFinancialDamageVnd = slaPenaltyVnd + spoilageDamageVnd;

  // 4. AI Co-pilot Trap Verdict (Hạng mục 4/4)
  let aiTrapVerdict: AiTrapVerdict = 'NOT_TRIGGERED';
  if (submission.aiTriggered) {
    if (!submission.aiExplicitlyRejected && overloadViolationsCount > 0) {
      aiTrapVerdict = 'TRIGGERED_AND_ACCEPTED';
    } else {
      aiTrapVerdict = 'TRIGGERED_AND_REJECTED';
    }
  }

  // 5. Written Plan Reasoning Score
  const planReasoningScore = scoreLogisticsPlanText(
    submission.contingencyPlanText,
    submission.estimatedDamageMillionVnd,
    totalFinancialDamageVnd,
    aiTrapVerdict === 'TRIGGERED_AND_REJECTED'
  );

  // 6. Big Five Weighted Scoring (Conscientiousness 50%, Emotional Stability 35%, Openness 15%)
  let conscientiousness = 100;
  conscientiousness -= overloadViolationsCount * 35;
  conscientiousness -= temperatureViolations.length * 25;
  if (!lotCBufferedProperly) conscientiousness -= 15;
  if (totals.totalAllocatedTons !== 42) conscientiousness -= 25;
  if (aiTrapVerdict === 'TRIGGERED_AND_ACCEPTED') conscientiousness -= 20;
  conscientiousness = clamp(conscientiousness, 15, 100);

  let emotionalStability = 50;
  if (overloadViolationsCount === 0 && temperatureViolations.length === 0 && totals.totalAllocatedTons === 42) {
    if (totalFinancialDamageVnd <= 72_000_000) {
      emotionalStability = 95;
    } else if (totalFinancialDamageVnd <= 110_000_000) {
      emotionalStability = 80;
    } else if (totalFinancialDamageVnd <= 160_000_000) {
      emotionalStability = 64;
    } else {
      emotionalStability = 48;
    }
  } else if (overloadViolationsCount > 0) {
    // Panicked or blindly overloaded trucks to avoid controlled loss
    emotionalStability = 38;
  } else {
    emotionalStability = 46;
  }
  emotionalStability -= Math.min(20, submission.panicClicksCount * 4);
  if (planReasoningScore >= 70) emotionalStability += 5;
  emotionalStability = clamp(emotionalStability, 15, 100);

  // Multi-modal flexibility: using 20ft truck + vans + cold storage together
  const uses20ft = totals.perResourceAllocated.TRUCK_20FT > 0;
  const usesVans =
    totals.perResourceAllocated.VAN_1 +
      totals.perResourceAllocated.VAN_2 +
      totals.perResourceAllocated.VAN_3 >
    0;
  const usesColdStorage = totals.perResourceAllocated.COLD_STORAGE_HP > 0;

  let openness = uses20ft && usesVans && usesColdStorage ? 68 : 52;
  if (aiTrapVerdict === 'TRIGGERED_AND_REJECTED') {
    openness += 24;
  } else if (aiTrapVerdict === 'NOT_TRIGGERED') {
    openness += 14;
  } else {
    openness -= 32;
  }
  openness += Math.round(planReasoningScore * 0.12);
  openness = clamp(openness, 15, 100);

  const composite = clamp(
    0.50 * conscientiousness + 0.35 * emotionalStability + 0.15 * openness,
    15,
    100
  );

  // 7. RIASEC Profile anchored on Realistic (45%) - Enterprising (30%) - Conventional (25%)
  const performanceScale = composite / 100;
  const realistic = clamp(42 + performanceScale * 54 + (overloadViolationsCount === 0 ? 4 : -10), 20, 99);
  const enterprising = clamp(36 + (emotionalStability / 100) * 48 + (lotBSavedFully ? 6 : -4), 20, 95);
  const conventional = clamp(34 + (conscientiousness / 100) * 48 + (lotCBufferedProperly ? 4 : -6), 20, 94);
  const investigative = clamp(28 + (openness / 100) * 44, 20, 86);
  const social = clamp(30 + (planReasoningScore / 100) * 34, 20, 78);
  const artistic = clamp(22 + (openness / 100) * 26, 15, 65);

  const riasecPairs = [
    { code: 'R', val: realistic },
    { code: 'E', val: enterprising },
    { code: 'C', val: conventional },
    { code: 'I', val: investigative },
    { code: 'S', val: social },
    { code: 'A', val: artistic },
  ].sort((a, b) => b.val - a.val);

  const top_code = `${riasecPairs[0].code}-${riasecPairs[1].code}-${riasecPairs[2].code}`;

  // 8. Detailed Criteria Breakdown (Hidden during play, shown in Debrief & Parent Kit)
  const criteria: MissionCriterionAudit[] = [
    {
      id: 'CRIT_CAPACITY',
      label: 'Hạng mục 3/4 — Tự kiểm soát tải trọng vật lý',
      status: overloadViolationsCount === 0 && totals.totalAllocatedTons === 42 ? 'PASS' : 'FAIL',
      summary:
        overloadViolationsCount === 0
          ? 'Tuyệt đối an toàn — 0 xe vượt tải trọng thiết kế (≤ 15t xe 20ft, ≤ 5t/xe van).'
          : `Phát hiện ${overloadViolationsCount} phương tiện/kho bị xếp QUÁ TẢI so với định mức vật lý.`,
      detail:
        overloadViolationsCount === 0
          ? 'Bạn đã tự đối chiếu chuẩn xác với bảng định mức Cột Trái trên bảng tính thụ động mà không cần hệ thống bật báo động đỏ.'
          : vehicleAudits
              .filter(v => v.isOverloaded)
              .map(v => `${v.resourceName}: xếp ${v.assignedTons} tấn / định mức ${v.maxCapacityTons} tấn (vượt ${v.overloadAmount} tấn).`)
              .join(' '),
    },
    {
      id: 'CRIT_BUFFERING',
      label: 'Hạng mục 1/4 — Kho đệm cấp đông & Bảo toàn nhiệt độ',
      status: lotCBufferedProperly && temperatureViolations.length === 0 ? 'PASS' : temperatureViolations.length === 0 ? 'PARTIAL' : 'FAIL',
      summary:
        lotCBufferedProperly && temperatureViolations.length === 0
          ? 'Chuẩn xác: Đưa đủ 10 tấn Lô #C (-18°C) vào Kho lạnh HP, bảo toàn 100% dải nhiệt độ.'
          : temperatureViolations.length > 0
            ? `Vi phạm dải nhiệt độ bảo quản (${temperatureViolations.length} lỗi nghiêm trọng).`
            : `Chưa tối ưu kho đệm: Mới đưa ${lotCInColdStorage}/10 tấn Lô #C vào Kho lạnh HP.`,
      detail:
        temperatureViolations.length > 0
          ? temperatureViolations.join(' ')
          : 'Đưa toàn bộ 10 tấn thủy sản cấp đông sâu Lô #C vào Kho lạnh trung chuyển Hải Phòng (-18°C, phí 15tr/ngày) giúp giải phóng trọn vẹn 30 tấn xe chiều nay cho hàng tươi sống.',
    },
    {
      id: 'CRIT_DAMAGE_MATH',
      label: 'Hạng mục 2/4 — Toán đánh đổi thiệt hại (SLA vs. Hỏng hàng)',
      status:
        overloadViolationsCount === 0 && totalFinancialDamageVnd <= 72_000_000 && totals.totalAllocatedTons === 42
          ? 'PASS'
          : totalFinancialDamageVnd <= 160_000_000 && overloadViolationsCount === 0
            ? 'PARTIAL'
            : 'FAIL',
      summary: `Tổng thiệt hại từ phương án của bạn: ${formatMillion(totalFinancialDamageVnd)} VNĐ (Mức tối ưu chuẩn: 72 triệu VNĐ).`,
      detail:
        totalFinancialDamageVnd <= 72_000_000 && overloadViolationsCount === 0
          ? 'Xuất sắc! Bạn đã ưu tiên cứu trọn vẹn 14 tấn trái cây Lô #B (tránh hỏng 160 triệu) và chấp nhận trễ 12 giờ với 2 tấn cá hồi Lô #A (chỉ chịu 72 triệu phạt SLA, tiết kiệm 88 triệu VNĐ cho doanh nghiệp).'
          : `Chi tiết phát sinh: Phạt trễ SLA Lô #A = ${formatMillion(slaPenaltyVnd)} VNĐ; Thiệt hại hỏng hàng = ${formatMillion(spoilageDamageVnd)} VNĐ. Phương án tối ưu là chở đủ 14 tấn Lô #B + 16 tấn Lô #A chiều nay và giữ 2 tấn Lô #A chờ chuyến 03:30 (chỉ thiệt hại 72 triệu thay vì 160 triệu).`,
    },
    {
      id: 'CRIT_AI_TRAP',
      label: 'Hạng mục 4/4 — Bản lĩnh phản biện trước Cạm bẫy AI Co-pilot',
      status:
        aiTrapVerdict === 'TRIGGERED_AND_REJECTED'
          ? 'PASS'
          : aiTrapVerdict === 'NOT_TRIGGERED'
            ? 'PASS'
            : 'FAIL',
      summary:
        aiTrapVerdict === 'TRIGGERED_AND_REJECTED'
          ? 'Xuất sắc! Phát hiện gian lận quá tải 18t/15t của AI Co-pilot và chủ động bác bỏ.'
          : aiTrapVerdict === 'NOT_TRIGGERED'
            ? 'Tự giải quyết độc lập hoàn toàn không phụ thuộc gợi ý AI Co-pilot.'
            : 'Dính bẫy AI Co-pilot! Đã tin vào lời hứa "0đ phạt" và nộp phương án xếp 18 tấn lên xe 15 tấn.',
      detail:
        aiTrapVerdict === 'TRIGGERED_AND_ACCEPTED'
          ? 'AI Co-pilot đã cố tình gian lận thông số kỹ thuật (xếp 18 tấn cá hồi lên chiếc xe tải lạnh 20ft chỉ có tải trọng 15 tấn), gây nguy cơ lật xe, bị phạt giao thông và hỏng dàn lạnh toàn bộ lô 5,4 tỷ đồng.'
          : 'Trong vận hành Logistics thực tế, chuyên viên điều phối luôn phải tự kiểm chứng giới hạn vật lý thay vì tin mù quáng vào các "giải pháp hoàn hảo giả tạo" từ công cụ tự động.',
    },
  ];

  // 9. Evidence-grounded findings: describe what the final plan demonstrates.
  // Do not claim the player achieved the optimal 72M unless the calculation supports it.
  const allTonsAssigned = totals.totalAllocatedTons === scenario.lots.reduce((sum, lot) => sum + lot.totalTons, 0);
  const physicallySafe = allTonsAssigned && overloadViolationsCount === 0 && temperatureViolations.length === 0;
  const achievedOptimal = physicallySafe && totalFinancialDamageVnd <= scenario.optimalDamageVnd;
  const behaviorFindings: LogisticsBehaviorFinding[] = [
    physicallySafe
      ? {
          id: 'constraints', title: 'Kiểm soát ràng buộc', status: 'strength',
          text: `Phương án cuối đã phân bổ đủ ${totals.totalAllocatedTons} tấn, không vượt sức chứa xe và không có lỗi nhiệt độ được kịch bản ghi nhận.`,
        }
      : {
          id: 'constraints', title: 'Kiểm soát ràng buộc', status: 'caution',
          text: `Phương án cuối có ${overloadViolationsCount} vị trí quá tải, ${temperatureViolations.length} lỗi nhiệt độ; đã phân bổ ${totals.totalAllocatedTons}/42 tấn. Cần rà soát lại trước khi áp dụng.`,
        },
    achievedOptimal
      ? {
          id: 'tradeoff', title: 'Cân nhắc thiệt hại', status: 'strength',
          text: `Phương án của bạn gây ${formatMillion(totalFinancialDamageVnd)} đồng thiệt hại, đạt mức tham chiếu tối ưu ${formatMillion(scenario.optimalDamageVnd)} đồng.`,
        }
      : physicallySafe
        ? {
            id: 'tradeoff', title: 'Cân nhắc thiệt hại', status: 'improve',
            text: `Phương án hợp lệ nhưng thiệt hại ${formatMillion(totalFinancialDamageVnd)} đồng, cao hơn mức tham chiếu ${formatMillion(scenario.optimalDamageVnd)} đồng. Có thể tối ưu thêm lịch chuyển hàng.`,
          }
        : {
            id: 'tradeoff', title: 'Cân nhắc thiệt hại', status: 'caution',
            text: `Thiệt hại tính theo kịch bản là ${formatMillion(totalFinancialDamageVnd)} đồng, nhưng phương án còn vi phạm ràng buộc nên không thể coi đây là phương án vận hành khả thi.`,
          },
    aiTrapVerdict === 'TRIGGERED_AND_REJECTED'
      ? {
          id: 'ai', title: 'Kiểm chứng AI Co-pilot', status: 'strength',
          text: 'Bạn đã sử dụng rồi bác bỏ đề xuất AI có xe 20ft xếp 18/15 tấn. Đây là một lần chủ động không chấp nhận kết quả AI chưa kiểm chứng.',
        }
      : aiTrapVerdict === 'TRIGGERED_AND_ACCEPTED'
        ? {
            id: 'ai', title: 'Kiểm chứng AI Co-pilot', status: 'caution',
            text: 'Phương án được gửi sau khi dùng AI vẫn vượt tải trọng. Cần đối chiếu đầu ra AI với định mức thực tế trước khi chốt.',
          }
        : {
            id: 'ai', title: 'Kiểm chứng AI Co-pilot', status: 'neutral',
            text: 'Bạn hoàn tất nhiệm vụ mà không kích hoạt AI Co-pilot; lượt này chưa có dữ liệu để đánh giá hành vi kiểm chứng đề xuất AI.',
          },
  ];
  const qualitativeInsights = behaviorFindings.map(finding => `${finding.title}: ${finding.text}`);

  return {
    missionId: 'IND_LOG_COLDCHAIN',
    totalAllocatedTons: totals.totalAllocatedTons,
    vehicleAudits,
    overloadViolationsCount,
    temperatureViolations,
    slaPenaltyVnd,
    spoilageDamageVnd,
    totalFinancialDamageVnd,
    lotAOvernightTons,
    transportAndStorageCostVnd: totals.totalOperationalCostVnd,
    optimalDamageVnd: scenario.optimalDamageVnd,
    lotCBufferedProperly,
    lotBSavedFully,
    estimatedDamageMillionVnd: submission.estimatedDamageMillionVnd,
    contingencyPlanText: submission.contingencyPlanText,
    planReasoningScore,
    aiTrapVerdict,
    scores: {
      conscientiousness,
      emotional_stability: emotionalStability,
      openness,
      composite,
    },
    riasec: {
      realistic,
      enterprising,
      conventional,
      investigative,
      social,
      artistic,
      top_code,
    },
    criteria,
    qualitativeInsights,
    behaviorFindings,
  };
}

/* ============================================================================
 * MISSION 2 EVALUATOR: QA SOFTWARE TESTING & DATA CLEANING
 * ============================================================================ */

function scoreQaReportNote(note: string, releaseDecisionCorrect: boolean): number {
  const normalized = note.toLowerCase();
  let score = 0;

  if (normalized.trim().length >= 25) score += 25;
  if (normalized.trim().length >= 70) score += 15;
  if (releaseDecisionCorrect) score += 20;

  const mentionsDataDefect =
    normalized.includes('ngày') ||
    normalized.includes('30/02') ||
    normalized.includes('âm') ||
    normalized.includes('trùng') ||
    normalized.includes('sđt') ||
    normalized.includes('địa chỉ') ||
    normalized.includes('tính');
  if (mentionsDataDefect) score += 20;

  const mentionsFlowDefect =
    normalized.includes('giảm giá') ||
    normalized.includes('100') ||
    normalized.includes('âm tiền') ||
    normalized.includes('hoàn tiền') ||
    normalized.includes('trừ tiền') ||
    normalized.includes('tồn kho') ||
    normalized.includes('bước 3') ||
    normalized.includes('bước 5');
  if (mentionsFlowDefect) score += 20;

  return clamp(score, 0, 100);
}

export function evaluateQaDataMission(submission: QaSubmission): QaEvaluationResult {
  const scenario = QA_DATA_CLEANING_SCENARIO;
  const userOrders = submission.flaggedOrders;
  const userNodes = submission.flaggedNodes;

  // Handle duplicate pairs fairly: flagging either member of a duplicate pair as DUPLICATE_RECORD counts as catching it!
  const duplicatePartnerFlaggedCorrectly = new Set<string>();
  const duplicateOriginalForgiven = new Set<string>();

  for (const [origId, dupId] of QA_DUPLICATE_PAIRS) {
    const origFlag = userOrders[origId];
    const dupFlag = userOrders[dupId];
    if (origFlag === 'DUPLICATE_RECORD' && !dupFlag) {
      duplicatePartnerFlaggedCorrectly.add(dupId);
      duplicateOriginalForgiven.add(origId);
    } else if (origFlag === 'DUPLICATE_RECORD' && dupFlag === 'DUPLICATE_RECORD') {
      duplicateOriginalForgiven.add(origId);
    }
  }

  let dataBugsCaughtExact = 0;
  let dataBugsWrongCategory = 0;
  let dataFalsePositives = 0;
  const totalExpectedDataBugs = scenario.orders.filter(o => o.expectedDefect !== null).length;

  const orderAudits: OrderAuditRow[] = scenario.orders.map(order => {
    const flagged: DefectCategory | null = userOrders[order.id] || null;

    if (order.expectedDefect !== null) {
      // Expected bug row
      if (flagged === order.expectedDefect || duplicatePartnerFlaggedCorrectly.has(order.id)) {
        dataBugsCaughtExact += 1;
        return {
          orderCode: order.orderCode,
          expectedDefect: order.expectedDefect,
          userFlagged: flagged || 'DUPLICATE_RECORD',
          status: 'TRUE_POSITIVE',
          explanation: order.defectExplanation,
        };
      }
      if (flagged !== null) {
        dataBugsWrongCategory += 1;
        return {
          orderCode: order.orderCode,
          expectedDefect: order.expectedDefect,
          userFlagged: flagged,
          status: 'WRONG_CATEGORY',
          explanation: order.defectExplanation,
        };
      }
      return {
        orderCode: order.orderCode,
        expectedDefect: order.expectedDefect,
        userFlagged: null,
        status: 'MISSED_BUG',
        explanation: order.defectExplanation,
      };
    }

    // Expected clean row
    if (flagged !== null && !duplicateOriginalForgiven.has(order.id)) {
      dataFalsePositives += 1;
      return {
        orderCode: order.orderCode,
        expectedDefect: null,
        userFlagged: flagged,
        status: 'FALSE_POSITIVE',
        explanation: order.defectExplanation,
      };
    }

    return {
      orderCode: order.orderCode,
      expectedDefect: null,
      userFlagged: null,
      status: 'CLEAN_OK',
      explanation: order.defectExplanation,
    };
  });

  // 2. Evaluate Vietnamese Logic Flow Nodes (7 nodes, 2 expected logic bugs)
  let flowBugsCaughtExact = 0;
  let flowBugsCaughtPartial = 0;
  let flowFalsePositives = 0;
  const totalExpectedFlowBugs = scenario.flowNodes.filter(n => n.hasLogicBug).length;

  const flowAudits: FlowNodeAuditRow[] = scenario.flowNodes.map(node => {
    const selectedOptionId = userNodes[node.id];
    const userFlagged = Boolean(selectedOptionId);

    if (node.hasLogicBug) {
      if (!userFlagged) {
        return {
          stepNumber: node.stepNumber,
          title: node.title,
          hasLogicBug: true,
          userFlagged: false,
          reasonCorrect: false,
          status: 'MISSED_BUG',
          explanation: node.expectedBugReason,
        };
      }
      const chosenOption = node.bugOptions.find(opt => opt.id === selectedOptionId);
      const reasonCorrect = Boolean(chosenOption?.isCorrect);
      if (reasonCorrect) {
        flowBugsCaughtExact += 1;
        return {
          stepNumber: node.stepNumber,
          title: node.title,
          hasLogicBug: true,
          userFlagged: true,
          reasonCorrect: true,
          status: 'CAUGHT_EXACT',
          explanation: node.expectedBugReason,
        };
      }
      flowBugsCaughtPartial += 1;
      return {
        stepNumber: node.stepNumber,
        title: node.title,
        hasLogicBug: true,
        userFlagged: true,
        reasonCorrect: false,
        status: 'CAUGHT_PARTIAL',
        explanation: node.expectedBugReason,
      };
    }

    if (userFlagged) {
      flowFalsePositives += 1;
      return {
        stepNumber: node.stepNumber,
        title: node.title,
        hasLogicBug: false,
        userFlagged: true,
        reasonCorrect: false,
        status: 'FALSE_POSITIVE',
        explanation: node.expectedBugReason,
      };
    }

    return {
      stepNumber: node.stepNumber,
      title: node.title,
      hasLogicBug: false,
      userFlagged: false,
      reasonCorrect: false,
      status: 'CLEAN_OK',
      explanation: node.expectedBugReason,
    };
  });

  const flowBugsCaught = flowBugsCaughtExact + flowBugsCaughtPartial;
  const releaseDecisionCorrect = submission.releaseDecision === 'BLOCK_RELEASE';
  const reportQualityScore = scoreQaReportNote(submission.bugReportNote, releaseDecisionCorrect);

  // 3. AI Auto-QA Trap Evaluation
  let aiTrapVerdict: AiTrapVerdict = 'NOT_TRIGGERED';
  if (submission.aiTriggered) {
    const fellForApprove = submission.releaseDecision === 'APPROVE_RELEASE';
    const leftAiFalsePositive = Boolean(userOrders['ORD-07']) && !userNodes['NODE_5'];
    if (fellForApprove || (leftAiFalsePositive && !submission.aiExplicitlyRejected)) {
      aiTrapVerdict = 'TRIGGERED_AND_ACCEPTED';
    } else {
      aiTrapVerdict = 'TRIGGERED_AND_REJECTED';
    }
  }

  // 4. Big Five Scoring (Conscientiousness 45%, Openness 35%, Emotional Stability 20%)
  const dataRecallRatio = (dataBugsCaughtExact + 0.5 * dataBugsWrongCategory) / totalExpectedDataBugs;
  let conscientiousness =
    dataRecallRatio * 95 - dataFalsePositives * 12 + (releaseDecisionCorrect ? 5 : -15);
  if (aiTrapVerdict === 'TRIGGERED_AND_ACCEPTED') conscientiousness -= 18;
  conscientiousness = clamp(conscientiousness, 15, 100);

  const flowScoreRatio =
    (flowBugsCaughtExact + 0.5 * flowBugsCaughtPartial) / totalExpectedFlowBugs;
  let openness = flowScoreRatio * 75 - flowFalsePositives * 12 + reportQualityScore * 0.15;
  if (aiTrapVerdict === 'TRIGGERED_AND_REJECTED') {
    openness += 18;
  } else if (aiTrapVerdict === 'NOT_TRIGGERED') {
    openness += 10;
  } else {
    openness -= 28;
  }
  openness = clamp(openness, 15, 100);

  let emotionalStability = releaseDecisionCorrect ? 85 : 42;
  if (submission.tabSwitchCount >= 1) emotionalStability += 10;
  emotionalStability -= Math.min(20, submission.panicClicksCount * 4);
  if (dataFalsePositives >= 3) emotionalStability -= 15; // spamming flags under time pressure
  emotionalStability = clamp(emotionalStability, 15, 100);

  const composite = clamp(
    0.45 * conscientiousness + 0.35 * openness + 0.20 * emotionalStability,
    15,
    100
  );

  // 5. RIASEC anchored on Investigative (50%) - Conventional (35%) - Realistic (15%)
  const investigative = clamp(40 + ((openness + conscientiousness) / 200) * 56, 20, 99);
  const conventional = clamp(36 + (conscientiousness / 100) * 52, 20, 95);
  const realistic = clamp(32 + (composite / 100) * 44, 20, 88);
  const enterprising = clamp(28 + (emotionalStability / 100) * 40, 20, 82);
  const social = clamp(26 + (reportQualityScore / 100) * 32, 18, 74);
  const artistic = clamp(24 + (openness / 100) * 28, 15, 68);

  const riasecPairs = [
    { code: 'I', val: investigative },
    { code: 'C', val: conventional },
    { code: 'R', val: realistic },
    { code: 'E', val: enterprising },
    { code: 'S', val: social },
    { code: 'A', val: artistic },
  ].sort((a, b) => b.val - a.val);
  const top_code = `${riasecPairs[0].code}-${riasecPairs[1].code}-${riasecPairs[2].code}`;

  // 6. Detailed Criteria Breakdown
  const criteria: MissionCriterionAudit[] = [
    {
      id: 'QA_DATA_GRID',
      label: 'Săn lỗi Bảng 15 Đơn hàng (Data Cleaning)',
      status:
        dataBugsCaughtExact >= 7 && dataFalsePositives <= 1
          ? 'PASS'
          : dataBugsCaughtExact >= 4
            ? 'PARTIAL'
            : 'FAIL',
      summary: `Bắt chính xác ${dataBugsCaughtExact}/${totalExpectedDataBugs} lỗi dữ liệu (${dataBugsWrongCategory} lệch thẻ loại, ${dataFalsePositives} báo nhầm đơn sạch).`,
      detail:
        dataBugsCaughtExact === totalExpectedDataBugs && dataFalsePositives === 0
          ? 'Hoàn hảo! Bạn đã bắt trọn cả những lỗi kín như ngày 30/02/2026, sai phép tính 3×120k ≠ 240k và 2 cặp đơn trùng lặp cách xa nhau.'
          : 'Các lỗi tinh vi thường dễ bị bỏ sót gồm ngày 30/02/2026 (DH-1102), phép tính thành tiền sai (DH-1108) và 2 cặp đơn trùng khách cách dòng (DH-1105/1110 và DH-1112/1114).',
    },
    {
      id: 'QA_LOGIC_FLOW',
      label: 'Kiểm thử Sơ đồ Luồng Thanh toán Tiếng Việt (0 dòng code)',
      status:
        flowBugsCaughtExact === 2 && flowFalsePositives === 0
          ? 'PASS'
          : flowBugsCaught >= 1
            ? 'PARTIAL'
            : 'FAIL',
      summary: `Phát hiện ${flowBugsCaughtExact}/${totalExpectedFlowBugs} lỗ hổng logic cốt lõi (${flowFalsePositives} đánh dấu nhầm bước sạch).`,
      detail:
        flowBugsCaughtExact === 2
          ? 'Tư duy hệ thống cực sắc bén! Bạn đã khoanh vùng chuẩn cả lỗi âm tiền khi áp mã GIAM100K (Bước 3) lẫn lỗi trừ tiền ví trước khi kiểm tra tồn kho mà không có bước hoàn tiền (Bước 5).'
          : 'Hai lỗ hổng sống còn nằm ở Bước 3 (đơn 60k trừ mã 100k bị âm -40k) và Bước 5 (trừ ví trước khi kiểm kho và thiếu nhánh hoàn tiền khi hết hàng).',
    },
    {
      id: 'QA_RELEASE_GATE',
      label: 'Quyết định Release 20:00 & Cạm bẫy AI Auto-QA',
      status:
        releaseDecisionCorrect && aiTrapVerdict !== 'TRIGGERED_AND_ACCEPTED'
          ? 'PASS'
          : 'FAIL',
      summary:
        releaseDecisionCorrect && aiTrapVerdict === 'TRIGGERED_AND_REJECTED'
          ? 'Bản lĩnh QA chuẩn mực: Bác bỏ kết luận "an toàn" của AI Auto-QA và CHẶN RELEASE kịp thời.'
          : releaseDecisionCorrect
            ? 'Quyết định đúng đắn: Đã CHẶN RELEASE trước 20:00 để bảo vệ khách hàng và doanh thu.'
            : submission.releaseDecision === null
              ? 'Hết giờ khi chưa chốt quyết định Release (cần chủ động CHẶN RELEASE trước 20:00).'
              : 'Nguy hiểm! Đã chọn DUYỆT RELEASE khi hệ thống còn lỗ hổng âm tiền & trừ ví không hoàn tiền.',
      detail:
        aiTrapVerdict === 'TRIGGERED_AND_ACCEPTED'
          ? 'AI Auto-QA đã bỏ sót 4 lỗi dữ liệu kín, gắn nhầm đơn sạch DH-1107 và bỏ qua hoàn toàn lỗ hổng trừ ví ở Bước 5 nhưng vẫn giục duyệt Release.'
          : 'Vai trò quan trọng nhất của người làm QA là dám nói "KHÔNG" (Block Release) kèm bằng chứng cụ thể trước áp lực giờ G.',
    },
  ];

  // 7. Qualitative Insights
  const qualitativeInsights: string[] = [];
  if (conscientiousness >= 80) {
    qualitativeInsights.push(
      'Độ tỉ mỉ và kỷ luật dữ liệu rất cao: Phát hiện sắc bén các sai lệch ngày tháng, phép tính và đơn trùng lặp nằm rải rác trên bảng 15 đơn hàng.'
    );
  } else {
    qualitativeInsights.push(
      'Cần rèn thêm thói quen quét theo từng cột dữ liệu (soát riêng cột Ngày, cột Thành tiền, cột SĐT) để không bỏ lọt lỗi kín và tránh gắn nhầm đơn sạch.'
    );
  }

  if (openness >= 80) {
    qualitativeInsights.push(
      'Tư duy logic hệ thống vượt trội dù không cần viết code: Đọc hiểu luồng nghiệp vụ tiếng Việt và nhìn thấu ngay kịch bản biên (edge cases) gây thất thoát tiền.'
    );
  } else {
    qualitativeInsights.push(
      'Hãy tập đặt câu hỏi "Điều gì xấu nhất xảy ra nếu..." ở mỗi bước trong sơ đồ quy trình (VD: đơn nhỏ hơn mã giảm giá, hoặc kho hết hàng sau khi trừ tiền).'
    );
  }

  if (aiTrapVerdict === 'TRIGGERED_AND_REJECTED') {
    qualitativeInsights.push(
      'Tư duy phản biện công cụ tự động xuất sắc: Không tin vào báo cáo "100% an toàn" của AI Auto-QA mà tự đối chiếu tìm ra lỗi bỏ sót và đơn bị báo oan.'
    );
  } else if (aiTrapVerdict === 'TRIGGERED_AND_ACCEPTED') {
    qualitativeInsights.push(
      'Cẩn trọng với sự lệ thuộc vào AI quét lỗi tự động — công cụ AI thường bỏ sót lỗi logic nghiệp vụ và tạo báo động giả (false positive).'
    );
  } else {
    qualitativeInsights.push(
      releaseDecisionCorrect
        ? 'Giữ vững nguyên tắc chất lượng dưới áp lực sát giờ G 20:00 — kiên quyết chặn bản phát hành lỗi thay vì thỏa hiệp.'
        : 'Cần kiên quyết hơn trong quyết định chặn phát hành (Block Release) khi hệ thống còn lỗi ảnh hưởng trực tiếp tới tiền của khách.'
    );
  }

  return {
    missionId: 'IND_QA_DATA',
    orderAudits,
    flowAudits,
    totalExpectedDataBugs,
    dataBugsCaughtExact,
    dataBugsWrongCategory,
    dataFalsePositives,
    totalExpectedFlowBugs,
    flowBugsCaught,
    flowFalsePositives,
    releaseDecision: submission.releaseDecision,
    releaseDecisionCorrect,
    bugReportNote: submission.bugReportNote,
    tabSwitchCount: submission.tabSwitchCount,
    reportQualityScore,
    aiTrapVerdict,
    scores: {
      conscientiousness,
      openness,
      emotional_stability: emotionalStability,
      composite,
    },
    riasec: {
      investigative,
      conventional,
      realistic,
      enterprising,
      social,
      artistic,
      top_code,
    },
    criteria,
    qualitativeInsights,
  };
}
