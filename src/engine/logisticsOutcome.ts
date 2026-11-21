import { LogisticsEvaluationResult } from '../types/mission';
import { LOGISTICS_COLDCHAIN_SCENARIO } from '../registry/logistics_coldchain/scenario';

export type DamageTier = 'optimal' | 'needs-improvement' | 'unsafe';

/** Status of the *submitted plan*, not the user's personality or aptitude. */
export function getLogisticsDamageTier(ev: LogisticsEvaluationResult): DamageTier {
  const lotsTotal = LOGISTICS_COLDCHAIN_SCENARIO.lots.reduce((sum, lot) => sum + lot.totalTons, 0);
  const safe = ev.totalAllocatedTons === lotsTotal &&
    ev.overloadViolationsCount === 0 && ev.temperatureViolations.length === 0;
  if (!safe) return 'unsafe';
  return ev.totalFinancialDamageVnd <= ev.optimalDamageVnd ? 'optimal' : 'needs-improvement';
}

export interface DamageComparison {
  differenceVnd: number;
  percentAboveOptimal: number;
  description: string;
  actionable?: string;
}

export function getLogisticsDamageComparison(ev: LogisticsEvaluationResult): DamageComparison {
  const differenceVnd = Math.max(0, ev.totalFinancialDamageVnd - ev.optimalDamageVnd);
  const percentAboveOptimal = ev.optimalDamageVnd > 0 ? Math.round(differenceVnd / ev.optimalDamageVnd * 100) : 0;
  const base: DamageComparison = {
    differenceVnd,
    percentAboveOptimal,
    description: getLogisticsDamageTier(ev) === 'unsafe'
      ? `Phương án đang vi phạm ràng buộc; số thiệt hại ${new Intl.NumberFormat('vi-VN').format(ev.totalFinancialDamageVnd)}đ chỉ là kết quả phép tính, chưa phải phương án có thể thực hiện.`
      : ev.totalFinancialDamageVnd < ev.optimalDamageVnd
        ? 'Số liệu thấp hơn mốc tối ưu tham chiếu; hãy kiểm tra lại các ràng buộc trước khi kết luận.'
        : differenceVnd === 0
          ? 'Thiệt hại bằng mức tham chiếu tối ưu của kịch bản.'
          : `Thiệt hại cao hơn mức tham chiếu ${new Intl.NumberFormat('vi-VN').format(differenceVnd)}đ (${percentAboveOptimal}%).`,
  };

  // Explain a concrete improvement only when we can demonstrate it from
  // final allocations; don't claim that every suboptimal plan has the same cause.
  if (getLogisticsDamageTier(ev) !== 'needs-improvement' || ev.spoilageDamageVnd !== 0) {
    return base;
  }

  const scenario = LOGISTICS_COLDCHAIN_SCENARIO;
  const rate = scenario.lots.find(lot => lot.id === 'LOT_A')?.slaPenaltyPerTonPerHourVnd ?? 0;
  const lateHours = 12; // 18:00 -> 06:00, according to scenario briefing
  const referenceLateTons = rate > 0 ? scenario.optimalDamageVnd / (rate * lateHours) : 0;
  const movableTons = Math.max(0, ev.lotAOvernightTons - referenceLateTons);
  const freeVehicle = ev.vehicleAudits.find(row =>
    ['TRUCK_20FT', 'VAN_1', 'VAN_2', 'VAN_3'].includes(row.resourceId) &&
    row.maxCapacityTons !== null && row.assignedTons < row.maxCapacityTons
  );

  if (!freeVehicle || freeVehicle.maxCapacityTons === null || movableTons < 1) return base;
  const transferable = Math.min(movableTons, freeVehicle.maxCapacityTons - freeVehicle.assignedTons);
  if (transferable <= 0) return base;
  const savingVnd = transferable * lateHours * rate;
  return {
    ...base,
    actionable: `${freeVehicle.resourceName} còn trống ${freeVehicle.maxCapacityTons - freeVehicle.assignedTons} tấn. Nếu chuyển ${transferable} tấn Lô #A đang chờ qua đêm lên xe này, tiền phạt SLA có thể giảm ${new Intl.NumberFormat('vi-VN').format(savingVnd)}đ (theo quy tắc kịch bản).`,
  };
}
