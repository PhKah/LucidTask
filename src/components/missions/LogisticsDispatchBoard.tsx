import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Bot,
  Clock,
  RotateCcw,
  Send,
  Undo2,
  Calculator,
  X,
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
import LogisticsDragDropPanel from './LogisticsDragDropPanel';
import LogisticsInfoDock from './LogisticsInfoDock';
import LogisticsFeedbackModal, { LogisticsFeedbackMode } from './LogisticsFeedbackModal';
import { AllocationCheckMessage, checkLogisticsPlan } from '../../engine/logisticsDragDrop';

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
  // Experimental branch only. The original +/- matrix remains available.
  const [interactionMode, setInteractionMode] = useState<'DRAG' | 'TABLE'>('DRAG');
  const [auditMessages, setAuditMessages] = useState<AllocationCheckMessage[] | null>(null);
  const [feedbackMode, setFeedbackMode] = useState<LogisticsFeedbackMode | null>(null);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);

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
    setAuditMessages(null); // checked data is stale after any edit

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
    setAuditMessages(null);
    setAiTriggered(true);
    setAiBannerVisible(true);
    setAiExplicitlyRejected(false);

    telemetryBus.publish('ai_copilot_triggered', {
      mission_id: 'IND_LOG_COLDCHAIN',
    });
  };

  const handleRejectAiCopilot = () => {
    setAllocation(cloneAllocation(preAiSnapshotRef.current));
    setAuditMessages(null);
    setAiBannerVisible(false);
    setAiExplicitlyRejected(true);

    telemetryBus.publish('ai_copilot_overridden', {
      mission_id: 'IND_LOG_COLDCHAIN',
      method: 'EXPLICIT_BUTTON',
    });
  };

  const handleResetBoard = () => {
    setAllocation(createEmptyLogisticsAllocation());
    setAuditMessages(null);
    setAiBannerVisible(false);
    setAiTriggered(false);
    setAiExplicitlyRejected(false);
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

  const closeFeedback = useCallback(() => setFeedbackMode(null), []);
  const handleAuditClick = () => {
    setAuditMessages(checkLogisticsPlan(allocation, scenario));
    setFeedbackMode('AUDIT');
  };

  const allLotsBalanced =
    passiveTotals.perLotAllocated.LOT_A === 18 &&
    passiveTotals.perLotAllocated.LOT_B === 14 &&
    passiveTotals.perLotAllocated.LOT_C === 10;

  const canSubmit = allLotsBalanced && contingencyPlanText.trim().length >= 15;

  const handleSubmissionReview = () => {
    const checks = checkLogisticsPlan(allocation, scenario);
    const items = checks.filter(message => message.type === 'error');
    if (contingencyPlanText.trim().length < 15) {
      items.push({
        id: 'incomplete-contingency',
        type: 'error',
        title: 'Bản giải trình chưa hoàn tất',
        text: 'Bản giải trình gửi Giám đốc Vận hành cần ít nhất 15 ký tự.',
        suggestion: 'Ghi rõ vì sao bạn chọn phương án này và cách cân đối thời gian, chi phí, rủi ro.',
      });
    }
    setAuditMessages(items.length > 0 ? items : checks);
    setFeedbackMode('SUBMIT');
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Compact command bar: show the numbers a dispatcher needs immediately. */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-black bg-night-navy px-4 py-3 text-white">
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs">
          <strong className="bg-accent px-2.5 py-1 font-black uppercase text-black">Điều phối chuỗi lạnh</strong>
          <span className="hidden font-bold text-gray-200 sm:inline">Hải Phòng → Hà Nội</span>
          <span className="inline-flex items-center gap-1 font-mono text-gray-200">
            <Clock className="h-3.5 w-3.5 text-accent" /> {scenario.currentClock}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="border border-white/40 px-2.5 py-1 font-mono text-xs font-bold" aria-label="Tổng số tấn đã phân bổ">
            {passiveTotals.totalAllocatedTons} / 42 tấn
          </span>
          <button
            type="button"
            onClick={() => setIsLedgerOpen(true)}
            aria-label="Mở bảng thống kê"
            aria-controls="passive-resource-ledger"
            aria-expanded={isLedgerOpen}
            className="inline-flex items-center gap-1.5 border border-white/60 px-2.5 py-1 text-xs font-bold hover:bg-white/10"
          >
            <Calculator className="h-3.5 w-3.5 text-accent" /> Thống kê
          </button>
          <CountdownTimer
            initialSeconds={scenario.durationMinutes * 60}
            isRunning={true}
            onTimeUp={handleFinalizeSubmit}
          />
        </div>
      </div>

      {/* One slim reference dock + an expanded play area. The original six drop targets stay untouched. */}
      <div className="flex flex-col items-start gap-3 lg:flex-row lg:gap-4">
        <LogisticsInfoDock scenario={scenario} />

        {/* ============================================================
         * CỘT GIỮA: BẢNG ĐIỀU PHỐI PHÂN BỔ (ALLOCATION MATRIX) + AI + GIẢI TRÌNH
         * ============================================================ */}
        <section className="min-w-0 w-full flex-1 space-y-4">
          {/* Matrix Card */}
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 sm:p-5 space-y-4">
            {/* Toolbar with AI Co-pilot Trigger (Hạng mục 4/4) */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-black">
              <div>
                <h2 className="text-sm font-black uppercase text-black">
                  Bảng điều phối • 42 tấn
                </h2>
                <p className="text-[11px] text-muted-gray">
                  Kéo hàng vào xe, kho hoặc bãi chờ. Di chuột vào thanh thông tin bên trái để xem dữ liệu lô.
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
                  <span className="ml-1 border border-white/60 px-1.5 py-0.5 text-[9px] font-black text-amber-200">CHƯA KIỂM CHỨNG</span>
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
                      ĐỀ XUẤT AI — CHƯA KIỂM CHỨNG:
                    </div>
                    <p>{scenario.aiCopilotMessage}</p>
                    <p className="mt-2 font-bold text-amber-800 border-t border-indigo-200 pt-2">
                      Đây là đề xuất chưa được xác nhận. Hãy mở biểu tượng Xe/Kho ở thanh thông tin để đối chiếu định mức và bấm “Kiểm tra phương án” trước khi chốt.
                    </p>
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

            {/* Phase 1 game-design branch: switch without discarding the original table. */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-black text-[11px] uppercase text-black">Chế độ phân bổ</div>
              <div role="tablist" aria-label="Chế độ phân bổ hàng" className="inline-flex gap-1">
                <button
                  type="button"
                  role="tab"
                  aria-selected={interactionMode === 'DRAG'}
                  onClick={() => setInteractionMode('DRAG')}
                  className={`border border-black px-3 py-1.5 text-[11px] font-bold ${interactionMode === 'DRAG' ? 'bg-night-navy text-white' : 'bg-white hover:bg-soft-gray text-black'}`}
                >
                  Kéo thả (thử nghiệm)
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={interactionMode === 'TABLE'}
                  onClick={() => setInteractionMode('TABLE')}
                  className={`border border-black px-3 py-1.5 text-[11px] font-bold ${interactionMode === 'TABLE' ? 'bg-night-navy text-white' : 'bg-white hover:bg-soft-gray text-black'}`}
                >
                  Bảng truyền thống (+/-)
                </button>
              </div>
            </div>

            {interactionMode === 'DRAG' ? (
              <LogisticsDragDropPanel
                scenario={scenario}
                allocation={allocation}
                onChangeCell={(lotId, resourceId, value) => updateCell(lotId, resourceId, value)}
                onAudit={handleAuditClick}
                auditIssues={auditMessages || []}
              />
            ) : (
            /* Original allocation matrix with updated styles retained from main. */
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-soft-gray border-y-2 border-black text-[10px] font-black uppercase text-black">
                    <th className="py-2 px-1.5 text-left w-[108px]">Lô hàng</th>
                    {scenario.resources.map(res => (
                      <th key={res.id} className="py-2 px-1 text-center min-w-[66px]">
                        <div className="leading-tight">{res.shortLabel}</div>
                        <div className="text-[9px] font-normal text-muted-gray normal-case leading-tight mt-0.5">
                          {res.category === 'AFTERNOON_VEHICLE'
                            ? `15:00 • ≤${res.maxCapacityTons}t`
                            : res.category === 'COLD_STORAGE'
                              ? `-18→0°C • ≤${res.maxCapacityTons}t`
                              : '03:30 • Bãi'}
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
                      <tr key={lot.id} className={`hover:bg-neutral-50/70 ${auditMessages?.some(issue => issue.type === 'error' && issue.lotId === lot.id) ? 'bg-red-50/50' : ''}`}>
                        <td className="py-2.5 px-1.5 align-top">
                          <div className="font-black text-black">{lot.code}</div>
                          <div className="text-[11px] text-neutral-700 leading-tight">
                            {lot.name}
                          </div>
                          <div className="mt-1 font-mono text-[10px] text-neutral-800 flex flex-wrap items-center gap-1">
                            <span>
                              <strong>{allocatedForLot}</strong>/{lot.totalTons}t
                            </span>
                            {remainingForLot !== 0 ? (
                              <span className="bg-amber-100 border border-amber-500 text-amber-950 font-bold px-1 py-0.5 leading-none">
                                {remainingForLot > 0 ? `còn ${remainingForLot}t` : `dư ${Math.abs(remainingForLot)}t`}
                              </span>
                            ) : (
                              <span className="bg-emerald-100 border border-emerald-600 text-emerald-900 font-bold px-1 py-0.5 leading-none">
                                đủ
                              </span>
                            )}
                          </div>
                        </td>

                        {scenario.resources.map(res => {
                          const val = allocation[lot.id][res.id];
                          return (
                            <td key={res.id} className={`py-2.5 px-0.5 text-center align-middle ${auditMessages?.some(issue => issue.type === 'error' && issue.resourceId === res.id) ? 'bg-red-100/70 ring-1 ring-inset ring-red-500' : ''}`}>
                              <div className="inline-flex items-center border border-black bg-white">
                                <button
                                  type="button"
                                  aria-label={`Giảm ${lot.code} tại ${res.shortLabel}`}
                                  onClick={() => updateCell(lot.id, res.id, val - 1, true)}
                                  className="px-1 py-1 text-xs font-black hover:bg-soft-gray border-r border-hairline"
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  min={0}
                                  inputMode="numeric"
                                  aria-label={`${lot.code} - ${res.shortLabel}`}
                                  value={val}
                                  onFocus={e => e.currentTarget.select()}
                                  onClick={e => {
                                    if (e.currentTarget.value === '0') {
                                      e.currentTarget.select();
                                    }
                                  }}
                                  onChange={e => {
                                    const cleaned = e.target.value.replace(/^0+(?=\d)/, '');
                                    e.target.value = cleaned;
                                    updateCell(lot.id, res.id, Number(cleaned), false);
                                  }}
                                  className="w-7 py-1 text-center font-mono text-xs font-bold focus:outline-none focus:bg-amber-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button
                                  type="button"
                                  aria-label={`Tăng ${lot.code} tại ${res.shortLabel}`}
                                  onClick={() => updateCell(lot.id, res.id, val + 1, true)}
                                  className="px-1 py-1 text-xs font-black hover:bg-soft-gray border-l border-hairline"
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
            )}
          </div>

          {/* Contingency Dispatch Plan (Bản Giải Trình Khẩn Cấp) */}
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-black pb-2">
              <FileText className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-black uppercase text-black">
                Giải trình phương án điều phối
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
                    placeholder="Nhập số triệu VNĐ"
                    value={estimatedDamageInput}
                    onChange={e => setEstimatedDamageInput(e.target.value)}
                    className="w-full px-3 py-2 font-mono text-sm font-bold focus:outline-none focus:bg-amber-50"
                  />
                  <span className="px-3 py-2 bg-soft-gray border-l border-black text-xs font-mono font-bold text-muted-gray flex-shrink-0">
                    triệu VNĐ
                  </span>
                </div>
              </div>
              <details className="border border-hairline bg-soft-gray text-[11px] text-muted-gray">
                <summary className="cursor-pointer px-3 py-2 font-bold text-black">Gợi ý tính thiệt hại (xem khi cần)</summary>
                <p className="px-3 pb-2 leading-relaxed">Đối chiếu phạt trễ 12 giờ (18:00 → 06:00) với tổn thất hỏng hàng khi giữ lô tươi sống qua đêm.</p>
              </details>
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
                    Đã phân bổ đủ 42/42 tấn. Hãy mở thông tin Xe/Kho để tự đối chiếu định mức trước khi nộp!
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleSubmissionReview}
                className="btn-pill-dark text-xs py-3 px-6 bg-black text-white hover:bg-neutral-800 flex-shrink-0 gap-2"
              >
                <Send className="w-3.5 h-3.5 text-accent" />
                <span>CHỐT LỆNH ĐIỀU PHỐI</span>
              </button>
            </div>
          </div>
        </section>

        {/* The ledger remains passive and intact, but is shown only on demand. */}
        {isLedgerOpen && (
          <button
            type="button"
            aria-label="Đóng lớp phủ thống kê"
            className="fixed inset-0 z-30 cursor-default bg-night-navy/30"
            onClick={() => setIsLedgerOpen(false)}
          />
        )}
        <aside
          id="passive-resource-ledger"
          data-testid="passive-resource-ledger"
          className={`${isLedgerOpen ? 'fixed' : 'hidden'} bottom-0 right-0 top-0 z-40 w-[min(92vw,420px)] overflow-y-auto border-l-2 border-black bg-white p-4 shadow-[-8px_0_30px_rgba(0,0,0,0.2)] space-y-4`}
        >
          <div className="flex items-center justify-between gap-2 border-b-2 border-black pb-2 text-xs font-black uppercase text-black">
            <span className="inline-flex items-center gap-1.5">
              <Calculator className="h-4 w-4" /> Thống kê tài nguyên thụ động
            </span>
            <button
              type="button"
              aria-label="Đóng bảng thống kê"
              onClick={() => setIsLedgerOpen(false)}
              className="p-1 hover:bg-soft-gray"
            >
              <X className="h-4 w-4" />
            </button>
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
            * Bảng thống kê chỉ cộng dồn dữ liệu vận hành, không tự đánh giá mức độ hợp lệ của phương án. Hãy xem thông tin chi tiết qua thanh bên trái và tự kiểm tra trước khi chốt lệnh.
          </p>
        </aside>
      </div>
      {feedbackMode && auditMessages && (
        <LogisticsFeedbackModal
          mode={feedbackMode}
          messages={auditMessages}
          canSubmit={canSubmit}
          onClose={closeFeedback}
          onFinalize={handleFinalizeSubmit}
        />
      )}
    </div>
  );
};

export default LogisticsDispatchBoard;
