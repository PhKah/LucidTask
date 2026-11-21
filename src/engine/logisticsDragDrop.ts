import {
  CargoLotId,
  LogisticsAllocationMatrix,
  LogisticsScenario,
  ResourceSlotId,
} from '../types/mission';
import { computeLogisticsPassiveTotals } from './MissionEvaluators';

/**
 * Optional Game Design Phase 1 helpers. The existing mission evaluator is
 * intentionally unchanged: these checks run only on player request.
 */
export interface AllocationCheckMessage {
  id: string;
  type: 'error' | 'success' | 'info';
  text: string;
  // Phase 2: metadata only for context-sensitive visual feedback.
  title?: string;
  suggestion?: string;
  lotId?: CargoLotId;
  resourceId?: ResourceSlotId;
}

export interface TransferPreview {
  allowedTons: number;
  remainingTons: number;
  reason: string | null;
}

export function previewCargoTransfer(
  matrix: LogisticsAllocationMatrix,
  scenario: LogisticsScenario,
  lotId: CargoLotId,
  requestedTons: number | 'REMAINING'
): TransferPreview {
  const lot = scenario.lots.find(item => item.id === lotId);
  if (!lot) return { allowedTons: 0, remainingTons: 0, reason: 'Không tìm thấy lô hàng.' };

  const totals = computeLogisticsPassiveTotals(matrix);
  const remainingTons = Math.max(0, lot.totalTons - totals.perLotAllocated[lotId]);
  if (remainingTons === 0) {
    return { allowedTons: 0, remainingTons, reason: `${lot.code} đã được phân bổ hết.` };
  }
  const requested = requestedTons === 'REMAINING' ? remainingTons : requestedTons;
  if (!Number.isInteger(requested) || requested <= 0) {
    return { allowedTons: 0, remainingTons, reason: 'Số tấn phải là số nguyên dương.' };
  }
  return {
    allowedTons: Math.min(requested, remainingTons),
    remainingTons,
    reason: requested > remainingTons ? `Chỉ còn ${remainingTons} tấn; đã giới hạn số tấn được xếp.` : null,
  };
}

export function checkLogisticsPlan(
  matrix: LogisticsAllocationMatrix,
  scenario: LogisticsScenario
): AllocationCheckMessage[] {
  const totals = computeLogisticsPassiveTotals(matrix);
  const messages: AllocationCheckMessage[] = [];

  for (const lot of scenario.lots) {
    const assigned = totals.perLotAllocated[lot.id];
    if (assigned !== lot.totalTons) {
      messages.push({
        id: `lot-${lot.id}`,
        type: 'error',
        title: `Số lượng ${lot.code} chưa khớp`,
        lotId: lot.id,
        text: `${lot.code}: đã xếp ${assigned}/${lot.totalTons} tấn. Cần phân bổ đủ, không thiếu hoặc thừa.`,
        suggestion: assigned < lot.totalTons
          ? `Còn ${lot.totalTons - assigned} tấn cần xếp. Chọn một điểm đến phù hợp và kiểm tra sức chứa.`
          : `Hãy lấy lại ${assigned - lot.totalTons} tấn khỏi các vị trí đã xếp.`,
      });
    }
  }

  for (const resource of scenario.resources) {
    const assigned = totals.perResourceAllocated[resource.id];
    if (resource.maxCapacityTons !== null && assigned > resource.maxCapacityTons) {
      messages.push({
        id: `capacity-${resource.id}`,
        type: 'error',
        title: `${resource.shortLabel} vượt tải`,
        resourceId: resource.id,
        text: `${resource.shortLabel}: đang xếp ${assigned}/${resource.maxCapacityTons} tấn (vượt ${assigned - resource.maxCapacityTons} tấn).`,
        suggestion: `Rút bớt ít nhất ${assigned - resource.maxCapacityTons} tấn và phân bổ lại; không được xem mức vượt tải là hợp lệ.`,
      });
    }
  }

  // Exactly the cold-chain hazards checked by the existing MissionEvaluator.
  if (matrix.LOT_B.COLD_STORAGE_HP > 0) {
    messages.push({
      id: 'temp-b-cold',
      type: 'error',
      title: 'Nhiệt độ kho không phù hợp',
      lotId: 'LOT_B',
      resourceId: 'COLD_STORAGE_HP',
      text: `${matrix.LOT_B.COLD_STORAGE_HP} tấn trái cây Lô #B không thể bảo quản trong kho lạnh âm độ.`,
      suggestion: 'Lô #B cần nhiệt độ mát +4°C đến +8°C, kho HP là -18°C đến 0°C. Chuyển hàng sang phương tiện tương thích, sau đó kiểm tra lại tải trọng.',
    });
  }
  if (matrix.LOT_B.NEXT_DAY_PORT > 0) {
    messages.push({
      id: 'temp-b-port',
      type: 'error',
      title: 'Trái cây không thể chờ qua đêm',
      lotId: 'LOT_B',
      resourceId: 'NEXT_DAY_PORT',
      text: `${matrix.LOT_B.NEXT_DAY_PORT} tấn trái cây Lô #B sẽ hỏng nếu để ngoài bãi 13 giờ.`,
      suggestion: 'Lô #B chịu được tối đa 12 giờ ngoài bãi. Cân nhắc vận chuyển sớm bằng xe có nhiệt độ thích hợp.',
    });
  }
  if (matrix.LOT_C.NEXT_DAY_PORT > 0) {
    messages.push({
      id: 'temp-c-port',
      type: 'error',
      title: 'Thủy sản cấp đông có nguy cơ rã đông',
      lotId: 'LOT_C',
      resourceId: 'NEXT_DAY_PORT',
      text: `${matrix.LOT_C.NEXT_DAY_PORT} tấn hàng cấp đông Lô #C sẽ rã đông nếu để ngoài bãi qua đêm.`,
      suggestion: 'Lô #C cần duy trì -18°C. Hãy cân nhắc kho lạnh HP hoặc phương tiện đáp ứng nhiệt độ và sức chứa.',
    });
  }

  if (messages.length === 0) {
    messages.push({
      id: 'ok',
      type: 'success',
      title: 'Các ràng buộc cơ bản đã đạt',
      text: 'Các lượng hàng, giới hạn tải và rủi ro bảo quản cơ bản đã được kiểm tra. Vẫn cần tự cân nhắc chi phí, SLA và bản giải trình trước khi chốt lệnh.',
    });
  }
  return messages;
}
