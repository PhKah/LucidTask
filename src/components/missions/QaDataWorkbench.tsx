import React, { useRef, useState } from 'react';
import {
  ArrowDown,
  Bot,
  Bug,
  CheckCircle2,
  Clock,
  Database,
  GitBranch,
  RotateCcw,
  Send,
  ShieldAlert,
  Tag,
  Undo2,
  X,
} from 'lucide-react';
import {
  DefectCategory,
  QaDataScenario,
  QaSubmission,
  ReleaseDecision,
} from '../../types/mission';
import { telemetryBus } from '../../engine/TelemetryBus';
import CountdownTimer from '../CountdownTimer';

interface QaDataWorkbenchProps {
  scenario: QaDataScenario;
  onSubmit: (submission: QaSubmission) => void;
}

const formatPrice = (val: number): string =>
  `${new Intl.NumberFormat('vi-VN').format(val)}đ`;

const DEFECT_BADGE_MAP: Record<DefectCategory, string> = {
  INVALID_DATE: 'LỖI NGÀY',
  NEGATIVE_OR_MATH_ERROR: 'GIÁ / TÍNH TOÁN',
  DUPLICATE_RECORD: 'TRÙNG ĐƠN',
  MISSING_OR_CORRUPT_FIELD: 'THIẾU / SAI SĐT',
};

export const QaDataWorkbench: React.FC<QaDataWorkbenchProps> = ({ scenario, onSubmit }) => {
  const [activeTab, setActiveTab] = useState<'DATA_GRID' | 'LOGIC_FLOW'>('DATA_GRID');
  const [flaggedOrders, setFlaggedOrders] = useState<Record<string, DefectCategory>>({});
  const [flaggedNodes, setFlaggedNodes] = useState<Record<string, string>>({});
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [releaseDecision, setReleaseDecision] = useState<ReleaseDecision | null>(null);
  const [bugReportNote, setBugReportNote] = useState<string>('');

  // AI Auto-QA Trap state
  const [aiTriggered, setAiTriggered] = useState<boolean>(false);
  const [aiBannerVisible, setAiBannerVisible] = useState<boolean>(false);
  const [aiExplicitlyRejected, setAiExplicitlyRejected] = useState<boolean>(false);
  const preAiSnapshotRef = useRef<{
    orders: Record<string, DefectCategory>;
    nodes: Record<string, string>;
    decision: ReleaseDecision | null;
  }>({ orders: {}, nodes: {}, decision: null });

  // Telemetry refs
  const startTimeRef = useRef<number>(Date.now());
  const tabSwitchCountRef = useRef<number>(0);
  const clickTimestampsRef = useRef<number[]>([]);
  const panicClicksRef = useRef<number>(0);

  const recordClickRate = (area: string) => {
    const now = Date.now();
    clickTimestampsRef.current = clickTimestampsRef.current.filter(ts => now - ts < 1000);
    clickTimestampsRef.current.push(now);
    if (clickTimestampsRef.current.length > 4) {
      panicClicksRef.current += 1;
      telemetryBus.publish('panic_click_flag', {
        click_rate_per_sec: clickTimestampsRef.current.length,
        area,
      });
    }
  };

  const handleSwitchTab = (target: 'DATA_GRID' | 'LOGIC_FLOW') => {
    if (target !== activeTab) {
      tabSwitchCountRef.current += 1;
      telemetryBus.publish('tab_switched', {
        from_tab: activeTab,
        to_tab: target,
      });
      setActiveTab(target);
    }
  };

  const handleTagOrder = (orderId: string, category: DefectCategory | null) => {
    recordClickRate('qa_data_grid');
    setFlaggedOrders(prev => {
      const next = { ...prev };
      if (category === null) {
        delete next[orderId];
      } else {
        next[orderId] = category;
      }
      return next;
    });
    setExpandedOrderId(null);

    telemetryBus.publish('data_cell_flagged', {
      order_id: orderId,
      defect_category: category,
    });
  };

  const handleTagFlowNode = (nodeId: string, reasonOptionId: string | null) => {
    recordClickRate('qa_logic_flow');
    setFlaggedNodes(prev => {
      const next = { ...prev };
      if (reasonOptionId === null) {
        delete next[nodeId];
      } else {
        next[nodeId] = reasonOptionId;
      }
      return next;
    });

    telemetryBus.publish('flow_node_flagged', {
      node_id: nodeId,
      reason_id: reasonOptionId,
    });
  };

  const handleTriggerAiAutoQa = () => {
    preAiSnapshotRef.current = {
      orders: { ...flaggedOrders },
      nodes: { ...flaggedNodes },
      decision: releaseDecision,
    };
    setFlaggedOrders({ ...scenario.aiAutoQaTrap.flaggedOrders });
    setFlaggedNodes({ ...scenario.aiAutoQaTrap.flaggedNodes });
    setReleaseDecision(scenario.aiAutoQaTrap.recommendedDecision);
    setAiTriggered(true);
    setAiBannerVisible(true);
    setAiExplicitlyRejected(false);

    telemetryBus.publish('ai_copilot_triggered', {
      mission_id: 'IND_QA_DATA',
    });
  };

  const handleRejectAiAutoQa = () => {
    setFlaggedOrders({ ...preAiSnapshotRef.current.orders });
    setFlaggedNodes({ ...preAiSnapshotRef.current.nodes });
    setReleaseDecision(preAiSnapshotRef.current.decision);
    setAiBannerVisible(false);
    setAiExplicitlyRejected(true);

    telemetryBus.publish('ai_copilot_overridden', {
      mission_id: 'IND_QA_DATA',
      method: 'EXPLICIT_BUTTON',
    });
  };

  const handleResetAll = () => {
    setFlaggedOrders({});
    setFlaggedNodes({});
    setReleaseDecision(null);
    setAiBannerVisible(false);
  };

  const handleFinalizeSubmit = () => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    onSubmit({
      flaggedOrders: { ...flaggedOrders },
      flaggedNodes: { ...flaggedNodes },
      releaseDecision: releaseDecision || 'BLOCK_RELEASE',
      bugReportNote: bugReportNote.trim(),
      aiTriggered,
      aiExplicitlyRejected,
      elapsedSeconds,
      tabSwitchCount: tabSwitchCountRef.current,
      panicClicksCount: panicClicksRef.current,
    });
  };

  const flaggedOrderCount = Object.keys(flaggedOrders).length;
  const flaggedNodeCount = Object.keys(flaggedNodes).length;
  const canSubmit = releaseDecision !== null && bugReportNote.trim().length >= 15;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Command Bar */}
      <div className="bg-night-navy text-white border-2 border-black px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="bg-accent text-black font-black px-2.5 py-1 uppercase tracking-wider">
            TRẠM KIỂM THỬ QA &amp; DỮ LIỆU • TIKIMART FLASH-SALE 11.11
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-gray-200">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span>HIỆN TẠI: <strong>{scenario.currentClock}</strong></span>
          </span>
          <span className="hidden md:inline text-gray-500">|</span>
          <span className="font-mono text-gray-300 text-[11px]">
            DEADLINE RELEASE: <strong className="text-white">{scenario.releaseDeadline}</strong>
          </span>
        </div>

        <CountdownTimer
          initialSeconds={scenario.durationMinutes * 60}
          isRunning={true}
          onTimeUp={handleFinalizeSubmit}
        />
      </div>

      {/* Main 2-Zone Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* CỘT TRÁI: QUY CHUẨN DỮ LIỆU 4 DÒNG & THỐNG KÊ THỤ ĐỘNG */}
        <aside className="xl:col-span-3 space-y-4">
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-black border-b-2 border-black pb-2">
              <Tag className="w-4 h-4 text-accent" />
              <span>Quy Chuẩn Dữ Liệu 4 Dòng</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {scenario.rules.map(rule => (
                <div key={rule.id} className="p-2.5 bg-soft-gray border border-black space-y-1">
                  <div className="font-black text-[11px] uppercase text-black flex items-center justify-between">
                    <span>{rule.label}</span>
                    <span className="bg-black text-white px-1.5 py-0.5 text-[9px] font-mono">
                      {rule.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-800 leading-snug">{rule.shortDesc}</p>
                  <div className="text-[10px] font-mono text-muted-gray">{rule.example}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Passive Progress Counter */}
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 space-y-3">
            <div className="text-xs font-black uppercase text-black border-b border-black pb-2">
              Thống Kê Thẻ Lỗi Đã Gắn (Thụ Động)
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-soft-gray border border-hairline">
                <div className="text-[10px] uppercase font-bold text-muted-gray">Bảng 15 đơn</div>
                <div className="font-mono font-black text-base text-black mt-0.5">
                  {flaggedOrderCount} / 15
                </div>
              </div>
              <div className="p-2.5 bg-soft-gray border border-hairline">
                <div className="text-[10px] uppercase font-bold text-muted-gray">Sơ đồ 7 bước</div>
                <div className="font-mono font-black text-base text-black mt-0.5">
                  {flaggedNodeCount} / 7
                </div>
              </div>
            </div>
            <p className="text-[10px] text-muted-gray leading-relaxed">
              * Hệ thống không báo đúng/sai trong lúc bạn rà soát. Đừng gắn bừa các đơn sạch hoặc bước đúng để giữ độ chính xác (Precision) cao nhất.
            </p>
          </div>
        </aside>

        {/* CỘT CHÍNH: 2 TAB SĂN LỖI CHỦ ĐỘNG + AI AUTO-QA + QUYẾT ĐỊNH RELEASE */}
        <section className="xl:col-span-9 space-y-5">
          {/* Interactive Workbench Container */}
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 sm:p-5 space-y-4">
            {/* Tab Switcher & AI Auto-QA Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-black">
              <div className="flex flex-wrap items-center gap-2" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'DATA_GRID'}
                  onClick={() => handleSwitchTab('DATA_GRID')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black uppercase border-2 border-black transition-colors ${
                    activeTab === 'DATA_GRID'
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-soft-gray'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-accent" />
                  <span>1. Bảng 15 Đơn Hàng ({flaggedOrderCount} lỗi)</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'LOGIC_FLOW'}
                  onClick={() => handleSwitchTab('LOGIC_FLOW')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black uppercase border-2 border-black transition-colors ${
                    activeTab === 'LOGIC_FLOW'
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-soft-gray'
                  }`}
                >
                  <GitBranch className="w-3.5 h-3.5 text-accent" />
                  <span>2. Sơ Đồ Luồng Tiếng Việt ({flaggedNodeCount} lỗi)</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleTriggerAiAutoQa}
                  className="inline-flex items-center gap-1.5 bg-night-navy hover:bg-black text-white text-xs font-bold px-3 py-1.5 border border-black transition-colors"
                >
                  <Bot className="w-3.5 h-3.5 text-accent" />
                  <span>AI Auto-QA: Quét lỗi tự động</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetAll}
                  className="inline-flex items-center gap-1 bg-white hover:bg-soft-gray text-black text-xs font-bold px-2.5 py-1.5 border border-black"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Xóa thẻ</span>
                </button>
              </div>
            </div>

            {/* AI Auto-QA Trap Banner */}
            {aiBannerVisible && (
              <div
                data-testid="ai-autoqa-banner"
                className="bg-indigo-50 border-2 border-night-navy p-3.5 space-y-2.5 animate-fadeIn"
              >
                <div className="flex items-start gap-2.5">
                  <Bot className="w-5 h-5 text-night-navy flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-neutral-900 leading-relaxed">
                    <div className="font-black uppercase text-night-navy mb-0.5">
                      Kết Luận Từ AI Auto-QA:
                    </div>
                    <p>{scenario.aiAutoQaTrap.aiMessage}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleRejectAiAutoQa}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-100 text-black text-xs font-black px-3 py-1.5 border-2 border-black"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Bác bỏ kết luận AI &amp; Khôi phục</span>
                  </button>
                </div>
              </div>
            )}

            {aiExplicitlyRejected && !aiBannerVisible && (
              <div className="bg-soft-gray border border-black px-3 py-2 text-[11px] font-bold text-neutral-800">
                Đã bác bỏ kết luận của AI Auto-QA — Bạn đang tự rà soát thủ công.
              </div>
            )}

            {/* ============================================================
             * TAB 1: BẢNG 15 ĐƠN HÀNG (DATA CLEANING GRID)
             * ============================================================ */}
            {activeTab === 'DATA_GRID' && (
              <div className="space-y-2">
                <p className="text-xs text-muted-gray">
                  Bấm trực tiếp vào <strong>bất kỳ dòng đơn hàng nào</strong> có dấu hiệu bất thường để gắn 1 trong 4 loại thẻ lỗi (dựa trên Quy chuẩn Dữ liệu ở Cột Trái).
                </p>

                <div className="overflow-x-auto border border-black">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-soft-gray border-b-2 border-black text-[11px] font-black uppercase">
                      <tr>
                        <th className="px-2.5 py-2">Mã đơn</th>
                        <th className="px-2.5 py-2">Ngày / Giờ</th>
                        <th className="px-2.5 py-2">Khách hàng &amp; SĐT</th>
                        <th className="px-2.5 py-2">Sản phẩm</th>
                        <th className="px-2 py-2 text-right">SL</th>
                        <th className="px-2.5 py-2 text-right">Đơn giá</th>
                        <th className="px-2.5 py-2 text-right">Thành tiền</th>
                        <th className="px-2.5 py-2">Địa chỉ</th>
                        <th className="px-2.5 py-2 text-center">Thẻ QA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      {scenario.orders.map(order => {
                        const flaggedCat = flaggedOrders[order.id] || null;
                        const isExpanded = expandedOrderId === order.id;

                        return (
                          <React.Fragment key={order.id}>
                            <tr
                              data-testid={`order-row-${order.id}`}
                              onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                              className={`cursor-pointer transition-colors ${
                                isExpanded
                                  ? 'bg-amber-50'
                                  : flaggedCat
                                    ? 'bg-neutral-100'
                                    : 'hover:bg-soft-gray'
                              }`}
                            >
                              <td className="px-2.5 py-2.5 font-mono font-bold text-black whitespace-nowrap">
                                {order.orderCode}
                              </td>
                              <td className="px-2.5 py-2.5 font-mono whitespace-nowrap">
                                <div>{order.orderDate}</div>
                                <div className="text-[10px] text-muted-gray">{order.orderTime}</div>
                              </td>
                              <td className="px-2.5 py-2.5 whitespace-nowrap">
                                <div className="font-bold text-black">{order.customerName}</div>
                                <div className="font-mono text-[11px] text-muted-gray">
                                  {order.phone}
                                </div>
                              </td>
                              <td className="px-2.5 py-2.5 max-w-[150px] truncate" title={order.productName}>
                                {order.productName}
                              </td>
                              <td className="px-2 py-2.5 text-right font-mono">{order.quantity}</td>
                              <td className="px-2.5 py-2.5 text-right font-mono whitespace-nowrap">
                                {formatPrice(order.unitPriceVnd)}
                              </td>
                              <td className="px-2.5 py-2.5 text-right font-mono font-bold whitespace-nowrap">
                                {formatPrice(order.totalPriceVnd)}
                              </td>
                              <td className="px-2.5 py-2.5 max-w-[155px] truncate" title={order.address}>
                                {order.address}
                              </td>
                              <td className="px-2.5 py-2.5 text-center whitespace-nowrap">
                                {flaggedCat ? (
                                  <span className="inline-flex items-center gap-1 bg-black text-accent px-2 py-0.5 text-[10px] font-black uppercase">
                                    <Bug className="w-3 h-3" />
                                    {DEFECT_BADGE_MAP[flaggedCat]}
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-muted-gray underline">
                                    Gắn thẻ
                                  </span>
                                )}
                              </td>
                            </tr>

                            {/* Inline Tactile Defect Tagger Bar */}
                            {isExpanded && (
                              <tr className="bg-amber-50/80 border-y-2 border-black">
                                <td colSpan={9} className="px-3 py-3">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-xs font-black text-black">
                                      Chọn loại lỗi cho đơn <span className="font-mono">{order.orderCode}</span>:
                                    </span>
                                    <div className="flex flex-wrap items-center gap-2">
                                      {scenario.rules.map(rule => (
                                        <button
                                          key={rule.id}
                                          type="button"
                                          onClick={e => {
                                            e.stopPropagation();
                                            handleTagOrder(order.id, rule.id);
                                          }}
                                          className={`px-2.5 py-1.5 text-[11px] font-black uppercase border border-black transition-colors ${
                                            flaggedCat === rule.id
                                              ? 'bg-accent text-black'
                                              : 'bg-white text-black hover:bg-black hover:text-white'
                                          }`}
                                        >
                                          {rule.code}
                                        </button>
                                      ))}

                                      {flaggedCat && (
                                        <button
                                          type="button"
                                          onClick={e => {
                                            e.stopPropagation();
                                            handleTagOrder(order.id, null);
                                          }}
                                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold border border-black bg-neutral-200 hover:bg-neutral-300 text-black"
                                        >
                                          <X className="w-3 h-3" />
                                          <span>Gỡ thẻ (Đơn sạch)</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================================
             * TAB 2: SƠ ĐỒ LUỒNG LOGIC THANH TOÁN TIẾNG VIỆT (7 BƯỚC — 0 DÒNG CODE)
             * ============================================================ */}
            {activeTab === 'LOGIC_FLOW' && (
              <div className="space-y-3">
                <p className="text-xs text-muted-gray">
                  Đọc lần lượt từng bước trong sơ đồ quy trình thanh toán dưới đây. Bấm trực tiếp vào <strong>các bước chứa lỗ hổng logic</strong> gây âm tiền hoặc mất tiền oan của khách hàng để gắn thẻ Bug Logic!
                </p>

                <div className="space-y-2">
                  {scenario.flowNodes.map((node, index) => {
                    const selectedReasonId = flaggedNodes[node.id] || null;
                    const isExpanded = expandedNodeId === node.id;

                    return (
                      <div key={node.id} className="flex flex-col items-center">
                        <div
                          data-testid={`flow-node-${node.id}`}
                          className={`w-full border-2 transition-all ${
                            selectedReasonId
                              ? 'border-black bg-amber-50/70 shadow-[3px_3px_0px_0px_#000]'
                              : isExpanded
                                ? 'border-black bg-soft-gray'
                                : 'border-black bg-white hover:bg-soft-gray/60'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setExpandedNodeId(isExpanded ? null : node.id)}
                            className="w-full p-3.5 text-left flex items-start justify-between gap-3"
                          >
                            <div className="flex items-start gap-3">
                              <span className="w-7 h-7 bg-black text-white font-mono font-black text-xs flex items-center justify-center flex-shrink-0">
                                B{node.stepNumber}
                              </span>
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs sm:text-sm font-black text-black">
                                    {node.title}
                                  </span>
                                  <span className="text-[10px] font-mono bg-soft-gray border border-hairline px-1.5 py-0.5 text-muted-gray">
                                    {node.actor}
                                  </span>
                                </div>
                                <p className="text-xs text-neutral-800 leading-relaxed">
                                  {node.vietnameseRule}
                                </p>
                              </div>
                            </div>

                            <div className="flex-shrink-0">
                              {selectedReasonId ? (
                                <span className="inline-flex items-center gap-1 bg-black text-accent px-2.5 py-1 text-[10px] font-black uppercase">
                                  <Bug className="w-3 h-3" />
                                  ĐÃ BÁO BUG LOGIC
                                </span>
                              ) : (
                                <span className="text-[11px] font-bold text-muted-gray border border-black px-2 py-0.5 bg-white">
                                  Kiểm tra bước này
                                </span>
                              )}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="px-4 pb-4 pt-2 border-t border-black bg-white space-y-2.5">
                              <div className="text-xs font-black text-black">
                                Bạn phát hiện lỗ hổng logic nào tại Bước {node.stepNumber}?
                              </div>
                              <div className="space-y-2">
                                {node.bugOptions.map(opt => (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => handleTagFlowNode(node.id, opt.id)}
                                    className={`w-full text-left p-2.5 border text-xs transition-colors flex items-start gap-2 ${
                                      selectedReasonId === opt.id
                                        ? 'border-2 border-black bg-accent/20 font-bold text-black'
                                        : 'border-hairline hover:border-black bg-soft-gray text-neutral-800'
                                    }`}
                                  >
                                    <Bug className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-black" />
                                    <span>{opt.label}</span>
                                  </button>
                                ))}
                              </div>

                              <div className="flex justify-end pt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleTagFlowNode(node.id, null);
                                    setExpandedNodeId(null);
                                  }}
                                  className="text-xs font-bold text-muted-gray hover:text-black underline"
                                >
                                  Bước này hợp lệ (Gỡ thẻ lỗi)
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {index < scenario.flowNodes.length - 1 && (
                          <ArrowDown className="w-4 h-4 text-black my-1" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* QA Sign-Off Decision & Bug Report Note */}
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b-2 border-black pb-2">
              <h2 className="text-sm font-black uppercase text-black">
                Quyết Định Release 20:00 &amp; Báo Cáo Lỗi Gửi Đội Kỹ Thuật
              </h2>
              <span className="text-[11px] font-mono text-muted-gray">
                Bắt buộc chọn quyết định &amp; tóm tắt lỗi nghiêm trọng
              </span>
            </div>

            {/* Operational Stamp Decision */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setReleaseDecision('BLOCK_RELEASE')}
                className={`p-3.5 border-2 text-left transition-all flex items-start gap-3 ${
                  releaseDecision === 'BLOCK_RELEASE'
                    ? 'border-black bg-black text-white shadow-[3px_3px_0px_0px_#fa9000]'
                    : 'border-black bg-white hover:bg-soft-gray text-black'
                }`}
              >
                <ShieldAlert
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    releaseDecision === 'BLOCK_RELEASE' ? 'text-accent' : 'text-live-red'
                  }`}
                />
                <div>
                  <div className="text-xs font-black uppercase">CHẶN RELEASE (BLOCK)</div>
                  <div
                    className={`text-[11px] mt-0.5 ${
                      releaseDecision === 'BLOCK_RELEASE' ? 'text-gray-300' : 'text-muted-gray'
                    }`}
                  >
                    Tạm hoãn mở bán để đội kỹ thuật vá lỗi dữ liệu &amp; lỗ hổng thanh toán nghiêm trọng.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setReleaseDecision('APPROVE_RELEASE')}
                className={`p-3.5 border-2 text-left transition-all flex items-start gap-3 ${
                  releaseDecision === 'APPROVE_RELEASE'
                    ? 'border-black bg-black text-white shadow-[3px_3px_0px_0px_#fa9000]'
                    : 'border-black bg-white hover:bg-soft-gray text-black'
                }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    releaseDecision === 'APPROVE_RELEASE' ? 'text-accent' : 'text-emerald-700'
                  }`}
                />
                <div>
                  <div className="text-xs font-black uppercase">DUYỆT RELEASE (APPROVE)</div>
                  <div
                    className={`text-[11px] mt-0.5 ${
                      releaseDecision === 'APPROVE_RELEASE' ? 'text-gray-300' : 'text-muted-gray'
                    }`}
                  >
                    Xác nhận hệ thống đủ an toàn để mở bán Flash-Sale 11.11 đúng 20:00.
                  </div>
                </div>
              </button>
            </div>

            <div>
              <label htmlFor="qa-bug-report-note" className="block text-xs font-bold text-black mb-1">
                Tóm tắt các lỗi nghiêm trọng nhất gửi Đội Kỹ Thuật (tối thiểu 15 ký tự):
              </label>
              <textarea
                id="qa-bug-report-note"
                rows={3}
                placeholder="VD: Phát hiện lỗi dữ liệu ngày 30/02, giá âm, sai tổng tiền, đơn trùng lặp và 2 lỗi logic thanh toán nghiêm trọng ở Bước 3 (âm tiền) và Bước 5 (trừ ví không hoàn tiền khi hết hàng)..."
                value={bugReportNote}
                onChange={e => {
                  setBugReportNote(e.target.value);
                  telemetryBus.publish('plan_note_updated', {
                    char_count: e.target.value.length,
                  });
                }}
                className="w-full border-2 border-black p-3 text-xs leading-relaxed focus:outline-none focus:bg-amber-50/40"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-hairline">
              <span className="text-[11px] text-muted-gray">
                {releaseDecision === null
                  ? 'Hãy chọn CHẶN RELEASE hoặc DUYỆT RELEASE ở trên.'
                  : bugReportNote.trim().length < 15
                    ? 'Hãy nhập bản tóm tắt lỗi gửi Đội Kỹ Thuật (tối thiểu 15 ký tự).'
                    : 'Đã sẵn sàng gửi báo cáo QA! Hãy nhớ kiểm tra cả 2 Tab trước khi nộp.'}
              </span>

              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleFinalizeSubmit}
                className="btn-pill-dark text-xs py-3 px-6 bg-black text-white hover:bg-neutral-800 flex-shrink-0 gap-2"
              >
                <Send className="w-3.5 h-3.5 text-accent" />
                <span>GỬI BÁO CÁO QA &amp; CHỐT RELEASE</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default QaDataWorkbench;
