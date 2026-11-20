import React, { useMemo, useRef, useState } from 'react';
import {
  Bot,
  Clock,
  RotateCcw,
  Send,
  Snowflake,
  Truck,
  Undo2,
  Package,
  Calculator,
  FileText,
} from 'lucide-react';
import {
  CargoLotId,
  LogisticsAllocationMatrix,
  LogisticsScenario,
  LogisticsSubmission,
  ResourceSlotId,
} from '../../types/mission';
import { createEmptyLogisticsAllocation } from '../../registry/logistics_coldchain/scenario';
import { computeLogisticsPassiveTotals } from '../../engine/MissionEvaluators';
import { telemetryBus } from '../../engine/TelemetryBus';
import CountdownTimer from '../CountdownTimer';

interface LogisticsDispatchBoardProps {
  scenario: LogisticsScenario;
  onSubmit: (submission: LogisticsSubmission) => void;
}

const cloneAllocation = (matrix: LogisticsAllocationMatrix): LogisticsAllocationMatrix => ({
  LOT_A: { ...matrix.LOT_A },
  LOT_B: { ...matrix.LOT_B },
  LOT_C: { ...matrix.LOT_C },
});

const formatVnd = (amount: number): string =>
  `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;

export const LogisticsDispatchBoard: React.FC<LogisticsDispatchBoardProps> = ({
  scenario,
  onSubmit,
}) => {
  const [allocation, setAllocation] = useState<LogisticsAllocationMatrix>(() =>
    createEmptyLogisticsAllocation()
  );
  const [estimatedDamageInput, setEstimatedDamageInput] = useState<string>('');
  const [contingencyPlanText, setContingencyPlanText] = useState<string>('');

  // AI Co-pilot Trap state (Hạng mục 4/4)
  const [aiTriggered, setAiTriggered] = useState<boolean>(false);
  const [aiBannerVisible, setAiBannerVisible] = useState<boolean>(false);
  const [aiExplicitlyRejected, setAiExplicitlyRejected] = useState<boolean>(false);
  const preAiSnapshotRef = useRef<LogisticsAllocationMatrix>(createEmptyLogisticsAllocation());

  // Telemetry refs
  const startTimeRef = useRef<number>(Date.now());
  const editCountRef = useRef<number>(0);
  const clickTimestampsRef = useRef<number[]>([]);
  const panicClicksRef = useRef<number>(0);

  const passiveTotals = useMemo(() => computeLogisticsPassiveTotals(allocation), [allocation]);

  const recordClickRate = () => {
    const now = Date.now();
    clickTimestampsRef.current = clickTimestampsRef.current.filter(ts => now - ts < 1000);
    clickTimestampsRef.current.push(now);
    if (clickTimestampsRef.current.length > 6) {
      panicClicksRef.current += 1;
      telemetryBus.publish('panic_click_flag', {
        click_rate_per_sec: clickTimestampsRef.current.length,
        area: 'logistics_dispatch_matrix',
      });
    }
  };

  // CRITICAL INVARIANT (Hạng mục 3/4): Do NOT cap at vehicle max capacity (15t / 5t)!
  const updateCell = (
    lotId: CargoLotId,
    resourceId: ResourceSlotId,
    rawValue: number,
    isButtonClick = false
  ) => {
    if (isButtonClick) {
      recordClickRate();
    }
    const safeTons = Math.max(0, Math.min(42, Math.floor(Number.isNaN(rawValue) ? 0 : rawValue)));
    editCountRef.current += 1;

    setAllocation(prev => ({
      ...prev,
      [lotId]: {
        ...prev[lotId],
        [resourceId]: safeTons,
      },
    }));

    telemetryBus.publish('allocation_updated', {
      lot_id: lotId,
      resource_id: resourceId,
      tons: safeTons,
    });
  };

  const handleTriggerAiCopilot = () => {
    preAiSnapshotRef.current = cloneAllocation(allocation);
    setAllocation(cloneAllocation(scenario.aiCopilotTrapAllocation));
    setAiTriggered(true);
    setAiBannerVisible(true);
    setAiExplicitlyRejected(false);

    telemetryBus.publish('ai_copilot_triggered', {
      mission_id: 'IND_LOG_COLDCHAIN',
    });
  };

  const handleRejectAiCopilot = () => {
    setAllocation(cloneAllocation(preAiSnapshotRef.current));
    setAiBannerVisible(false);
    setAiExplicitlyRejected(true);

    telemetryBus.publish('ai_copilot_overridden', {
      mission_id: 'IND_LOG_COLDCHAIN',
      method: 'EXPLICIT_BUTTON',
    });
  };

  const handleResetBoard = () => {
    setAllocation(createEmptyLogisticsAllocation());
    setAiBannerVisible(false);
  };

  const handleFinalizeSubmit = () => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const parsedEstimate =
      estimatedDamageInput.trim() === '' ? null : Number(estimatedDamageInput.trim());

    onSubmit({
      allocation: cloneAllocation(allocation),
      estimatedDamageMillionVnd:
        parsedEstimate !== null && !Number.isNaN(parsedEstimate) ? parsedEstimate : null,
      contingencyPlanText: contingencyPlanText.trim(),
      aiTriggered,
      aiExplicitlyRejected,
      elapsedSeconds,
      editCount: editCountRef.current,
      panicClicksCount: panicClicksRef.current,
    });
  };

  const allLotsBalanced =
    passiveTotals.perLotAllocated.LOT_A === 18 &&
    passiveTotals.perLotAllocated.LOT_B === 14 &&
    passiveTotals.perLotAllocated.LOT_C === 10;

  const canSubmit = allLotsBalanced && contingencyPlanText.trim().length >= 15;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Command Status Bar */}
      <div className="bg-night-navy text-white border-2 border-black px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="bg-accent text-black font-black px-2.5 py-1 uppercase tracking-wider">
            BẢNG ĐIỀU PHỐI CHUỖI LẠNH • CẢNG HẢI PHÒNG → HÀ NỘI
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-gray-200">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span>HIỆN TẠI: <strong>{scenario.currentClock}</strong></span>
          </span>
          <span className="hidden md:inline text-gray-500">|</span>
          <span className="font-mono text-gray-300 text-[11px]">
            CHUYẾN TĂNG CƯỜNG: <strong className="text-white">{scenario.nextConvoySchedule}</strong>
          </span>
        </div>

        <CountdownTimer
          initialSeconds={scenario.durationMinutes * 60}
          isRunning={true}
          onTimeUp={handleFinalizeSubmit}
        />
      </div>

      {/* 3-COLUMN INTERACTIVE DISPATCH BOARD */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* ============================================================
         * CỘT TRÁI: DỮ LIỆU LÔ HÀNG & ĐỊNH MỨC VẬN TẢI (00:00)
         * ============================================================ */}
        <aside className="xl:col-span-3 space-y-4">
          {/* Thẻ 1: 3 Lô hàng kẹt cảng */}
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 space-y-3">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-black">
                <Package className="w-4 h-4 text-accent" />
                <span>Thẻ 1: 3 Lô Hàng Kẹt Cảng</span>
              </div>
              <span className="font-mono text-[11px] font-black bg-black text-white px-2 py-0.5">
                TỔNG 42 TẤN
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {scenario.lots.map(lot => (
                <div
                  key={lot.id}
                  className="p-3 bg-soft-gray border border-black space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black text-black uppercase">
                      {lot.code} • {lot.name}
                    </span>
                    <span className="font-mono font-black bg-accent text-black px-1.5 py-0.5 border border-black flex-shrink-0">
                      {lot.totalTons} tấn
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-[11px] text-neutral-800">
                    <div>
                      <strong>Nhiệt độ:</strong> {lot.tempRequirementLabel}
                    </div>
                    <div>
                      <strong>Hạn sử dụng:</strong> {lot.shelfLifeLabel}
                    </div>
                    <div>
                      <strong>Mốc giao / SLA:</strong> {lot.deadlineLabel}
                    </div>
                    <div>
                      <strong>Giá trị lô:</strong> {formatVnd(lot.totalValueVnd)} (
                      {lot.valuePerTonVnd / 1_000_000}tr/tấn)
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-gray border-t border-hairline pt-1.5 leading-snug">
                    {lot.spoilageRiskNote}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Thẻ 2: Nguồn lực Phương tiện & Kho bãi */}
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-black border-b-2 border-black pb-2">
              <Truck className="w-4 h-4 text-accent" />
              <span>Thẻ 2: Định Mức Xe &amp; Kho Bãi</span>
            </div>

            <div className="space-y-2.5 text-[11px] text-neutral-800">
              <div className="p-2.5 bg-soft-gray border border-hairline">
                <div className="font-black text-black">Xe tải lạnh hạng nặng (20ft) — 1 xe</div>
                <div>• Tải trọng tối đa: <strong>15 tấn/xe</strong></div>
                <div>• Lịch chạy: 15:00 → Hà Nội 17:30</div>
                <div>• Chi phí: <strong>6.000.000đ/chuyến</strong></div>
              </div>

              <div className="p-2.5 bg-soft-gray border border-hairline">
                <div className="font-black text-black">Xe tải van lạnh hạng trung — 3 xe</div>
                <div>• Tải trọng tối đa: <strong>5 tấn/xe</strong> (Tổng 3 xe: 15 tấn)</div>
                <div>• Lịch chạy: 15:00 → Hà Nội 18:00</div>
                <div>• Chi phí: <strong>3.500.000đ/chuyến/xe</strong></div>
              </div>

              <div className="p-2.5 bg-soft-gray border border-hairline">
                <div className="font-black text-black flex items-center gap-1">
                  <Snowflake className="w-3.5 h-3.5 text-sky-700" />
                  <span>Kho lạnh trung chuyển Hải Phòng</span>
                </div>
                <div>• Sức chứa trống: <strong>15 tấn</strong></div>
                <div>• Dải nhiệt cố định: <strong>-18°C đến 0°C</strong></div>
                <div>• Lưu kho: <strong>1.500.000đ/tấn/ngày</strong> (chờ chuyến 03:30)</div>
              </div>

              <div className="p-2.5 bg-soft-gray border border-hairline">
                <div className="font-black text-black">Chuyến tăng cường sáng mai (03:30)</div>
                <div>• Xuất bến 03:30 → cập bến Hà Nội <strong>06:00 sáng mai</strong></div>
                <div>• Thời gian trễ so với mốc 18:00: <strong>12 giờ</strong></div>
                <div>• Thời gian lưu bãi từ 14:30 → 03:30: <strong>13 giờ</strong></div>
              </div>
            </div>
          </div>
        </aside>

        {/* ============================================================
         * CỘT GIỮA: BẢNG ĐIỀU PHỐI PHÂN BỔ (ALLOCATION MATRIX) + AI + GIẢI TRÌNH
         * ============================================================ */}
        <section className="xl:col-span-6 space-y-5">
          {/* Matrix Card */}
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 sm:p-5 space-y-4">
            {/* Toolbar with AI Co-pilot Trigger (Hạng mục 4/4) */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-black">
              <div>
                <h2 className="text-sm font-black uppercase text-black">
                  Bảng Điều Phối Phân Bổ Tài Nguyên (Đơn vị: Tấn)
                </h2>
                <p className="text-[11px] text-muted-gray">
                  Nhập trực tiếp số tấn của từng lô hàng vào đội xe chiều nay (15:00) hoặc giữ lại qua đêm chờ chuyến 03:30.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleTriggerAiCopilot}
                  className="inline-flex items-center gap-1.5 bg-night-navy hover:bg-black text-white text-xs font-bold px-3 py-1.5 border border-black transition-colors"
                >
                  <Bot className="w-3.5 h-3.5 text-accent" />
                  <span>AI Co-pilot: Tối ưu lịch trình</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetBoard}
                  className="inline-flex items-center gap-1 bg-white hover:bg-soft-gray text-black text-xs font-bold px-2.5 py-1.5 border border-black transition-colors"
                  title="Đặt lại toàn bộ về 0 tấn"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đặt lại</span>
                </button>
              </div>
            </div>

            {/* AI Co-pilot Active Banner (Hạng mục 4/4) */}
            {aiBannerVisible && (
              <div
                data-testid="ai-copilot-banner"
                className="bg-indigo-50 border-2 border-night-navy p-3.5 space-y-2.5 animate-fadeIn"
              >
                <div className="flex items-start gap-2.5">
                  <Bot className="w-5 h-5 text-night-navy flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-neutral-900 leading-relaxed">
                    <div className="font-black uppercase text-night-navy mb-0.5">
                      AI Co-pilot Đã Tự Động Điền Lịch Trình Cứu Hàng:
                    </div>
                    <p>{scenario.aiCopilotMessage}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleRejectAiCopilot}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-100 text-black text-xs font-black px-3 py-1.5 border-2 border-black"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Bác bỏ &amp; Khôi phục cấu hình an toàn</span>
                  </button>
                </div>
              </div>
            )}

            {aiExplicitlyRejected && !aiBannerVisible && (
              <div className="bg-soft-gray border border-black px-3 py-2 text-[11px] font-bold text-neutral-800 flex items-center justify-between">
                <span>Đã bác bỏ đề xuất AI Co-pilot và khôi phục cấu hình thủ công của bạn.</span>
              </div>
            )}

            {/* Allocation Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-soft-gray border-y-2 border-black text-[11px] font-black uppercase text-black">
                    <th className="py-2.5 px-2 text-left min-w-[125px]">Lô hàng</th>
                    {scenario.resources.map(res => (
                      <th key={res.id} className="py-2.5 px-1.5 text-center min-w-[78px]">
                        <div>{res.shortLabel}</div>
                        <div className="text-[10px] font-normal text-muted-gray normal-case">
                          {res.category === 'AFTERNOON_VEHICLE'
                            ? '15:00'
                            : res.category === 'COLD_STORAGE'
                              ? '-18°C→0°C'
                              : '03:30'}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {scenario.lots.map(lot => {
                    const allocatedForLot = passiveTotals.perLotAllocated[lot.id];
                    const remainingForLot = lot.totalTons - allocatedForLot;

                    return (
                      <tr key={lot.id} className="hover:bg-neutral-50/70">
                        <td className="py-3 px-2 align-top">
                          <div className="font-black text-black">{lot.code}</div>
                          <div className="text-[11px] text-neutral-700 leading-tight">
                            {lot.name}
                          </div>
                          <div className="mt-1 font-mono text-[10px] text-muted-gray">
                            Đã xếp: <strong>{allocatedForLot}</strong>/{lot.totalTons}t
                            {remainingForLot !== 0 && (
                              <span className="ml-1">
                                ({remainingForLot > 0 ? `còn ${remainingForLot}t` : `dư ${Math.abs(remainingForLot)}t`})
                              </span>
                            )}
                          </div>
                        </td>

                        {scenario.resources.map(res => {
                          const val = allocation[lot.id][res.id];
                          return (
                            <td key={res.id} className="py-3 px-1 text-center align-middle">
                              <div className="inline-flex items-center border border-black bg-white">
                                <button
                                  type="button"
                                  aria-label={`Giảm ${lot.code} tại ${res.shortLabel}`}
                                  onClick={() => updateCell(lot.id, res.id, val - 1, true)}
                                  className="px-1.5 py-1 text-xs font-black hover:bg-soft-gray border-r border-hairline"
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  min={0}
                                  inputMode="numeric"
                                  aria-label={`${lot.code} - ${res.shortLabel}`}
                                  value={val}
                                  onChange={e => updateCell(lot.id, res.id, Number(e.target.value), false)}
                                  className="w-9 py-1 text-center font-mono text-xs font-bold focus:outline-none focus:bg-amber-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button
                                  type="button"
                                  aria-label={`Tăng ${lot.code} tại ${res.shortLabel}`}
                                  onClick={() => updateCell(lot.id, res.id, val + 1, true)}
                                  className="px-1.5 py-1 text-xs font-black hover:bg-soft-gray border-l border-hairline"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contingency Dispatch Plan (Bản Giải Trình Khẩn Cấp) */}
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-black pb-2">
              <FileText className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-black uppercase text-black">
                Bản Giải Trình Phương Án Đánh Đổi Khẩn Cấp (Gửi Giám Đốc Vận Hành)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label
                  htmlFor="estimated-damage-input"
                  className="block text-xs font-bold text-black mb-1"
                >
                  Thiệt hại tài chính dự kiến (SLA + Hỏng hàng) theo phép tính của bạn:
                </label>
                <div className="flex items-center border-2 border-black bg-white">
                  <input
                    id="estimated-damage-input"
                    type="number"
                    min={0}
                    placeholder="VD: 72"
                    value={estimatedDamageInput}
                    onChange={e => setEstimatedDamageInput(e.target.value)}
                    className="w-full px-3 py-2 font-mono text-sm font-bold focus:outline-none focus:bg-amber-50"
                  />
                  <span className="px-3 py-2 bg-soft-gray border-l border-black text-xs font-mono font-bold text-muted-gray flex-shrink-0">
                    triệu VNĐ
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-muted-gray leading-snug bg-soft-gray p-2.5 border border-hairline">
                Gợi ý tự tính: Đối chiếu phạt trễ 12 giờ (18:00 → 06:00) so với tổn thất hỏng hàng nếu giữ lại lô tươi sống qua đêm.
              </div>
            </div>

            <div>
              <label
                htmlFor="contingency-plan-textarea"
                className="block text-xs font-bold text-black mb-1"
              >
                Lý do chọn phương án đánh đổi &amp; phép tính chi tiết (tối thiểu 15 ký tự):
              </label>
              <textarea
                id="contingency-plan-textarea"
                rows={4}
                placeholder="Trình bày ngắn gọn gửi Giám đốc Vận hành: Bạn ưu tiên cứu lô hàng nào chiều nay, giữ lại lô nào chờ chuyến 03:30, tổng thiệt hại tính được là bao nhiêu triệu VNĐ và lưu ý tải trọng/nhiệt độ..."
                value={contingencyPlanText}
                onChange={e => {
                  setContingencyPlanText(e.target.value);
                  telemetryBus.publish('plan_note_updated', {
                    char_count: e.target.value.length,
                  });
                }}
                className="w-full border-2 border-black p-3 text-xs leading-relaxed focus:outline-none focus:bg-amber-50/40"
              />
            </div>

            {/* Submit Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-hairline">
              <div className="text-[11px] text-muted-gray">
                {!allLotsBalanced ? (
                  <span>
                    Cần phân bổ khớp đủ từng lô (<strong>#A: {passiveTotals.perLotAllocated.LOT_A}/18t</strong>,{' '}
                    <strong>#B: {passiveTotals.perLotAllocated.LOT_B}/14t</strong>,{' '}
                    <strong>#C: {passiveTotals.perLotAllocated.LOT_C}/10t</strong>) để chốt lệnh.
                  </span>
                ) : contingencyPlanText.trim().length < 15 ? (
                  <span>Hãy nhập bản giải trình ngắn gửi Giám đốc Vận hành trước khi chốt lệnh.</span>
                ) : (
                  <span className="font-bold text-black">
                    Đã phân bổ đủ 42/42 tấn và hoàn tất bản giải trình. Hãy tự rà soát lại định mức Cột Trái trước khi nộp!
                  </span>
                )}
              </div>

              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleFinalizeSubmit}
                className="btn-pill-dark text-xs py-3 px-6 bg-black text-white hover:bg-neutral-800 flex-shrink-0 gap-2"
              >
                <Send className="w-3.5 h-3.5 text-accent" />
                <span>CHỐT LỆNH ĐIỀU PHỐI</span>
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================
         * CỘT PHẢI: BẢNG THỐNG KÊ CHI PHÍ & TÀI NGUYÊN THỤ ĐỘNG (PASSIVE LEDGER)
         * STRICT INVARIANT: RAW NUMBERS ONLY — ZERO OVERLOAD/TEMP RED WARNINGS!
         * ============================================================ */}
        <aside
          data-testid="passive-resource-ledger"
          className="xl:col-span-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 space-y-4"
        >
          <div className="flex items-center gap-1.5 text-xs font-black uppercase text-black border-b-2 border-black pb-2">
            <Calculator className="w-4 h-4 text-black" />
            <span>Thống Kê Tài Nguyên Thụ Động</span>
          </div>

          {/* Total Progress */}
          <div className="bg-soft-gray border border-hairline p-3 flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700">Tổng đã phân bổ:</span>
            <span className="font-mono text-base font-black text-black">
              {passiveTotals.totalAllocatedTons} / 42 tấn
            </span>
          </div>

          {/* Per-Resource Raw Tonnage Ledger (Strictly Neutral Typography!) */}
          <div className="space-y-2">
            <div className="text-[11px] font-black uppercase tracking-wider text-muted-gray">
              Số Tấn Cộng Dồn Theo Phương Tiện / Kho
            </div>
            <div className="divide-y divide-hairline border border-hairline text-xs">
              {scenario.resources.map(res => (
                <div
                  key={res.id}
                  data-testid={`ledger-slot-${res.id}`}
                  className="px-3 py-2 flex items-center justify-between bg-white"
                >
                  <span className="text-neutral-800 font-medium">{res.shortLabel}</span>
                  <span className="font-mono font-bold text-black">
                    {passiveTotals.perResourceAllocated[res.id]} tấn
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Breakdown */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-soft-gray border border-hairline">
              <div className="text-[10px] font-bold uppercase text-muted-gray">
                Đi chiều nay (15:00)
              </div>
              <div className="font-mono font-black text-sm text-black mt-0.5">
                {passiveTotals.afternoonTons} tấn
              </div>
            </div>
            <div className="p-2.5 bg-soft-gray border border-hairline">
              <div className="text-[10px] font-bold uppercase text-muted-gray">
                Chờ chuyến 03:30
              </div>
              <div className="font-mono font-black text-sm text-black mt-0.5">
                {passiveTotals.nextDayTons} tấn
              </div>
            </div>
          </div>

          {/* Raw Operational Cost Ledger */}
          <div className="space-y-1.5 border-t border-hairline pt-3 text-xs">
            <div className="text-[11px] font-black uppercase tracking-wider text-muted-gray">
              Chi Phí Vận Tải &amp; Lưu Kho Cộng Dồn
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>Thuê xe đường bộ (15:00):</span>
              <span className="font-mono font-bold text-black">
                {formatVnd(passiveTotals.vehicleTripCostVnd)}
              </span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>Lưu kho lạnh HP (1.5tr/tấn):</span>
              <span className="font-mono font-bold text-black">
                {formatVnd(passiveTotals.coldStorageCostVnd)}
              </span>
            </div>
            <div className="flex justify-between font-black text-black border-t border-black pt-1.5">
              <span>Tổng phí vận hành thô:</span>
              <span className="font-mono">{formatVnd(passiveTotals.totalOperationalCostVnd)}</span>
            </div>
          </div>

          {/* Passive Disclaimer */}
          <p className="text-[10px] text-muted-gray leading-relaxed border-t border-hairline pt-3">
            * Bảng thống kê chỉ cộng dồn số liệu thô theo thời gian thực (không bao gồm tiền phạt SLA, thiệt hại hỏng hàng hay cảnh báo vượt tải). Chuyên viên điều phối tự đối chiếu với Thẻ 1 &amp; Thẻ 2 ở Cột Trái trước khi chốt lệnh.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default LogisticsDispatchBoard;
