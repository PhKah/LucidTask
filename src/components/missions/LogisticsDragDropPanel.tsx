import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ClipboardCheck, GripVertical, Info, Package, Ship, Snowflake, Truck } from 'lucide-react';
import { CargoLotId, LogisticsAllocationMatrix, LogisticsScenario, ResourceSlotId } from '../../types/mission';
import { computeLogisticsPassiveTotals } from '../../engine/MissionEvaluators';
import { AllocationCheckMessage, previewCargoTransfer } from '../../engine/logisticsDragDrop';
import CargoParcel from './CargoParcel';

interface LogisticsDragDropPanelProps {
  scenario: LogisticsScenario;
  allocation: LogisticsAllocationMatrix;
  onChangeCell: (lotId: CargoLotId, resourceId: ResourceSlotId, value: number) => void;
  onAudit: () => void;
  auditIssues: AllocationCheckMessage[];
}

type TransferStep = 1 | 2 | 5 | 'REMAINING';
const transferSteps: TransferStep[] = [1, 2, 5, 'REMAINING'];

interface PointerDragSession {
  pointerId: number;
  lotId: CargoLotId;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  active: boolean;
}

interface ParcelVisual {
  lotId: CargoLotId;
  tons: number;
  x: number;
  y: number;
}

interface ParcelFlight {
  id: number;
  lotId: CargoLotId;
  tons: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  returning: boolean;
}

const lotAccents: Record<CargoLotId, string> = {
  LOT_A: 'border-orange-500 bg-orange-50',
  LOT_B: 'border-emerald-600 bg-emerald-50',
  LOT_C: 'border-sky-600 bg-sky-50',
};

const getPointerPosition = (
  event: React.PointerEvent
): { x: number; y: number } | null => {
  const { clientX, clientY } = event;
  return Number.isFinite(clientX) && Number.isFinite(clientY)
    ? { x: clientX, y: clientY }
    : null;
};

/**
 * Experimental interaction layer only. Shares the original matrix, evaluator,
 * AI trap, report and telemetry through onChangeCell. Does not auto-correct or
 * auto-reject overloads: that is part of the mission's self-audit challenge.
 */
const LogisticsDragDropPanel: React.FC<LogisticsDragDropPanelProps> = ({ scenario, allocation, onChangeCell, onAudit, auditIssues }) => {
  const [transferStep, setTransferStep] = useState<TransferStep>(5);
  const [selectedLot, setSelectedLot] = useState<CargoLotId | null>(null);
  const [draggedLot, setDraggedLot] = useState<CargoLotId | null>(null);
  const [hoveredResource, setHoveredResource] = useState<ResourceSlotId | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackKind, setFeedbackKind] = useState<'normal' | 'recorded' | 'error'>('normal');
  const [transferFlash, setTransferFlash] = useState<{ resourceId: ResourceSlotId; kind: 'recorded' | 'error'; seq: number } | null>(null);
  const flashCounterRef = useRef(0);
  const pointerSessionRef = useRef<PointerDragSession | null>(null);
  const suppressClickRef = useRef(false);
  const flightCounterRef = useRef(0);
  const [parcelVisual, setParcelVisual] = useState<ParcelVisual | null>(null);
  const [parcelFlight, setParcelFlight] = useState<ParcelFlight | null>(null);
  const totals = useMemo(() => computeLogisticsPassiveTotals(allocation), [allocation]);

  // Only highlight the latest transfer briefly; audit results stay parent-owned and are
  // invalidated when the matrix changes, including after table edits and AI actions.
  useEffect(() => {
    if (!transferFlash) return;
    const timer = window.setTimeout(() => setTransferFlash(null), 650);
    return () => window.clearTimeout(timer);
  }, [transferFlash]);

  const performTransfer = (lotId: CargoLotId, resourceId: ResourceSlotId) => {
    const preview = previewCargoTransfer(allocation, scenario, lotId, transferStep);
    if (preview.allowedTons <= 0) {
      setFeedback(preview.reason || 'Không có hàng để phân bổ.');
      setFeedbackKind('error');
      setTransferFlash({ resourceId, kind: 'error', seq: ++flashCounterRef.current });
      return;
    }
    const lot = scenario.lots.find(item => item.id === lotId);
    const resource = scenario.resources.find(item => item.id === resourceId);
    onChangeCell(lotId, resourceId, allocation[lotId][resourceId] + preview.allowedTons);
    setFeedbackKind('recorded');
    setTransferFlash({ resourceId, kind: 'recorded', seq: ++flashCounterRef.current });
    setFeedback(`Đã ghi nhận ${preview.allowedTons} tấn ${lot?.code || lotId} → ${resource?.shortLabel || resourceId}. Chưa xác nhận ràng buộc.${preview.reason ? ` ${preview.reason}` : ''}`);
  };

  const handleResourceClick = (resourceId: ResourceSlotId) => {
    if (!selectedLot) {
      setFeedback('Hãy chọn một lô hàng ở bên trên, rồi chọn vị trí cần xếp.');
      setFeedbackKind('error');
      return;
    }
    performTransfer(selectedLot, resourceId);
  };

  const undoOneTon = (lotId: CargoLotId, resourceId: ResourceSlotId) => {
    const assigned = allocation[lotId][resourceId];
    if (assigned < 1) return;
    onChangeCell(lotId, resourceId, assigned - 1);
    setFeedbackKind('normal');
    setFeedback(`Đã lấy lại 1 tấn ${scenario.lots.find(l => l.id === lotId)?.code || lotId} từ ${scenario.resources.find(r => r.id === resourceId)?.shortLabel || resourceId}.`);
  };

  // Use Pointer Events and a React-rendered fixed overlay, not native HTML5
  // drag-and-drop. Browser drag thumbnails are inconsistent (Chrome can fall
  // back to a screenshot of the full card even after setDragImage(canvas)).
  const dropTargetAt = (x: number, y: number): { resourceId: ResourceSlotId; element: HTMLElement } | null => {
    const hit = document.elementFromPoint?.(x, y);
    const element = hit?.closest<HTMLElement>('[data-drop-resource-id]');
    const candidate = element?.dataset.dropResourceId;
    const resource = scenario.resources.find(item => item.id === candidate);
    return resource && element ? { resourceId: resource.id, element } : null;
  };

  const finishPointerDrag = () => {
    pointerSessionRef.current = null;
    setDraggedLot(null);
    setHoveredResource(null);
    setParcelVisual(null);
  };

  const startPointerDrag = (event: React.PointerEvent<HTMLButtonElement>, lotId: CargoLotId, remaining: number) => {
    const position = getPointerPosition(event);
    if (!position || remaining <= 0 || (event.pointerType === 'mouse' && event.button !== 0)) return;
    pointerSessionRef.current = {
      pointerId: event.pointerId,
      lotId,
      startX: position.x,
      startY: position.y,
      lastX: position.x,
      lastY: position.y,
      active: false,
    };
    try { event.currentTarget.setPointerCapture?.(event.pointerId); } catch { /* not supported in some test environments */ }
  };

  const movePointerDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const session = pointerSessionRef.current;
    const position = getPointerPosition(event);
    if (!session || session.pointerId !== event.pointerId || !position) return;
    session.lastX = position.x;
    session.lastY = position.y;
    const distance = Math.hypot(position.x - session.startX, position.y - session.startY);
    if (!session.active && distance < 8) return; // A tap still selects the lot.
    if (!session.active) {
      session.active = true;
      setSelectedLot(session.lotId);
      setDraggedLot(session.lotId);
    }
    event.preventDefault();
    const tons = previewCargoTransfer(allocation, scenario, session.lotId, transferStep).allowedTons;
    setParcelVisual({ lotId: session.lotId, tons, x: position.x, y: position.y });
    setHoveredResource(dropTargetAt(position.x, position.y)?.resourceId ?? null);
  };

  const releasePointerDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const session = pointerSessionRef.current;
    if (!session || session.pointerId !== event.pointerId) return;
    if (session.active) {
      const position = getPointerPosition(event) ?? { x: session.lastX, y: session.lastY };
      // Browsers dispatch a click on the captured source after pointerup;
      // don't let that overwrite the transfer's feedback message.
      suppressClickRef.current = true;
      window.setTimeout(() => { suppressClickRef.current = false; }, 0);
      const target = dropTargetAt(position.x, position.y);
      const preview = previewCargoTransfer(allocation, scenario, session.lotId, transferStep);
      const fromX = position.x + 12;
      const fromY = position.y + 12;
      const bounds = target?.element.getBoundingClientRect();
      const card = event.currentTarget.getBoundingClientRect();
      const destinationX = target && bounds
        ? bounds.left + bounds.width / 2 - 40
        : card.left + card.width / 2 - 40;
      const destinationY = target && bounds
        ? bounds.top + 12
        : card.top + card.height / 2 - 40;
      setParcelFlight({
        id: ++flightCounterRef.current,
        lotId: session.lotId,
        tons: preview.allowedTons,
        fromX, fromY,
        toX: Number.isFinite(destinationX) ? destinationX : fromX,
        toY: Number.isFinite(destinationY) ? destinationY : fromY,
        returning: !target || preview.allowedTons === 0,
      });
      if (target) performTransfer(session.lotId, target.resourceId);
      else {
        setFeedbackKind('error');
        setFeedback('Chưa xếp hàng: thả kiện vào một ô xe, kho hoặc bãi chờ.');
      }
    }
    finishPointerDrag();
  };

  useEffect(() => {
    if (!parcelFlight) return;
    const timer = window.setTimeout(() => setParcelFlight(null), 340);
    return () => window.clearTimeout(timer);
  }, [parcelFlight]);

  const total = scenario.lots.reduce((sum, lot) => sum + lot.totalTons, 0);

  return (
    <div data-testid="logistics-dnd-panel" className="space-y-4 text-xs">
      {typeof document !== 'undefined' && createPortal(
        <>
          {parcelVisual && parcelVisual.tons > 0 && (
            <div
              data-testid="cargo-parcel-ghost"
              className="lt-parcel-ghost"
              aria-hidden="true"
              style={{ left: parcelVisual.x + 12, top: parcelVisual.y + 12 }}
            >
              <CargoParcel code={scenario.lots.find(lot => lot.id === parcelVisual.lotId)?.code || ''} tons={parcelVisual.tons} />
            </div>
          )}
          {parcelFlight && parcelFlight.tons > 0 && (
            <div
              key={parcelFlight.id}
              data-testid="cargo-parcel-flight"
              className={`lt-parcel-ghost ${parcelFlight.returning ? 'lt-parcel-return' : 'lt-parcel-fly'}`}
              aria-hidden="true"
              style={{
                left: parcelFlight.fromX,
                top: parcelFlight.fromY,
                '--lt-parcel-dx': `${parcelFlight.toX - parcelFlight.fromX}px`,
                '--lt-parcel-dy': `${parcelFlight.toY - parcelFlight.fromY}px`,
              } as React.CSSProperties}
            >
              <CargoParcel code={scenario.lots.find(lot => lot.id === parcelFlight.lotId)?.code || ''} tons={parcelFlight.tons} />
            </div>
          )}
        </>,
        document.body
      )}
      <details className="border border-hairline bg-amber-50 text-[11px]">
        <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 font-bold text-black">
          <Info className="h-4 w-4 shrink-0 text-amber-700" />
          Hướng dẫn kéo thả (xem khi cần)
        </summary>
        <p className="px-3 pb-3 leading-relaxed text-neutral-700">
          Chọn khối lượng, giữ và kéo kiện vào xe/kho/bãi, hoặc chọn lô rồi nhấn đích (dùng được trên điện thoại).
          Bảng truyền thống đồng bộ cùng dữ liệu. Không tự chặn quá tải: bạn cần bấm “Kiểm tra phương án”.
        </p>
      </details>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-black uppercase tracking-wide">01 / Khối lượng mỗi lượt</div>
        <div role="group" aria-label="Khối lượng mỗi lượt kéo thả" className="inline-flex flex-wrap gap-1">
          {transferSteps.map(step => (
            <button
              type="button"
              key={step}
              aria-pressed={transferStep === step}
              onClick={() => setTransferStep(step)}
              className={`min-w-[44px] border px-2.5 py-1.5 font-bold transition-colors ${transferStep === step ? 'bg-black border-black text-white' : 'bg-white border-neutral-400 text-black hover:bg-soft-gray'}`}
            >
              {step === 'REMAINING' ? 'Còn lại' : `${step} tấn`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="font-black uppercase tracking-wide mb-2">02 / Chọn lô hàng</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {scenario.lots.map(lot => {
            const remaining = Math.max(0, lot.totalTons - totals.perLotAllocated[lot.id]);
            const hasAuditIssue = auditIssues.some(issue => issue.type === 'error' && issue.lotId === lot.id);
            return (
              <button
                key={lot.id}
                type="button"
                draggable={false}
                onDragStart={event => event.preventDefault()}
                onPointerDown={event => startPointerDrag(event, lot.id, remaining)}
                onPointerMove={movePointerDrag}
                onPointerUp={releasePointerDrag}
                onPointerCancel={finishPointerDrag}
                onLostPointerCapture={finishPointerDrag}
                onClick={() => {
                  if (suppressClickRef.current) return;
                  setSelectedLot(lot.id);
                  setFeedbackKind('normal');
                  setFeedback(`Đã chọn ${lot.code}. Bấm một ô điểm đến bên dưới để xếp hàng.`);
                }}
                aria-pressed={selectedLot === lot.id}
                aria-label={`Chọn ${lot.code}, còn ${remaining} tấn`}
                data-testid={`draggable-${lot.id}`}
                className={`group border-2 px-3 py-3 text-left transition-all ${lotAccents[lot.id]} ${selectedLot === lot.id ? 'ring-2 ring-black ring-offset-1' : 'hover:shadow-[2px_2px_0_#000]'} ${remaining === 0 ? 'opacity-60 cursor-default' : 'cursor-grab active:cursor-grabbing touch-none select-none'} ${hasAuditIssue ? 'lt-audit-warning outline outline-2 outline-red-600 outline-offset-[2px]' : ''}`}
              >
                <div className="flex items-center gap-1.5 font-black text-black">
                  <GripVertical className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{lot.code}</span>
                  <span className="ml-auto inline-flex items-center gap-1 border border-neutral-500 bg-white/90 px-1.5 py-0.5 text-[9px] uppercase tracking-wide">
                    <Package className="w-3 h-3" /> Kéo kiện
                  </span>
                </div>
                <div className="text-[11px] text-neutral-700 mt-1 line-clamp-2 min-h-[30px]">{lot.name}</div>
                <div className="flex items-end justify-between border-t border-black/20 pt-1.5 mt-2">
                  <span className="font-mono text-xl font-black text-black">{remaining}t</span>
                  <span className="text-[10px] font-bold uppercase text-neutral-600">còn / {lot.totalTons}t</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="font-black uppercase tracking-wide mb-2 flex items-center justify-between gap-2">
          <span>03 / Thả vào xe, kho hoặc bãi chờ</span>
          <span className="font-mono text-[11px] text-neutral-600 normal-case">{totals.totalAllocatedTons} / {total} tấn</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {scenario.resources.map(resource => {
            const assigned = totals.perResourceAllocated[resource.id];
            const cap = resource.maxCapacityTons;
            const usedRatio = cap === null ? 0 : (assigned / cap) * 100;
            const isHover = hoveredResource === resource.id;
            const isVehicle = resource.category === 'AFTERNOON_VEHICLE';
            const ResourceIcon = isVehicle ? Truck : resource.category === 'COLD_STORAGE' ? Snowflake : Ship;
            const hasAuditIssue = auditIssues.some(issue => issue.type === 'error' && issue.resourceId === resource.id);
            const isFlashing = transferFlash?.resourceId === resource.id;
            return (
              <div
                key={`${resource.id}-${isFlashing ? transferFlash.seq : 'idle'}`}
                data-testid={`drop-target-${resource.id}`}
                data-drop-resource-id={resource.id}
                className={`relative min-h-[152px] border-2 transition-colors ${hasAuditIssue ? 'border-red-600 bg-red-50/40 lt-audit-warning' : isHover ? 'border-amber-600 bg-amber-50' : 'border-neutral-300 bg-white hover:border-black'} ${isFlashing ? transferFlash.kind === 'recorded' ? 'lt-drop-recorded' : 'lt-drop-error' : ''}`}
              >
                {isHover && draggedLot && (
                  <div className="pointer-events-none absolute right-2 top-2 z-10 bg-amber-200 border border-amber-800 px-2 py-1 font-black text-[10px] text-amber-950 shadow-sm lt-drop-hint" aria-hidden="true">
                    +{previewCargoTransfer(allocation, scenario, draggedLot, transferStep).allowedTons}t · {scenario.lots.find(lot => lot.id === draggedLot)?.code} · Thả vào đây
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleResourceClick(resource.id)}
                  aria-label={`Xếp lô đang chọn vào ${resource.shortLabel}`}
                  className="w-full text-left p-3 pb-2 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-black"
                >
                  <div className="flex items-start gap-2">
                    {isVehicle ? (
                      <span className="flex h-[48px] w-[82px] shrink-0 items-center justify-center sm:h-[60px] sm:w-[108px]" aria-hidden="true">
                        <img
                          data-testid={`vehicle-art-${resource.id}`}
                          src={resource.id === 'TRUCK_20FT' ? '/logistics-truck-20ft.png' : '/logistics-van-5t.png'}
                          alt=""
                          draggable={false}
                          className="h-full w-full object-contain"
                        />
                      </span>
                    ) : (
                      <span className="bg-night-navy text-accent p-1.5"><ResourceIcon className="w-4 h-4" /></span>
                    )}
                    <span className="flex-1">
                      <span className="block font-black text-black">{resource.shortLabel}</span>
                      <span className="block text-[10px] text-neutral-600 leading-snug mt-0.5">
                        {isVehicle ? 'Xuất phát 15:00' : resource.category === 'COLD_STORAGE' ? 'Kho trung chuyển, chờ 03:30' : 'Chuyến sáng mai 03:30'}
                      </span>
                    </span>
                    <span className="font-mono font-black text-black text-sm whitespace-nowrap">{assigned}{cap === null ? 't' : `/${cap}t`}</span>
                  </div>
                  {cap !== null ? (
                    <div className="mt-2 h-1.5 bg-neutral-200 overflow-hidden" aria-hidden="true">
                      <div className="h-full bg-accent transition-[width] duration-200" style={{ width: `${Math.min(100, usedRatio)}%` }} />
                    </div>
                  ) : (
                    <div className="mt-2 h-1.5 bg-neutral-200" aria-hidden="true" />
                  )}
                  <div className="mt-2 text-[10px] font-semibold text-neutral-600">{selectedLot ? 'Nhấn để xếp lô đã chọn' : 'Chọn lô hàng rồi nhấn tại đây'}</div>
                </button>
                <div className="px-3 pb-2 flex flex-wrap gap-1.5 min-h-[23px]" aria-label={`Hàng đã xếp tại ${resource.shortLabel}`}>
                  {scenario.lots.filter(lot => allocation[lot.id][resource.id] > 0).map(lot => (
                    <span key={lot.id} className="inline-flex items-center gap-1 bg-soft-gray border border-neutral-300 px-1.5 py-0.5 text-[10px] font-semibold">
                      {lot.code.replace('Lô ', '')}: {allocation[lot.id][resource.id]}t
                      <button
                        type="button"
                        aria-label={`Lấy lại 1 tấn ${lot.code} từ ${resource.shortLabel}`}
                        title="Lấy lại 1 tấn"
                        onClick={() => undoOneTon(lot.id, resource.id)}
                        className="font-black text-neutral-700 hover:text-black px-1"
                      >
                        −
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`px-3 py-2 flex flex-wrap gap-2 items-center justify-between border transition-colors ${feedbackKind === 'recorded' ? 'bg-amber-50 border-amber-600' : feedbackKind === 'error' ? 'bg-red-50 border-red-600' : 'bg-soft-gray border-hairline'}`} role="status" aria-live="polite">
        <span className="text-[11px] text-neutral-700 flex-1">{feedback || 'Bắt đầu bằng cách chọn lô hàng, chọn số tấn, rồi kéo thả hoặc nhấn vào điểm đến.'}</span>
        {feedback && <button type="button" className="underline text-[11px]" onClick={() => setFeedback('')}>Đóng</button>}
      </div>

      <div className="border-t-2 border-black pt-3 space-y-2">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="font-black uppercase text-black">04 / Tự kiểm tra phương án</div>
          <button
            type="button"
            onClick={onAudit}
            className="inline-flex items-center gap-1.5 bg-night-navy hover:bg-black border border-black text-white font-black px-3 py-2"
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-accent" />
            Kiểm tra phương án
          </button>
        </div>
        <p className="text-[11px] text-neutral-600">Kiểm tra chỉ xuất hiện khi bạn bấm nút; các quy tắc đánh giá cuối nhiệm vụ vẫn giữ nguyên.</p>
        {auditIssues.some(issue => issue.type === 'error') && (
          <div className="bg-red-50 border-l-4 border-red-600 px-3 py-2 text-[11px] flex flex-wrap items-center justify-between gap-2" role="status">
            <span className="font-bold text-red-900">Đã phát hiện {auditIssues.filter(item => item.type === 'error').length} vấn đề. Các vị trí liên quan được đánh dấu đỏ.</span>
            <button type="button" className="underline font-black" onClick={onAudit}>Xem lại cửa sổ kết quả</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisticsDragDropPanel;
